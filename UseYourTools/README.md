# UseYourTools for Work

A browser-based workday management tool — built for the web from the ground up, inspired by the [UseYourTools iOS app](https://github.com/KarMarsten/UseYourTools).

**Live site:** https://klm-snyk.github.io/UseYourTools/

---

## What it does

UseYourTools for Work gives you a single place to manage your workday:

- **Dashboard** — personalized greeting, live clock, upcoming Google Calendar events, and a daily motivational quote
- **Daily Planner** — hour-by-hour time blocks for your full workday, notes auto-saved as you type, navigate between days
- **Cases** — your caseload from JIRA or Salesforce *(integration coming soon)*
- **Settings** — 5 color themes, dark mode, configurable work hours, 12/24h clock, and integration toggles

---

## Integrations

| Integration | Status |
|---|---|
| Google Calendar | ✅ Working |
| Gmail | Coming soon |
| JIRA | Coming soon |
| Salesforce | Coming soon |
| Outlook | Coming soon |

---

## Tech

- Pure HTML, CSS, and JavaScript — no framework, no build step
- Deploys automatically via GitHub Pages
- All settings and planner notes persist in `localStorage`

---

## Running locally

```bash
npx serve .
# then open http://localhost:3000/UseYourTools
```

---

## Google Calendar setup

Calendar connection is handled entirely in the browser via Google OAuth2. To connect:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and create an OAuth 2.0 Client ID (Web application type)
2. Enable the **Google Calendar API** and **People API** for that project
3. Add your authorized origins:
   - `https://klm-snyk.github.io` (production)
   - `http://localhost:3000` (or your local port)
4. In the app Settings, paste your Client ID and click **Connect**
5. Approve the Google OAuth consent screen — your name and calendar events will load automatically

Clicking **Disconnect** in Settings or **Sign out** on the dashboard fully clears your token, profile, and cached events.

---

## Color themes

Ported directly from the iOS app:

| Theme | Primary color |
|---|---|
| Modern (default) | Indigo `#6366F1` with dark mode support |
| Earth-Tone | Brown `#8C6A4A` |
| Cheerful Nature | Green `#5A8A6A` |
| Sunny Sky | Gold `#D4A574` |
| Imagination Run Wild | Violet `#9B6FA8` |

---

## Roadmap

- [x] Google Calendar integration
- [ ] Gmail inbox summary on dashboard
- [ ] JIRA / Salesforce case list with Kanban view
- [ ] PDF export for daily schedule
- [ ] Event creation and editing
- [ ] Notifications / reminders
