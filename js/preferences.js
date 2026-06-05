// Preferences — loads/saves all settings to localStorage

const PREFS_KEY = 'uyt_work_prefs';

const DEFAULT_PREFS = {
  userName: '',
  colorScheme: 'modern',          // modern | earth | nature | sunny | purple
  darkMode: false,                // only applies to Modern scheme
  startHour: 8,                   // 8 = 8:00 AM
  endHour: 22,                    // 22 = 10:00 PM
  use12HourClock: true,
  showZenQuotes: true,
  calendarSyncProvider: 'none',   // none | google | outlook
  emailClient: 'default',         // default | gmail
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function applyTheme(prefs) {
  const body = document.body;
  body.setAttribute('data-theme', prefs.colorScheme);
  body.setAttribute('data-dark', prefs.darkMode && prefs.colorScheme === 'modern' ? 'true' : 'false');
}
