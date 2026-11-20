# Golden Gate OS 3.0 — Liquid Glass Edition

A polished, installable browser-based desktop with a Golden Gate Bridge-inspired wallpaper and macOS-inspired liquid glass styling.

## Getting started

Open `index.html` in a browser, or deploy this repository to Cloudflare Pages (see below). A local static server is recommended for Service Worker support.

## Included

- **Desktop:** Dock, resizable/movable windows, Spotlight search (Ctrl/⌘+K), Control Center, light/dark modes and wallpaper settings.
- **Built-in apps:** Files, Horizon Browser, Notes, Calendar, Clock, Photos, Paint, Weather, Music, Calculator, Terminal (sandboxed simulator), Activity Monitor, TextEdit and Settings.
- **App Store & Launchpad:** Search, browse categories, install and remove 17 optional apps; installs are stored in this browser.
- **Productivity & education:** Tasks, Focus timer, private Journal, Habits, Flashcards and Idea Board.
- **Creative apps:** Code Lab (HTML/CSS/JS sandboxed iframe preview), Pixel Studio (PNG export), Sound Studio (16-step Web Audio synthesizer).
- **Discovery & lifestyle:** Atlas using OpenStreetMap embeds, Discover articles, Kitchen recipes.
- **Arcade:** 2048, Neon Snake, Memory Match, Mines, Type Sprint. Playable with desktop/mobile controls.
- **Update announcements:** Startup modal appears once per release with the new version and changes.

All app data is stored locally in your browser. Use the original OS backup/export features where applicable; deleting browser data may delete saved app content. Browser previews only work on sites that allow iframe embedding; the external-open button handles sites that don't. Maps, encyclopedia articles, weather and other remote features need internet access. This is a **web desktop simulator**, not a real kernel-based operating system.

## Cloudflare Pages

Connect repository `XNullForm/Operating-System` to **Cloudflare Pages → Connect to Git**, select the `main` branch, choose **Framework preset: None**, no build command, and build output directory `/`. Cloudflare redeploys when new commits are pushed to the connected branch.

## Versioning

Current version: **3.0.0**. For every subsequent release, increment the `VERSION` constant in `js/updates.js`, update the cache version in `sw.js`, and list the release highlights in `js/updates.js`. On startup, users see “You have successfully updated to version X” once per browser per version.

This project is original and not affiliated with or endorsed by Apple.