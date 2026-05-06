# Confessio

A companion app for the Catholic Sacrament of Reconciliation.

Built with React + Vite + TypeScript. Features:
- AI-powered personalised examination of conscience (Anthropic API)
- Church finder with confession times
- Confession scheduling with reminders
- Step-by-step sacrament guide with prayers

---

## Project structure

```
confessio/
├── index.html
├── vite.config.ts
├── package.json
└── src/
    ├── main.tsx                         # Entry point
    ├── App.tsx                          # Root component + navigation state
    ├── App.module.css
    ├── styles/
    │   └── global.css                   # Design tokens + reset
    ├── hooks/
    │   └── useAnthropicAPI.ts           # Claude API hook
    └── components/
        ├── AppHeader.tsx / .module.css
        ├── BottomNav.tsx / .module.css
        ├── HomeScreen.tsx / .module.css
        ├── ChurchesScreen.tsx / .module.css
        ├── AIExaminationScreen.tsx / .module.css
        ├── ScheduleScreen.tsx / .module.css
        └── ConfessionScreen.tsx / .module.css
```

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set your Anthropic API key

Create a `.env` file at the root:

```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

> ⚠️ For production, move the API call to a serverless function
> (Cloudflare Workers or Netlify Functions) to keep the key server-side.

### 3. Run locally

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

Output goes to `dist/`. Deploy this folder to GitHub Pages, Netlify, or Vercel.

---

## Deploying to GitHub Pages

1. Set `base` in `vite.config.ts` to `'/confessio/'` (your repo name)
2. Run `npm run build`
3. Push the `dist/` folder contents to the `gh-pages` branch

Or use the [vite-plugin-gh-pages](https://www.npmjs.com/package/vite-plugin-gh-pages) package to automate this.

---

## Wrapping as an Android app (PWABuilder)

1. Host the built app at a public URL (GitHub Pages)
2. Go to [pwabuilder.com](https://pwabuilder.com)
3. Enter your app URL
4. Download the Android App Bundle (AAB)
5. Upload to Google Play Console

---

## Environment variables

| Variable | Description |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key for the AI examination feature |

---

## Roadmap

- [ ] French language support
- [ ] Push notification reminders
- [ ] Offline support (PWA service worker)
- [ ] More examination categories
- [ ] iOS / App Store release