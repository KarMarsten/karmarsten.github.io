// UseYourTools for Work — Main App

/* ============================================================
   Zen Quotes (ported from iOS app, 7 themes × 7 quotes)
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
  // Returns YYYY-MM-DD using local time
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
  home: `<svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  planner: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  cases: `<svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`,
  settings: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`,
  quote: `<svg viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`,
  clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  chevronLeft: `<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`,
  x: `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
  inbox: `<svg viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>`,
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
  screen: 'dashboard',        // dashboard | planner | cases
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
  const p = state.prefs;
  const body = document.getElementById('settings-body');

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
        <div class="theme-swatches">
          ${renderThemeSwatches(p.colorScheme)}
        </div>
      </div>
      <div class="settings-row" id="dark-mode-row" style="${p.colorScheme !== 'modern' ? 'opacity:0.4;pointer-events:none' : ''}">
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

    <!-- Time -->
    <div class="settings-section">
      <div class="settings-section-title">Time & Planner</div>
      <div class="settings-row">
        <div class="settings-label">Day starts at</div>
        <select class="settings-select" id="pref-start">
          ${hourOptions(p.startHour, p.use12HourClock)}
        </select>
      </div>
      <div class="settings-row">
        <div class="settings-label">Day ends at</div>
        <select class="settings-select" id="pref-end">
          ${hourOptions(p.endHour, p.use12HourClock)}
        </select>
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

    <!-- Integrations -->
    <div class="settings-section">
      <div class="settings-section-title">Integrations</div>
      <div class="settings-row">
        <div class="settings-label">
          Calendar
          <span class="settings-sublabel">Coming soon</span>
        </div>
        <select class="settings-select" id="pref-cal" disabled>
          <option value="none">None</option>
          <option value="google">Google Calendar</option>
          <option value="outlook">Outlook</option>
        </select>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          Email client
          <span class="settings-sublabel">Coming soon</span>
        </div>
        <select class="settings-select" id="pref-email" disabled>
          <option value="default">Default</option>
          <option value="gmail">Gmail</option>
        </select>
      </div>
      <div class="settings-row">
        <div class="settings-label">
          Case management
          <span class="settings-sublabel">JIRA or Salesforce — coming soon</span>
        </div>
        <select class="settings-select" id="pref-cases" disabled>
          <option value="none">None</option>
          <option value="jira">JIRA</option>
          <option value="salesforce">Salesforce</option>
        </select>
      </div>
    </div>
  `;

  // Bind live changes
  bindSettingEvents();
}

function renderThemeSwatches(selected) {
  const themes = [
    { id: 'modern',  color: '#6366F1', label: 'Modern'   },
    { id: 'earth',   color: '#8C6A4A', label: 'Earth'    },
    { id: 'nature',  color: '#5A8A6A', label: 'Nature'   },
    { id: 'sunny',   color: '#D4A574', label: 'Sunny'    },
    { id: 'purple',  color: '#9B6FA8', label: 'Violet'   },
  ];
  return themes.map(t => `
    <div class="theme-option" onclick="selectTheme('${t.id}')">
      <div class="theme-swatch ${selected === t.id ? 'selected' : ''}"
           data-theme-id="${t.id}"
           style="background:${t.color}"></div>
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
  // Dark mode only valid for modern
  if (themeId !== 'modern') state.prefs.darkMode = false;
  savePrefs(state.prefs);
  applyTheme(state.prefs);
  renderSettingsPanel();
  if (state.screen === 'dashboard') renderDashboard();
}

function bindSettingEvents() {
  // Name
  const nameEl = document.getElementById('pref-name');
  if (nameEl) nameEl.addEventListener('change', () => {
    state.prefs.userName = nameEl.value.trim();
    savePrefs(state.prefs);
    if (state.screen === 'dashboard') renderDashboard();
  });

  // Dark mode
  const darkEl = document.getElementById('pref-dark');
  if (darkEl) darkEl.addEventListener('change', () => {
    state.prefs.darkMode = darkEl.checked;
    savePrefs(state.prefs);
    applyTheme(state.prefs);
  });

  // Start hour
  const startEl = document.getElementById('pref-start');
  if (startEl) startEl.addEventListener('change', () => {
    state.prefs.startHour = Number(startEl.value);
    savePrefs(state.prefs);
    if (state.screen === 'planner') renderPlanner();
  });

  // End hour
  const endEl = document.getElementById('pref-end');
  if (endEl) endEl.addEventListener('change', () => {
    state.prefs.endHour = Number(endEl.value);
    savePrefs(state.prefs);
    if (state.screen === 'planner') renderPlanner();
  });

  // 12-hour clock
  const h12El = document.getElementById('pref-12h');
  if (h12El) h12El.addEventListener('change', () => {
    state.prefs.use12HourClock = h12El.checked;
    savePrefs(state.prefs);
    // Re-render start/end selects with updated format
    const s = document.getElementById('pref-start');
    const e = document.getElementById('pref-end');
    if (s) s.innerHTML = hourOptions(state.prefs.startHour, state.prefs.use12HourClock);
    if (e) e.innerHTML = hourOptions(state.prefs.endHour, state.prefs.use12HourClock);
    if (state.screen === 'planner') renderPlanner();
  });

  // Quotes
  const quotesEl = document.getElementById('pref-quotes');
  if (quotesEl) quotesEl.addEventListener('change', () => {
    state.prefs.showZenQuotes = quotesEl.checked;
    savePrefs(state.prefs);
    if (state.screen === 'dashboard') renderDashboard();
  });
}

/* ============================================================
   Dashboard
   ============================================================ */

