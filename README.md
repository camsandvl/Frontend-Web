# Series Tracker — Client

> Vanilla JavaScript frontend for the Series Tracker API. No frameworks, no libraries.

🔗 **Backend repo**: _add link here_
🌐 **Live app**: _add deployed URL here_

---

## Screenshot

_Add a screenshot here_

---

## Tech Stack

- **HTML5** — semantic structure
- **CSS3** — custom properties, grid, flexbox, animations
- **JavaScript ES2020** — ES modules, fetch(), FormData, Blob API
- No libraries. No frameworks. No jQuery.

---

## Running locally

```bash
# 1. Clone the repo
git clone https://github.com/your-user/Frontend-Web.git
cd Frontend-Web

# 2. Update the API URL
# Edit js/api.js — set BASE_URL to your local backend URL (default: http://localhost:3000)

# 3. Serve with a static server (required for ES modules)
npx serve .
```

> ⚠️ Do NOT open `index.html` directly with `file://` — ES modules require a server.

---

## Project structure

```
Frontend-Web/
├── index.html        # App shell
├── css/
│   └── styles.css    # All styles
├── js/
│   ├── api.js        # All fetch() calls
│   ├── ui.js         # DOM rendering (cards, pagination, toasts)
│   ├── app.js        # Event listeners, modal, search/sort wiring
│   ├── export.js     # CSV and Excel (.xlsx) export
│   └── rating.js     # Star rating widget
└── README.md
```

---

## Implemented challenges

- [x] Full CRUD from the UI
- [x] Image upload with live preview
- [x] Search, sort, and pagination
- [x] CSV export — manual JS, no libraries
- [x] Excel (.xlsx) export — SpreadsheetML + manual ZIP, no libraries
- [x] Rating system — interactive 10-star widget, calls dedicated API endpoints

---

## Reflection

_Write your reflection here — required, -20 pts if missing._
