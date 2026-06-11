# UseYourTools for Work

A browser-based workday management tool — built for the web from the ground up, inspired by the [UseYourTools iOS app](https://github.com/KarMarsten/UseYourTools).

**Live site:** https://klm-snyk.github.io/UseYourTools/

---

## What it does

UseYourTools for Work gives you a single place to manage your workday:

- **Dashboard** — personalized greeting, live clock, quick access to your planner and caseload, plus a dashboard-level Google sign in/out button
- **Daily Planner** — hour-by-hour time blocks for your full workday, notes auto-saved as you type, navigate between days
- **Cases** — your caseload from JIRA or Salesforce *(integration coming soon)*
- **Settings** — 5 color themes, dark mode, configurable work hours, 12/24h clock, and integration toggles

---

## Planned integrations

| Integration | Status |
|---|---|
| Google Calendar / Outlook | Coming soon |
| Gmail | Coming soon |
| JIRA | Coming soon |
| Salesforce | Coming soon |

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

To connect Google Calendar:

- Create a Google OAuth Client ID in Google Cloud Console
- Enable the **Google Calendar API** for that project
- Add your local origin to the OAuth client:
  - `http://localhost:3000`
  - or your actual local host/port if different
- For production on GitHub Pages, add:
  - `https://klm-snyk.github.io`
- In the app Settings, paste your Google Client ID and click **Connect**
- Use the dashboard sign in/out button to sign in with Google and personalize your profile

If Calendar events are not loading, verify that the Calendar API is enabled in the same Google Cloud project as the OAuth client.

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

- [ ] Calendar screen with Google Calendar / Outlook sync
- [ ] Gmail inbox summary on dashboard
- [ ] JIRA / Salesforce case list with Kanban view
- [ ] PDF export for daily schedule and weekly report
- [ ] Event creation and editing
- [ ] Notifications / reminders
