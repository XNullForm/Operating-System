# Golden Gate OS · Liquid Glass Edition 3.0
An original browser-based desktop inspired by Golden Gate Bridge sunsets and modern translucent interface design. This is a web app, not a replacement operating system.

## Deploy with Cloudflare Pages
Connect GitHub repository `XNullForm/Operating-System` to Cloudflare Pages using Git integration. Select the `main` branch, choose **None** for framework, leave build command blank, and set build output directory to `/`. Every commit to main triggers a new Pages build if automatic deployment is enabled.

## What's inside
- Window manager with movable windows, maximize/minimize, dock, spotlight, Control Center, Settings.
- 12 classic desktop apps: Files, Horizon Browser (tabs, web preview and Wikipedia reader), Notes, Calendar, Terminal simulator, Calculator, Photos, Canvas, Weather, Clock, Music and Settings.
- App Store: discover, install, launch, and remove browser-native mini apps.
- Launchpad and Arcade with multiple playable games: Snake, 2048, Memory Match, Mines, Type Sprint.
- Creative: Sound Studio sequencer, Pixel Studio with PNG exports, Code Lab with sandboxed HTML preview, and Idea Board.
- Focus, Tasks, Journal, Habits, Flashcards, Discover, Atlas maps, Kitchen recipes.
- Local data persistence, responsive layouts, mobile-friendly controls, offline application shell, PWA installability.

## Important limitations
Websites can refuse being embedded because of CSP and X-Frame-Options; the browser's Open External fallback lets users visit those pages normally. Horizon is not a replacement for a true browser engine. Weather and maps require connectivity. Most app data is stored in the browser's localStorage only, so clearing site data can erase it. Use the Settings data export for backup. Code Lab's preview is sandboxed, not a server-side execution environment.

## Development
No dependencies. Run `python -m http.server 8000` and open http://localhost:8000/ to test the site. The service worker works on HTTPS and localhost; hard-refresh after updates if an older copy is cached.

## Structure
```
index.html
styles/main.css
styles/experiences.css
js/os.js
js/experiences.js
js/games.js
assets/
manifest.webmanifest
sw.js
```
Golden Gate OS is an independent original project and is not affiliated with Apple.