function renderDashboard() {
  const el = document.getElementById('dash-content');
  const p = state.prefs;
  const now = new Date();
  const greeting = `${getGreeting()}${p.userName ? `, ${p.userName}` : ''}`;
  const quote = getDailyQuote();

  el.innerHTML = `
    <div class="dashboard-greeting">
      <div class="time-display" id="live-time">${formatCurrentTime()}</div>
      <h3>${escHtml(greeting)}</h3>
      <div class="date-display">${formatDate(now)}</div>
    </div>

    <div class="dashboard-cards">
      <!-- Today's Planner -->
      <div class="dash-card" onclick="navigate('planner')">
        <div class="dash-card-header">
          <div class="dash-card-icon">${ICONS.planner}</div>
          <div class="dash-card-title">Today's Planner</div>
        </div>
        <div class="dash-card-value">${formatTime(now.getHours(), 0, p.use12HourClock)}</div>
        <div class="dash-card-sub">Open your day view →</div>
      </div>

      <!-- Cases placeholder -->
      <div class="dash-card" onclick="navigate('cases')">
        <div class="dash-card-header">
          <div class="dash-card-icon">${ICONS.cases}</div>
          <div class="dash-card-title">Cases</div>
        </div>
        <div class="dash-card-value">—</div>
        <div class="dash-card-sub">Connect JIRA or Salesforce to see your caseload</div>
        <div class="dash-card-action">Set up integration ${ICONS.arrowRight}</div>
      </div>

      <!-- Upcoming Events placeholder -->
      <div class="dash-card">
        <div class="dash-card-header">
          <div class="dash-card-icon">${ICONS.calendar}</div>
          <div class="dash-card-title">Upcoming Events</div>
        </div>
        <div class="dash-card-value">—</div>
        <div class="dash-card-sub">Connect your calendar to see events here</div>
        <div class="dash-card-action">Connect calendar ${ICONS.arrowRight}</div>
      </div>

      ${p.showZenQuotes ? `
      <!-- Quote -->
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
    hour: 'numeric',
    minute: '2-digit',
    hour12: state.prefs.use12HourClock,
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

  // Header
  const navEl = document.getElementById('planner-nav-date');
  if (navEl) {
    navEl.innerHTML = `
      <strong>${formatDateShort(date)}</strong>
      <span class="day-name">${date.toLocaleDateString('en-US', { weekday: 'long' })}</span>
    `;
  }

  const todayBtn = document.getElementById('planner-today-btn');
  if (todayBtn) todayBtn.style.display = isToday ? 'none' : '';

  // Time blocks
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
          <textarea class="time-block-notes"
            rows="2"
            placeholder="Add notes..."
            data-hour="${h}"
            data-date="${dateKey}"
          >${escHtml(savedNote)}</textarea>
        </div>
      </div>
    `;
  }
  body.innerHTML = html;

  // Auto-scroll to current hour if today
  if (isToday) {
    setTimeout(() => {
      const cur = body.querySelector('.current-hour');
      if (cur) cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }

  // Save notes on input
  body.querySelectorAll('.time-block-notes').forEach(ta => {
    ta.addEventListener('input', () => {
      saveNote(ta.dataset.date, Number(ta.dataset.hour), ta.value);
    });
    // Auto-grow
    ta.addEventListener('input', () => {
      ta.style.height = 'auto';
      ta.style.height = ta.scrollHeight + 'px';
    });
    // Grow on load if content
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
  // Apply saved theme immediately
  applyTheme(state.prefs);

  // Wire up nav items
  document.querySelectorAll('.nav-item[data-screen]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.screen));
  });

  // Wire up settings button
  document.getElementById('settings-btn').addEventListener('click', openSettings);
  document.getElementById('nav-settings-btn').addEventListener('click', openSettings);
  document.getElementById('settings-close').addEventListener('click', closeSettings);
  document.getElementById('settings-overlay').addEventListener('click', closeSettings);

  // Planner nav
  document.getElementById('planner-prev').addEventListener('click', () => plannerChangeDay(-1));
  document.getElementById('planner-next').addEventListener('click', () => plannerChangeDay(1));
  document.getElementById('planner-today-btn').addEventListener('click', plannerGoToday);

  // Initial screen
  navigate('dashboard');
});
