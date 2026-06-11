// ============================================================
// Google Calendar Integration
// Uses Google Identity Services (OAuth2 implicit flow)
// No backend required — runs entirely in the browser
// ============================================================

const CAL_TOKEN_KEY      = 'uyt_gcal_token';
const CAL_CLIENT_KEY     = 'uyt_gcal_client_id';
const CAL_EXPIRY_KEY     = 'uyt_gcal_expiry';
const USER_PROFILE_KEY   = 'uyt_user_profile';
const CAL_SCOPE          = 'https://www.googleapis.com/auth/calendar.readonly';
const CAL_API_BASE       = 'https://www.googleapis.com/calendar/v3';

// In-memory state
const calState = {
  token: null,
  clientId: null,
  tokenClient: null,
  events: [],          // cached events for today
  fetchError: null,
  userProfile: null,
};

// ── Bootstrap ───────────────────────────────────────────────

function calInit() {
  calState.clientId = localStorage.getItem(CAL_CLIENT_KEY) || '';
  calState.userProfile = loadUserProfile();

  const token   = localStorage.getItem(CAL_TOKEN_KEY);
  const expiry  = Number(localStorage.getItem(CAL_EXPIRY_KEY) || 0);
  if (token && Date.now() < expiry) {
    calState.token = token;
    calFetchUpcoming().catch(() => calClearToken());
  }

  if (calState.clientId) {
    initGoogleSignIn();
  }
}

