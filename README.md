# Grit: A Privacy-First Challenge Tracker

![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)
![Status](https://img.shields.io/badge/status-in%20development-orange)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)

Grit is a privacy-focused, client-only Progressive Web App (PWA) for tracking mental toughness challenges, starting with 75 Hard®. It's designed for radical simplicity and focus, helping you stay accountable without distractions or compromising your data.

**Live Demo:** [https://grit.onebuffalolabs.com](https://grit.onebuffalolabs.com)

---

## ✨ Core Features (MVP)

- **Complete 75 Hard Tracking:** A simple, satisfying daily checklist for the 5 core tasks.
- **Privacy by Design:** All your data is stored exclusively on your device in the browser. No sign-up required, no data harvesting, ever.
- **Offline First:** The app works perfectly without an internet connection once loaded.
- **Progress Visualization:** A 75-day "Grit Grid" gives you a powerful, at-a-glance view of your commitment.
- **Private Photo Gallery:** Track your physical progress with daily photos that stay on your device.
- **The "Start Over" Rule:** The core mechanic of the challenge is built-in, reinforcing the mental toughness aspect of the program.

## 💻 Tech Stack

Grit is built on a modern, client-only architecture.

- **Frontend Framework:** (e.g., React, Vue, or Svelte)
- **Database:** [PouchDB](https://pouchdb.com/) for all client-side storage, using the browser's best available engine (typically IndexedDB).
- **Styling:** (e.g., Tailwind CSS)
- **Deployment:** Hosted as a static site on a platform like Vercel, Netlify, or GitHub Pages.

## 🧠 Philosophy: Why Grit?

In a world of data breaches and intrusive apps, Grit takes a different approach. We believe that your self-improvement journey is personal.

1.  **Your Data is Yours:** We will never have access to your progress, your journal entries, or your photos.
2.  **No Distractions:** Grit does one thing and does it perfectly. There are no social feeds, no ads, and no unnecessary features to pull you off track.
3.  **Built on Open Standards:** Using PouchDB and a static site architecture makes the app fast, reliable, and secure.

## 🚀 Getting Started (Local Development)

Want to run Grit locally or contribute to the project?

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/OneBuffaloLabs/grit.git](https://github.com/OneBuffaloLabs/grit.git)
    cd grit
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  Open your browser to `http://localhost:5173` (or the port specified in the console).

## 🗺️ Future Roadmap

The vision for Grit is to become the ultimate platform for discipline.

- [ ] **Challenge Library:** Add support for 75 Soft, the "Live Hard" phases, and other custom challenges.
- [ ] **Journaling:** A simple, private notes section for each day.
- [ ] **Cloud Sync (Optional & Secure):** Introduce an optional, end-to-end encrypted sync service so you can back up your progress and use Grit across multiple devices. This will be a premium feature.
- [ ] **Themes:** Add more color themes and a light mode.

## ⚖️ License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License**.

See the [LICENSE](LICENSE) file for details. In short, you are free to use, share, and adapt this code, but you **cannot** use it for commercial purposes.

---

_Disclaimer: This app is an independent project created by OneBuffaloLabs and is not affiliated with, endorsed by, or sponsored by Andy Frisella or the official 75 HARD® program._
