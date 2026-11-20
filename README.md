# Golden Gate OS 3.0 — Liquid Glass Edition

Golden Gate OS is an original, interactive browser-based desktop environment. It is **a web app, not a replacement for macOS or Windows**.

## What's new

- Liquid-glass windows, translucent dock, motion, desktop widgets, responsive layout
- App Store with install/remove, app details, search and categories, plus Launchpad
- Arcade with playable **Neon Snake, 2048, Memory Match, Mines and Type Sprint**
- Creativity: **Pixel Studio** (draw, save PNG), **Sound Studio** (16-step synthesized melody), **Code Lab** (HTML/CSS/JS live sandbox preview), **Idea Board**
- Productivity: Tasks, Focus timer, Journal, Habits, Flashcards, Kitchen
- Discovery: **Atlas** with OpenStreetMap embeds, **Discover** cards connecting to Wikipedia via Horizon Browser
- Existing apps: Files, Notes, Horizon Browser, Calendar, Terminal, Calculator, Photos, Canvas, Weather, Clock, Music, Settings, Activity Monitor, TextEdit
- Offline cache for core app files; most personal data saved via browser localStorage

## Local usage

Serve the repository as a static website (for example, `python -m http.server 8000`), then open `http://localhost:8000`. Opening `index.html` directly may disable some browser features or service worker caching.

## Cloudflare Pages

Connect this GitHub repository to Cloudflare Pages and deploy branch `main`. Framework preset: **None**. Build command: **none**. Output directory: **/** (repository root). Each future push to `main` triggers a new deployment if Git integration is connected.

## Notes and limits

- Horizon Browser supports tabs, Wikipedia reading and previews of iframe-compatible sites. Many third-party websites explicitly prohibit embedding. Use **Open externally** to access those sites in the actual browser; no HTML page can bypass the restriction.
- Atlas uses OpenStreetMap over the internet and Weather uses Open-Meteo. Offline use is limited to cached app code and local content.
- App Store apps are included as website modules. Install/remove changes local app availability; it does not download third-party binaries.
- The simulated Terminal does not execute real operating-system commands. Code Lab runs preview code in a sandboxed frame, separate from the OS.
- Stored tasks, journal, notes, and other local data are device/browser-specific. Clearing site storage erases them. Use Settings backup/export where available.
- This project is independently designed and inspired by modern translucent desktop interfaces; it is not affiliated with Apple.
