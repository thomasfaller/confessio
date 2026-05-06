# Confessio

A companion app for the Catholic Sacrament of Reconciliation.

Built with React + Vite + TypeScript. Features:
- AI-powered personalised examination of conscience (Anthropic Claude API)
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
    ├── main.jsx                         # Entry point
    ├── App.tsx                          # Root component + navigation state
    ├── App.module.css
    ├── types.ts                         # Screen type + SCREENS constant
    ├── styles/
    │   └── global.css                   # Design tokens + reset
    ├── hooks/
    │   └── useAnthropicAPI.js           # Claude API hook (callClaude, loading, error)
    ├── components/
    │   ├── AppHeader.tsx / .module.css
    │   ├── BottomNav.tsx / .module.css
    │   ├── HomeScreen.tsx / .module.css
    │   ├── ChurchesScreen.tsx / .module.css
    │   ├── AIExaminationScreen.tsx / .module.css
    │   ├── ScheduleScreen.tsx / .module.css
    │   └── ConfessionScreen.tsx / .module.css
    └── test/
        ├── setup.ts                     # @testing-library/jest-dom matchers
        ├── types.test.ts
        ├── buildPrompt.test.ts
        ├── useAnthropicAPI.test.ts
        ├── App.test.tsx
        ├── AppHeader.test.tsx
        ├── BottomNav.test.tsx
        ├── HomeScreen.test.tsx
        ├── ChurchesScreen.test.tsx
        ├── AIExaminationScreen.test.tsx
        ├── ScheduleScreen.test.tsx
        └── ConfessionScreen.test.tsx
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

Copy `.env.example` as a starting point:

```bash
cp .env.example .env
```

> ⚠️ The API key is inlined into the public JS bundle when using `VITE_*` env vars.
> For production, move the API call to a serverless function
> (Cloudflare Workers, Netlify Functions, or Vercel Edge Functions) so the key
> never leaves the server.

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

## Testing

The project uses [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/) and [jsdom](https://github.com/jsdom/jsdom).

### Run all tests once

```bash
npm test
```

### Run tests in watch mode

```bash
npm run test:watch
```

### Test coverage

| File | What is tested |
|---|---|
| `types.test.ts` | `SCREENS` constant values and length |
| `buildPrompt.test.ts` | `buildPrompt` output for all state-of-life, time, focus, and depth combinations |
| `useAnthropicAPI.test.ts` | API hook: loading/error states, successful call, HTTP errors, JSON parsing, markdown fence stripping, network failures, multi-block responses |
| `App.test.tsx` | Root component: renders header/nav, default screen, BottomNav and HomeScreen-card navigation |
| `AppHeader.test.tsx` | Title, subtitle, and landmark element |
| `BottomNav.test.tsx` | Renders all five buttons, `aria-current` active state, `onNavigate` calls |
| `HomeScreen.test.tsx` | Scripture quote, all four action cards, navigation callbacks |
| `ChurchesScreen.test.tsx` | Four churches, addresses, distances, confession badges, schedule navigation |
| `AIExaminationScreen.test.tsx` | Form fields, loading indicator, error display, results rendering, question toggle (click + keyboard), post-result actions |
| `ScheduleScreen.test.tsx` | Church/slot/date selection, validation errors, confirmation screen, reminder and intention display, reset flow |
| `ConfessionScreen.test.tsx` | Four-step flow, Back/Next buttons, progress dots, final "Go in Peace" screen, "Return Home" navigation |

---

## Deploying to GitHub Pages

`vite.config.ts` already sets `base: '/confessio/'`. To publish:

```bash
npm run deploy
```

This builds the app and pushes the `dist/` folder to the `gh-pages` branch automatically via the [`gh-pages`](https://www.npmjs.com/package/gh-pages) package.

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