# Blood Report Analyser — Frontend

A small single-page React app that lets a user upload a photo of a blood
test report and see the results: a color-coded table of biomarkers and
AI-generated, plain-language guidance about what they mean.

This is the client half of the **Blood Report Analyser** project — a
hands-on learning project exploring practical AI engineering (vision-language
extraction, retrieval-augmented generation) end to end, from a real UI down
to the model calls. The AI pipeline itself (image → biomarkers → advice)
lives in a separate backend service; this repo is a pure HTTP client with
no AI logic and no server-side code of its own.

> ⚠️ **Educational project only.** This app displays AI-generated health
> guidance that is general and non-diagnostic. It is not a medical device
> and not a substitute for professional medical advice — always consult a
> licensed doctor to interpret real blood test results.

## Contents

- [What It Does](#what-it-does)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Setup & Running](#setup--running)
- [Talking to the Backend API](#talking-to-the-backend-api)
- [Styling](#styling)
- [File-by-File Reference](#file-by-file-reference)
- [Known Issues](#known-issues)
- [Roadmap](#roadmap)

## What It Does

1. The user selects a photo of a blood test report from their device. A
   local preview renders immediately — nothing is uploaded yet.
2. Clicking **Analyze Report** sends the image to the backend's
   `/analyze-report` endpoint as a `multipart/form-data` upload.
3. The backend runs its AI pipeline (vision-language extraction →
   rule-based categorization → RAG-grounded advice generation) and returns
   JSON: the raw extracted biomarkers, each one categorized as
   High/Low/Normal against a reference range, and a paragraph of
   AI-generated advice.
4. The app renders that response as a color-coded biomarker table (pink for
   High, yellow for Low, green for Normal) followed by the advice text.

The frontend's job stops at steps 1, 2, and 4 — it never calls an LLM
itself, never sees an API key, and does no interpretation of the results
beyond picking a color per status.

## Features

- **Client-side image preview** — the selected file is previewed via
  `URL.createObjectURL()` before any network request happens, so the user
  can confirm they picked the right image.
- **Drag-and-drop-style upload zone** — a large dashed-border drop target
  (built as a styled `<label>` around a hidden file input) restricted to
  `image/png`, `image/jpeg`, and `image/webp`.
- **Color-coded results table** — one row per biomarker, with the
  status badge colored by High/Low/Normal so abnormal values are
  scannable at a glance.
- **AI advice display** — renders the backend's RAG-grounded guidance
  paragraph as-is beneath the table.
- **Light/dark mode** — the entire color palette is defined as CSS
  variables in [src/index.css](src/index.css) with a
  `prefers-color-scheme: dark` override, so the app follows the OS/browser
  theme automatically with no toggle or JS required.

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | [React 19](https://react.dev) |
| Build tool / dev server | [Vite](https://vitejs.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`, config-in-CSS — no `tailwind.config.js`) |
| Icons | [lucide-react](https://lucide.dev) |
| Linting | ESLint 10 (`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) |
| State management | Plain React `useState` — no Redux/Zustand/Context |
| Backend communication | Native `fetch` + `FormData`, no API client library |

There is deliberately no state-management library, no CSS-in-JS, and no
data-fetching library (React Query, SWR, etc.) — the app's current surface
area (one form, one result view) doesn't warrant the extra dependency
weight or abstraction.

## Project Structure

```
blood-report-analyser-frontend/
├── src/
│   ├── main.jsx                    # Entry point — mounts <App /> in StrictMode
│   ├── App.jsx                     # Root component — renders Header + Body
│   ├── index.css                   # Tailwind import + theme tokens (light/dark)
│   ├── assets/
│   │   └── logo.webp                # App logo, shown in the header
│   └── components/
│       ├── Header.jsx               # Static logo + title bar
│       ├── Body.jsx                 # Owns image/result state; calls the API
│       ├── ImageUpload.jsx          # File picker with client-side preview
│       ├── Result.jsx               # Results section wrapper (table + advice)
│       └── Table.jsx                # Color-coded biomarker table
├── public/                          # Static assets served as-is by Vite
├── index.html                       # Vite HTML entry point
├── vite.config.js                   # Vite config — React + Tailwind plugins
├── eslint.config.js                 # ESLint rules
└── package.json
```

## Component Architecture

```
App
├── Header                          (static: logo + title)
└── Body                            (owns all state)
    ├── ImageUpload                 (file picker + local preview)
    └── Result                      (rendered only after a response arrives)
        ├── Table                    (color-coded biomarker rows)
        └── advice text
```

All state lives in [Body.jsx](src/components/Body.jsx) — there's no global
state library in play, which fits the app's current size. `image` and
`result` are plain `useState` values passed down as props/callbacks;
nothing is lifted higher than it needs to be.

## Data Flow

1. **[ImageUpload.jsx](src/components/ImageUpload.jsx)** renders a
   dashed-border drop zone (styled as a `<label>` wrapping a hidden
   `<input type="file">`). On selection, it:
   - Creates a local preview via `URL.createObjectURL()` — the image is
     previewed entirely client-side, no upload happens yet.
   - Calls `onImageSelect(file)`, which `Body` stores as `image`.
2. Clicking **Analyze Report** in `Body.jsx` calls `handleAnalyzeReport()`,
   which:
   - Bails out if no image has been selected yet.
   - Wraps the `File` object in a `FormData` under the key `file` — this
     produces a `multipart/form-data` request that matches what the
     backend's `UploadFile = File(...)` parameter expects.
   - `POST`s it to `http://127.0.0.1:8005/analyze-report`.
   - Parses the JSON response and stores it in `result`.
3. Once `result` is set, **[Result.jsx](src/components/Result.jsx)** mounts
   and renders:
   - **[Table.jsx](src/components/Table.jsx)** — one row per biomarker from
     `data.categorized`, color-coded by status (pink for High, yellow for
     Low, green for Normal).
   - The raw `data.advice` string — the AI-generated, RAG-grounded guidance
     text from the backend — displayed as-is below the table.

## Setup & Running

```bash
npm install
npm run dev       # starts Vite dev server, typically http://localhost:5173
```

The backend must be running separately at `http://127.0.0.1:8005` (see the
`blood-report-analyser` backend repo for setup instructions) — this app is
a pure client and has no server-side code of its own.

Other scripts:

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
npm run lint        # ESLint
```

## Talking to the Backend API

The frontend contains no AI logic — it's a thin client over one endpoint.

- **Request:** `POST /analyze-report`, one image file as
  `multipart/form-data` under the field name `file`.
- **Response:** JSON with three keys —
  - `biomarkers` — raw name/value pairs as extracted by the backend's
    vision-language model (VLM),
  - `categorized` — the same values annotated with `status`
    (`High`/`Low`/`Normal`) and `normal_range`,
  - `advice` — the LLM-generated, RAG-grounded, non-diagnostic guidance
    text.

The API base URL (`http://127.0.0.1:8005`) is currently hardcoded in
[Body.jsx](src/components/Body.jsx) — see [Roadmap](#roadmap).

> Tip: while iterating on the UI, check whether the backend has a mock mode
> flag enabled in its own `.env` — that gets you instant, free canned
> responses instead of waiting on real model calls.

## Styling

Styling uses **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (no
separate `tailwind.config.js` — v4 configures itself through CSS). Theme
tokens (colors, fonts, shadows) are defined in
[src/index.css](src/index.css) using the `@theme` directive, with a
`prefers-color-scheme: dark` override block for automatic dark-mode
support. All component styling is done via Tailwind utility classes
directly in JSX — there are no separate CSS Modules or styled-components.

Icons come from [lucide-react](https://lucide.dev/) (used for the upload
icon in `ImageUpload.jsx`).

## File-by-File Reference

| File | Role |
|---|---|
| [src/main.jsx](src/main.jsx) | Entry point — mounts `<App />` in `StrictMode` |
| [src/App.jsx](src/App.jsx) | Root component — renders `Header` + `Body` |
| [src/components/Header.jsx](src/components/Header.jsx) | Static logo + title bar |
| [src/components/Body.jsx](src/components/Body.jsx) | Owns `image`/`result` state; calls the `/analyze-report` API |
| [src/components/ImageUpload.jsx](src/components/ImageUpload.jsx) | File picker with client-side image preview |
| [src/components/Result.jsx](src/components/Result.jsx) | Results section wrapper — table + advice text |
| [src/components/Table.jsx](src/components/Table.jsx) | Color-coded biomarker table (High/Low/Normal) |
| [src/index.css](src/index.css) | Tailwind v4 import + theme tokens (light/dark) |
| [vite.config.js](vite.config.js) | Vite config — React + Tailwind plugins |
| [eslint.config.js](eslint.config.js) | ESLint rules (React hooks, refresh) |

## Known Issues

- **`src/App.jsx` imports `./App.css`, which doesn't exist in the repo.**
  Both `npm run dev` and `npm run build` currently fail to resolve that
  module. Fix by either removing the import or adding an (empty) `App.css`
  file.

## Roadmap

- [ ] Fix the missing `App.css` import (see [Known Issues](#known-issues))
- [ ] Loading state while `handleAnalyzeReport` is in flight (currently no
      spinner/disabled-button feedback — the button is clickable
      repeatedly mid-request)
- [ ] Error state in the UI when the fetch fails or the backend returns a
      4xx/5xx (currently only `console.error`, silently swallowed
      otherwise)
- [ ] Client-side validation before upload (file type/size) to match the
      backend's `image/*` constraint and fail fast
- [ ] Move the API base URL into a Vite env variable
      (`import.meta.env.VITE_API_URL`) instead of hardcoding
      `http://127.0.0.1:8005` in `Body.jsx`
- [ ] Reset/clear-result affordance (currently the only way to start over
      is a page reload)
- [ ] Accessibility pass (labels, focus states, table semantics for
      screen readers)
