# Force Equals

## Overview
This repository contains two main components:

1. **LinkedIn Profile Enhancer (Widget)**
   - A Chrome extension that enhances LinkedIn profile pages by injecting a widget showing match score and account status for companies.
2. **Target Account API (Backend)**
   - A Node.js/Express API for managing and serving target account data.

---

## 1. LinkedIn Profile Enhancer (Extension)

**Location:** `widget/`

### Features
- Injects a styled widget into LinkedIn profile pages (`linkedin.com/in/*`).
- Displays company match score and account status.
- Widget can be minimized, closed, and toggled with a floating button styled to match LinkedIn.
- Responsive and robust: works even if LinkedIn's sidebar is missing.
- Uses local sample data by default, but can be connected to a backend API.

### Key Files
- `manifest.json`: Chrome extension manifest (MV3).
- `content.js`: Main content script for widget injection and logic.
- `data.js`: Sample profile data (can be replaced with API calls).
- `styles.css`: LinkedIn-like styling for widget and floating button.
- `icon.png`: Extension icon.

### Installation & Usage
1. Go to `chrome://extensions` and enable Developer Mode.
2. Click "Load unpacked" and select the `widget/` folder.
3. Visit any LinkedIn profile (e.g., `https://www.linkedin.com/in/username/`).
4. The widget will appear in the sidebar or as a floating panel.

---

## 2. Target Account API (Backend)

**Location:** `backend/`

### Features
- Express.js REST API for login and managing account status.
- JWT authentication.
- Endpoints:
  - `POST /login` — Authenticate and receive a JWT.
  - `GET /accounts` — List all accounts (auth required).
  - `POST /accounts/:id/status` — Update account status (auth required).
- Includes Jest tests in `__tests__/`.

### Installation & Usage
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```
2. Start the API server:
   ```bash
   node index.js
   ```
3. Run tests:
   ```bash
   npm test
   ```

---

## Project Structure
```
Force Equals/
│
├── backend/           # Node.js API for target accounts
│   ├── app.js
│   ├── index.js
│   ├── package.json
│   └── __tests__/
│       └── api.test.js
│
├── widget/            # Chrome extension for LinkedIn
│   ├── content.js
│   ├── data.js
│   ├── manifest.json
│   ├── styles.css
│   └── icon.png
│
└── README.md
```

---

## Contributing
Feel free to fork the repository and submit pull requests.

## License
This project is licensed under the MIT License.