// UseYourTools for Work — Main App

/* ============================================================
   Zen Quotes
   ============================================================ */
const ZEN_QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus is not about saying yes to the thing you've got to focus on. It's about saying no to the hundred other good ideas.", author: "Steve Jobs" },
  { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs" },
  { text: "It's not about having time. It's about making time.", author: "Unknown" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Deep work is the ability to focus without distraction on a cognitively demanding task.", author: "Cal Newport" },
  { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
  { text: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { text: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Time is what we want most but what we use worst.", author: "William Penn" },
  { text: "You will never find time for anything. If you want time, you must make it.", author: "Charles Buxton" },
  { text: "Work smarter, not harder.", author: "Allan F. Mogensen" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "I am not a product of my circumstances. I am a product of my decisions.", author: "Stephen Covey" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Today's accomplishments were yesterday's impossibilities.", author: "Robert H. Schuller" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
];

function getDailyQuote() {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  return ZEN_QUOTES[dayOfYear % ZEN_QUOTES.length];
}

/* ============================================================
   Date / Time helpers
   ============================================================ */

function formatTime(hour, minute = 0, use12 = true) {
  if (use12) {
    const period = hour < 12 ? 'AM' : 'PM';
    const h = hour % 12 || 12;
    const m = String(minute).padStart(2, '0');
    return minute ? `${h}:${m} ${period}` : `${h} ${period}`;
  } else {
    const h = String(hour).padStart(2, '0');
    const m = String(minute).padStart(2, '0');
    return `${h}:${m}`;
  }
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateShort(date) {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function isoDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ============================================================
   SVG Icons
   ============================================================ */

const ICONS = {
  home:     `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  planner:  `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  cases:    `<svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`,
  quote:    `<svg viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
};

/* ============================================================
   Planner notes storage
   ============================================================ */

const NOTES_KEY = 'uyt_planner_notes';

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}'); }
  catch { return {}; }
}

function saveNote(dateKey, hour, text) {
  const notes = loadNotes();
  if (!notes[dateKey]) notes[dateKey] = {};
  notes[dateKey][hour] = text;
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

/* ============================================================
   App State
   ============================================================ */

const state = {
  screen: 'dashboard',
  prefs: loadPrefs(),
  plannerDate: new Date(),
};

/* ============================================================
   Navigation
   ============================================================ */

function navigate(screen) {
  state.screen = screen;

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.screen === screen);
  });

  document.querySelectorAll('.screen').forEach(el => {
    el.classList.toggle('active', el.id === `screen-${screen}`);
  });

  if (screen === 'dashboard') renderDashboard();
  if (screen === 'planner')   renderPlanner();
}

/* ============================================================
   Settings Panel
   ============================================================ */

function openSettings() {
  document.getElementById('settings-panel').classList.add('open');
  document.getElementById('settings-overlay').classList.add('open');
  renderSettingsPanel();
}

function closeSettings() {
  document.getElementById('settings-panel').classList.remove('open');
  document.getElementById('settings-overlay').classList.remove('open');
}

function renderSettingsPanel() {
  const p    = state.prefs;
  const body = document.getElementById('settings-body');
  const connected = calIsConnected();

  body.innerHTML = `
    <!-- Profile -->
    <div class="settings-section">
      <div class="settings-section-title">Profile</div>
      <div class="settings-row">
        <div class="settings-label">Your name</div>
        <input class="settings-input" style="width:140px" id="pref-name" type="text"
          placeholder="e.g. Alex" value="${escHtml(p.userName)}">
      </div>
    </div>



    <!-- Appearance -->
    <div class="settings-section">
      <div class="settings-section-title">Appearance</div>
      <div class="settings-row" style="flex-direction:column;align-items:flex-start;gap:12px">
        <div class="settings-label">Color scheme</div>
        <div class="theme-swatches">${renderThemeSwatches(p.colorScheme)}</div>
      </div>
      <div class="settings-row" style="${p.colorScheme !== 'modern' ? 'opacity:0.4;pointer-events:none' : ''}">
        <div class="settings-label">
          Dark mode
          <span class="settings-sublabel">Modern theme only</span>
        </div>
        <label class="toggle">
          <input type="checkbox" id="pref-dark" ${p.darkMode ? 'checked' : ''}>
          <div class="toggle-track"></div>
        </label>
      </div>
    </div>

    <!-- Time & Planner -->
    <div class="settings-section">
      <div class="settings-section-title">Time &amp; Planner</div>
      <div class="settings-row">
        <div class="settings-label">Day starts at</div>
        <select class="settings-select" id="pref-start">${hourOptions(p.startHour, p.use12HourClock)}</select>
      </div>
      <div class="settings-row">
        <div class="settings-label">Day ends at</div>
        <select class="settings-select" id="pref-end">${hourOptions(p.endHour, p.use12HourClock)}</select>
      </div>
      <div class="settings-row">
        <div class="settings-label">12-hour clock</div>
        <label class="toggle">
          <input type="checkbox" id="pref-12h" ${p.use12HourClock ? 'checked' : ''}>
          <div class="toggle-track"></div>
        </label>
      </div>
    </div>

    <!-- Content -->
    <div class="settings-section">
      <div class="settings-section-title">Content</div>
      <div class="settings-row">
        <div class="settings-label">
          Daily quote
          <span class="settings-sublabel">Show a motivational quote on the dashboard</span>
        </div>
        <label class="toggle">
          <input type="checkbox" id="pref-quotes" ${p.showZenQuotes ? 'checked' : ''}>
          <div class="toggle-track"></div>
        </label>
      </div>
    </div>

    <!-- Google Calendar -->
    <div class="settings-section">
      <div class="settings-section-title">Google Calendar</div>
      ${connected ? `
        <div class="cal-connect-box">
          <div class="cal-connected-row">
            <div class="cal-status-dot"></div>
            <div class="cal-status-label">Connected${calState.userProfile?.name ? ` as ${escHtml(calState.userProfile.name)}` : ''}</div>
            <button class="cal-disconnect-btn" onclick="calDisconnect()">Disconnect</button>
          </div>
        </div>
      ` : `
        <div class="cal-connect-box">
          <p>
            Connect your Google Calendar to see upcoming events on the dashboard and in your daily planner.
            You'll need a Google OAuth Client ID —
            <a href="https://console.cloud.google.com/apis/credentials" target="_blank">create one here</a>
            (set the authorized origin to <code>https://klm-snyk.github.io</code> and
            <code>http://localhost:4200</code> for local testing).
          </p>
          <div class="cal-input-row">
            <input
              class="cal-client-input"
              id="gcal-client-id-input"
              type="text"
              placeholder="Your Google Client ID (…apps.googleusercontent.com)"
              value="${escHtml(calState.clientId || '')}">
            <button class="cal-connect-btn" onclick="calConnect()">Connect</button>
          </div>
        </div>
      `}
    </div>

    <!-- Coming Soon -->
    <div class="settings-section">
      <div class="settings-section-title">Coming Soon</div>
      <div class="settings-row">
        <div class="settings-label">
          Cases
          <span class="settings-sublabel">JIRA or Salesforce caseload</span>
        </div>
        <span style="font-size:11px;color:var(--text-secondary);font-weight:600;background:var(--surface);padding:3px 8px;border-radius:99px">Soon</span>
      </div>
    </div>
  `;

  bindSettingEvents();
}

function renderThemeSwatches(selected) {
  const themes = [
    { id: 'modern', color: '#6366F1', label: 'Modern' },
    { id: 'earth',  color: '#8C6A4A', label: 'Earth'  },
    { id: 'nature', color: '#5A8A6A', label: 'Nature' },
    { id: 'sunny',  color: '#D4A574', label: 'Sunny'  },
    { id: 'purple', color: '#9B6FA8', label: 'Violet' },
  ];
  return themes.map(t => `
    <div class="theme-option" onclick="selectTheme('${t.id}')">
      <div class="theme-swatch ${selected === t.id ? 'selected' : ''}" style="background:${t.color}"></div>
      <span class="theme-swatch-label">${t.label}</span>
    </div>
  `).join('');
}

function hourOptions(selectedHour, use12) {
  let html = '';
  for (let h = 0; h <= 23; h++) {
    const label = formatTime(h, 0, use12);
    html += `<option value="${h}" ${h === selectedHour ? 'selected' : ''}>${label}</option>`;
  }
  return html;
}

function selectTheme(themeId) {
  state.prefs.colorScheme = themeId;
  if (themeId !== 'modern') state.prefs.darkMode = false;
  savePrefs(state.prefs);
  applyTheme(state.prefs);
  renderSettingsPanel();
  if (state.screen === 'dashboard') renderDashboard();
}

function bindSettingEvents() {
  const nameEl = document.getElementById('pref-name');
  if (nameEl) nameEl.addEventListener('change', () => {
    state.prefs.userName = nameEl.value.trim();
    savePrefs(state.prefs);
    if (state.screen === 'dashboard') renderDashboard();
  });

  const darkEl = document.getElementById('pref-dark');
  if (darkEl) darkEl.addEventListener('change', () => {
    state.prefs.darkMode = darkEl.checked;
    savePrefs(state.prefs);
    applyTheme(state.prefs);
  });

  const startEl = document.getElementById('pref-start');
  if (startEl) startEl.addEventListener('change', () => {
    state.prefs.startHour = Number(startEl.value);
    savePrefs(state.prefs);
    if (state.screen === 'planner') renderPlanner();
  });

  const endEl = document.getElementById('pref-end');
  if (endEl) endEl.addEventListener('change', () => {
    state.prefs.endHour = Number(endEl.value);
    savePrefs(state.prefs);
    if (state.screen === 'planner') renderPlanner();
  });

  const h12El = document.getElementById('pref-12h');
  if (h12El) h12El.addEventListener('change', () => {
    state.prefs.use12HourClock = h12El.checked;
    savePrefs(state.prefs);
    const s = document.getElementById('pref-start');
    const e = document.getElementById('pref-end');
    if (s) s.innerHTML = hourOptions(state.prefs.startHour, state.prefs.use12HourClock);
    if (e) e.innerHTML = hourOptions(state.prefs.endHour, state.prefs.use12HourClock);
    if (state.screen === 'planner') renderPlanner();
  });

  const quotesEl = document.getElementById('pref-quotes');
  if (quotesEl) quotesEl.addEventListener('change', () => {
    state.prefs.showZenQuotes = quotesEl.checked;
    savePrefs(state.prefs);
    if (state.screen === 'dashboard') renderDashboard();
  });
}

/* ============================================================
   About Panel
   ============================================================ */

function openAbout() {
  document.getElementById('about-panel').classList.add('open');
  document.getElementById('about-overlay').classList.add('open');
}

function closeAbout() {
  document.getElementById('about-panel').classList.remove('open');
  document.getElementById('about-overlay').classList.remove('open');
}

/* ============================================================
   Dashboard
   ============================================================ */

function renderDashboard() {
  const el = document.getElementById('dash-content');
  const p  = state.prefs;
  const now = new Date();
  const profileName = calState.userProfile?.name || p.userName;
  const greeting = `${getGreeting()}${profileName ? `, ${profileName}` : ''}`;
  const quote = getDailyQuote();
  const events = calUpcomingEvents();

  // Build events card content
  let eventsCardContent = '';
  if (!calIsConnected()) {
    eventsCardContent = `
      <div class="dash-card-value">—</div>
      <div class="dash-card-sub">Connect your Google Calendar to see upcoming events</div>
      <div class="dash-card-action" onclick="openSettings()" style="cursor:pointer">
        Connect calendar ${ICONS.arrowRight}
      </div>`;
  } else if (calState.fetchError) {
    eventsCardContent = `
      <div class="dash-card-value" style="font-size:16px;font-weight:500">Unable to load events</div>
      <div class="dash-card-sub">${escHtml(calState.fetchError)}</div>
      <div class="dash-card-action" onclick="openSettings()" style="cursor:pointer">
        Reconnect calendar ${ICONS.arrowRight}
      </div>`;
  } else if (events.length === 0) {
    eventsCardContent = `
      <div class="dash-card-value" style="font-size:16px;font-weight:500">All clear</div>
      <div class="dash-card-sub">No upcoming events in the next 7 days</div>`;
  } else {
    const todayEvents = calTodayEvents();
    eventsCardContent = `
      <div class="dash-card-value" style="font-size:22px">${todayEvents.length} today</div>
      <div class="event-list">
        ${events.slice(0, 4).map(e => `
          <a class="event-item" href="${escHtml(e.link)}" target="_blank">
            <div class="event-time-col">${calFormatEventTime(e)}</div>
            <div class="event-details">
              <div class="event-title">${escHtml(e.title)}</div>
              <div class="event-date-label">${calFormatEventDate(e)}</div>
            </div>
          </a>
        `).join('')}
      </div>`;
  }

  el.innerHTML = `
    <div class="dashboard-greeting">
      <div class="time-display" id="live-time">${formatCurrentTime()}</div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:space-between;">
        <h3 style="margin:0;">${escHtml(greeting)}</h3>
        <button class="connect-btn" onclick="${calIsConnected() ? 'calDisconnect()' : 'calConnect()'}">
          ${calIsConnected() ? 'Sign out' : 'Connect Google Calendar'}
        </button>
      </div>
      <div class="date-display">${formatDate(now)}</div>
    </div>

    <div class="dashboard-cards">
      <div class="dash-card" onclick="navigate('planner')">
        <div class="dash-card-header">
          <div class="dash-card-icon">${ICONS.planner}</div>
          <div class="dash-card-title">Today's Planner</div>
        </div>
        <div class="dash-card-value">${formatTime(now.getHours(), 0, p.use12HourClock)}</div>
        <div class="dash-card-sub">Open your day view →</div>
      </div>

      <div class="dash-card" onclick="navigate('cases')">
        <div class="dash-card-header">
          <div class="dash-card-icon">${ICONS.cases}</div>
          <div class="dash-card-title">Cases</div>
        </div>
        <div class="dash-card-value">—</div>
        <div class="dash-card-sub">Connect JIRA or Salesforce to see your caseload</div>
        <div class="dash-card-action">Set up integration ${ICONS.arrowRight}</div>
      </div>

      <div class="dash-card">
        <div class="dash-card-header">
          <div class="dash-card-icon">${ICONS.calendar}</div>
          <div class="dash-card-title">Gmail</div>
        </div>
        ${!calIsConnected() ? `
          <div class="dash-card-value">—</div>
          <div class="dash-card-sub">Connect Google Calendar to also see your unread email count</div>
        ` : calState.unreadCount === null ? `
          <div class="dash-card-value">—</div>
          <div class="dash-card-sub">Loading inbox…</div>
        ` : calState.unreadCount === 0 ? `
          <div class="dash-card-value" style="font-size:22px">0 📭</div>
          <div class="dash-card-sub">Inbox zero. You beautiful, productive human.</div>
          <div class="dash-card-action"><a href="https://mail.google.com" target="_blank" style="color:inherit;text-decoration:none">Enjoy it while it lasts ${ICONS.arrowRight}</a></div>
        ` : `
          <div class="dash-card-value" style="font-size:22px">${calState.unreadCount}</div>
          <div class="dash-card-sub">unread email${calState.unreadCount === 1 ? '' : 's'} waiting for you</div>
          <div class="dash-card-action"><a href="https://mail.google.com" target="_blank" style="color:inherit;text-decoration:none">Open Gmail ${ICONS.arrowRight}</a></div>
        `}
      </div>

      <div class="dash-card">
        <div class="dash-card-header">
          <div class="dash-card-icon">${ICONS.calendar}</div>
          <div class="dash-card-title">Upcoming Events</div>
        </div>
        ${eventsCardContent}
      </div>

      ${p.showZenQuotes ? `
      <div class="dash-card quote-card">
        <div class="dash-card-header">
          <div class="dash-card-icon">${ICONS.quote}</div>
          <div class="dash-card-title" style="color:rgba(255,255,255,0.8)">Daily Quote</div>
        </div>
        <div class="dash-card-value">"${escHtml(quote.text)}"</div>
        <div class="dash-card-sub">— ${escHtml(quote.author)}</div>
      </div>` : ''}
    </div>
  `;

  startClock();
}

let clockInterval = null;

function formatCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: state.prefs.use12HourClock,
  });
}

function startClock() {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(() => {
    const el = document.getElementById('live-time');
    if (el) el.textContent = formatCurrentTime();
  }, 10000);
}

/* ============================================================
   Daily Planner
   ============================================================ */

function renderPlanner() {
  const p = state.prefs;
  const date = state.plannerDate;
  const notes = loadNotes();
  const dateKey = isoDateKey(date);
  const now = new Date();
  const isToday = isoDateKey(now) === dateKey;

  const navEl = document.getElementById('planner-nav-date');
  if (navEl) {
    navEl.innerHTML = `
      <strong>${formatDateShort(date)}</strong>
      <span class="day-name">${date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
    `;
  }

  const todayBtn = document.getElementById('planner-today-btn');
  if (todayBtn) todayBtn.style.display = isToday ? 'none' : '';

  const body = document.getElementById('planner-blocks');
  if (!body) return;

  let html = '';
  for (let h = p.startHour; h < p.endHour; h++) {
    const savedNote = (notes[dateKey] && notes[dateKey][h]) || '';
    const isCurrent = isToday && now.getHours() === h;
    html += `
      <div class="time-block${isCurrent ? ' current-hour' : ''}">
        <div class="time-label">${formatTime(h, 0, p.use12HourClock)}</div>
        <div class="time-block-content">
          <textarea class="time-block-notes" rows="2" placeholder="Add notes..."
            data-hour="${h}" data-date="${dateKey}">${escHtml(savedNote)}</textarea>
        </div>
      </div>
    `;
  }
  body.innerHTML = html;

  if (isToday) {
    setTimeout(() => {
      const cur = body.querySelector('.current-hour');
      if (cur) cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }

  body.querySelectorAll('.time-block-notes').forEach(ta => {
    ta.addEventListener('input', () => {
      saveNote(ta.dataset.date, Number(ta.dataset.hour), ta.value);
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    });
    if (ta.value) {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    }
  });
}

function plannerChangeDay(delta) {
  const d = new Date(state.plannerDate);
  d.setDate(d.getDate() + delta);
  state.plannerDate = d;
  renderPlanner();
}

function plannerGoToday() {
  state.plannerDate = new Date();
  renderPlanner();
}

/* ============================================================
   Helpers
   ============================================================ */

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================
   Init
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(state.prefs);
  calInit();

  // Nav
  document.querySelectorAll('.nav-item[data-screen]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.screen));
  });

  // Settings
  document.getElementById('settings-close').addEventListener('click', closeSettings);
  document.getElementById('settings-overlay').addEventListener('click', closeSettings);

  // About
  document.getElementById('about-close').addEventListener('click', closeAbout);
  document.getElementById('about-overlay').addEventListener('click', closeAbout);

  // Planner nav
  document.getElementById('planner-prev').addEventListener('click', () => plannerChangeDay(-1));
  document.getElementById('planner-next').addEventListener('click', () => plannerChangeDay(1));
  document.getElementById('planner-today-btn').addEventListener('click', plannerGoToday);

  navigate('dashboard');
});
