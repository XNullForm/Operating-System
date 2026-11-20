# Golden Gate OS

A macOS-inspired browser-based desktop environment, built as a static HTML/CSS/JavaScript web application.

## Features
- Desktop window management, dock, search and settings
- Built-in web browser with tabs and external-site fallback
- Files, notes, calculator, calendar, and additional interactive applications
- Local storage and installable PWA manifest

## Hosting on Cloudflare Pages
1. Open Cloudflare dashboard > Workers & Pages > Create > Pages.
2. Connect this GitHub repository `XNullForm/Operating-System` and select `main`.
3. Framework preset: **None**. Build command: **leave blank**. Build output directory: **/** (repository root).
4. Deploy. Your website will receive a free `*.pages.dev` domain.

All website files live at repository root. No Node build step or secrets are necessary.

### Browser limits
Third-party websites that disallow iframe embedding cannot be shown inside the simulated browser; use its open-externally control. Browser sandbox restrictions also prevent access to a real operating system or device filesystem without explicit web APIs.

### Local preview
Use a local static HTTP server (e.g. `python -m http.server 8000`) and visit `http://localhost:8000`.
