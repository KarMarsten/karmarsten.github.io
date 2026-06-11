// ============================================================
// Google Calendar Integration
// Uses Google Identity Services (OAuth2 implicit flow)
// No backend required — runs entirely in the browser
// ============================================================

const CAL_TOKEN_KEY    = 'uyt_gcal_token';
const CAL_CLIENT_KEY   = 'uyt_gcal_client_id';
const CAL_EXPIRY_KEY   = 'uyt_gcal_expiry';
const USER_PROFILE_KEY = 'uyt_user_profile';
const CAL_SCOPE        = 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile';
const CAL_API_BASE     = 'https://www.googleapis.com/calendar/v3';

// In-memory state
const calState = {
  token: null,
  clientId: null,
  tokenClient: null,
  events: [],
  fetchError: null,
  userProfile: null,
};

// ── Bootstrap ───────────────────────────────────────────────

function calInit() {
  calState.clientId = localStorage.getItem(CAL_CLIENT_KEY) || '';
  calState.userProfile = loadUserProfile();

  const token  = localStorage.getItem(CAL_TOKEN_KEY);
  const expiry = Number(localStorage.getItem(CAL_EXPIRY_KEY) || 0);
  if (token && Date.now() < expiry) {
    calState.token = token;
    calFetchUpcoming().catch(() => calClearToken());
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

// ── OAuth2 flow ──────────────────────────────────────────────

function calConnect() {
  const clientId = (document.getElementById('gcal-client-id-input')?.value || '').trim()
                || calState.clientId;
  if (!clientId) {
    alert('Please enter your Google Client ID first.');
    return;
  }

  calState.clientId = clientId;
  localStorage.setItem(CAL_CLIENT_KEY, clientId);

  if (typeof google === 'undefined' || !google.accounts) {
    alert('Google Identity Services failed to load. Check your internet connection and try again.');
    return;
  }

  calState.tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: CAL_SCOPE,
    callback: async (resp) => {
      if (resp.error) {
        console.error('GCal auth error:', resp);
        alert('Calendar connection failed: ' + resp.error);
        return;
      }

      calState.token = resp.access_token;
      const expiry = Date.now() + (resp.expires_in || 3600) * 1000;
      localStorage.setItem(CAL_TOKEN_KEY, calState.token);
      localStorage.setItem(CAL_EXPIRY_KEY, String(expiry));

      // Fetch user's name/profile from Google
      await calFetchUserProfile();
      await calFetchUpcoming();

      if (typeof renderSettingsPanel === 'function') renderSettingsPanel();
      if (typeof renderDashboard     === 'function') renderDashboard();
    },
  });

  calState.tokenClient.requestAccessToken({ prompt: 'consent' });
}

async function calFetchUserProfile() {
  if (!calState.token) return;
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${calState.token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    saveUserProfile({
      name:    data.name    || '',
      email:   data.email   || '',
      picture: data.picture || '',
    });
  } catch (err) {
    console.warn('Could not fetch user profile:', err);
  }
}

function calDisconnect() {
  if (calState.token && typeof google !== 'undefined') {
    google.accounts.oauth2.revoke(calState.token, () => {});
  }
  calClearToken();
  calState.events = [];
  saveUserProfile(null);
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

  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + daysAhead);

  const params = new URLSearchParams({
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
        if (json.error?.message) errorMsg = json.error.message;
        else if (json.error_description) errorMsg = json.error_description;
      } catch (_err) {}
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

function calTodayEvents() {
  const today = new Date().toDateString();
  return calState.events.filter(e => new Date(e.start).toDateString() === today);
}

function calUpcomingEvents() {
  return calState.events;
}

function calFormatEventTime(event) {
  if (event.allDay) return 'All day';
  const d = new Date(event.start);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function calFormatEventDate(event) {
  const d = new Date(event.start);
  const today    = new Date();
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString())    return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