function loadUserProfile() {
  try {
    return JSON.parse(localStorage.getItem(USER_PROFILE_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveUserProfile(profile) {
  if (profile) {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } else {
    localStorage.removeItem(USER_PROFILE_KEY);
  }
  calState.userProfile = profile;
}

function initGoogleSignIn() {
  if (typeof google === 'undefined' || !google.accounts?.id) return;

  google.accounts.id.initialize({
    client_id: calState.clientId,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: false,
  });
}

function handleCredentialResponse(response) {
  if (!response.credential) return;

  const profile = parseJwt(response.credential);
  const userProfile = {
    name: profile.name || '',
    email: profile.email || '',
    picture: profile.picture || '',
    locale: profile.locale || '',
  };

  saveUserProfile(userProfile);

  // If a valid calendar token exists, re-fetch events now that user is signed in
  if (calState.token) {
    calFetchUpcoming().then(() => {
      if (typeof renderSettingsPanel === 'function') renderSettingsPanel();
      if (typeof renderDashboard === 'function') renderDashboard();
    });
  } else {
    // No token yet — prompt the user to reconnect calendar
    if (typeof renderSettingsPanel === 'function') renderSettingsPanel();
    if (typeof renderDashboard === 'function') renderDashboard();
  }
}

function authSignIn() {
  if (!calState.clientId) {
    alert('Please enter your Google Client ID first.');
    return;
  }

  if (typeof google === 'undefined' || !google.accounts?.id) {
    alert('Google Identity Services failed to load. Try refreshing the page.');
    return;
  }

  initGoogleSignIn();
  google.accounts.id.prompt();
}

function authSignOut() {
  saveUserProfile(null);
  calClearToken();
  calState.events = [];
  if (typeof google !== 'undefined' && google.accounts?.id) {
    google.accounts.id.disableAutoSelect();
  }
  if (typeof renderSettingsPanel === 'function') renderSettingsPanel();
  if (typeof renderDashboard === 'function') renderDashboard();
}

function parseJwt(token) {
  const payload = token.split('.')[1];
  if (!payload) return {};
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(atob(base64).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

// ── OAuth2 flow ──────────────────────────────────────────────

function calConnect() {
  const clientId = (document.getElementById('gcal-client-id-input')?.value || '').trim()
                || calState.clientId;
  if (!clientId) {
    alert('Please enter your Google Client ID first.');
    return;
  }
  // Save client ID
  calState.clientId = clientId;
  localStorage.setItem(CAL_CLIENT_KEY, clientId);
  initGoogleSignIn();

  if (typeof google === 'undefined' || !google.accounts) {
    alert('Google Identity Services failed to load. Check your internet connection and try again.');
    return;
  }

  calState.tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: CAL_SCOPE,
    callback: (resp) => {
      if (resp.error) {
        console.error('GCal auth error:', resp);
        alert('Calendar connection failed: ' + resp.error);
        return;
      }
      // Token valid for ~1 hour
      calState.token = resp.access_token;
      const expiry = Date.now() + (resp.expires_in || 3600) * 1000;
      localStorage.setItem(CAL_TOKEN_KEY, calState.token);
      localStorage.setItem(CAL_EXPIRY_KEY, String(expiry));

      calFetchUpcoming().then(() => {
        // Re-render settings and dashboard
        if (typeof renderSettingsPanel === 'function') renderSettingsPanel();
        if (typeof renderDashboard     === 'function') renderDashboard();
      });
    },
  });

  calState.tokenClient.requestAccessToken({ prompt: 'consent' });
}

function calDisconnect() {
  if (calState.token && typeof google !== 'undefined') {
    google.accounts.oauth2.revoke(calState.token, () => {});
  }
  calClearToken();
  calState.events = [];
  if (typeof renderSettingsPanel === 'function') renderSettingsPanel();
  if (typeof renderDashboard     === 'function') renderDashboard();
}

function calClearToken() {
  calState.token = null;
  localStorage.removeItem(CAL_TOKEN_KEY);
  localStorage.removeItem(CAL_EXPIRY_KEY);
}

function calIsConnected() {
  return !!calState.token;
}

// ── API calls ────────────────────────────────────────────────

async function calFetchUpcoming(daysAhead = 7) {
  calState.fetchError = null;
  if (!calState.token) return [];

  const now     = new Date();
  const end     = new Date(now);
  end.setDate(end.getDate() + daysAhead);

  const params  = new URLSearchParams({
    calendarId:   'primary',
    timeMin:      now.toISOString(),
    timeMax:      end.toISOString(),
    maxResults:   20,
    singleEvents: 'true',
    orderBy:      'startTime',
  });

  try {
    const res = await fetch(`${CAL_API_BASE}/calendars/primary/events?${params}`, {
      headers: { Authorization: `Bearer ${calState.token}` },
    });

    if (res.status === 401) {
      calClearToken();
      calState.fetchError = 'Session expired — reconnect your calendar.';
      return [];
    }

    if (!res.ok) {
      let body = await res.text().catch(() => '');
      let errorMsg = body;
      try {
        const json = JSON.parse(body);
        if (json.error?.message) {
          errorMsg = json.error.message;
        } else if (json.error_description) {
          errorMsg = json.error_description;
        }
      } catch (_err) {
        // keep raw text if parsing fails
      }
      console.error('GCal fetch failed:', res.status, errorMsg);
      calState.fetchError = `Unable to load calendar events (${res.status}): ${escHtml(String(errorMsg || 'unknown error'))}`;
      return [];
    }

    const data = await res.json();
    calState.events = (data.items || []).map(item => ({
      id:       item.id,
      title:    item.summary || '(no title)',
      start:    item.start?.dateTime || item.start?.date,
      end:      item.end?.dateTime   || item.end?.date,
      allDay:   !item.start?.dateTime,
      location: item.location || '',
      link:     item.htmlLink || '',
      color:    item.colorId  || null,
    }));
    calState.fetchError = null;
    return calState.events;
  } catch (err) {
    console.error('GCal fetch error:', err);
    calState.fetchError = 'Unable to reach Google Calendar.';
    return [];
  }
}

// ── Helpers ──────────────────────────────────────────────────

/** Events happening today */
function calTodayEvents() {
  const today = new Date().toDateString();
  return calState.events.filter(e => new Date(e.start).toDateString() === today);
}

/** All cached upcoming events */
function calUpcomingEvents() {
  return calState.events;
}

/** Format a calendar event time for display */
function calFormatEventTime(event) {
  if (event.allDay) return 'All day';
  const d = new Date(event.start);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/** Format event date label */
function calFormatEventDate(event) {
  const d = new Date(event.start);
  const today = new Date();
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString())    return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
