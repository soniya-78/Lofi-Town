# Lofi Town

A cozy, responsive music and focus app. Includes three synthesized lo-fi stations, rain and vinyl ambience, music volume controls, and a 25-minute focus timer with pause and reset.

## Development

Requires Node.js 22.12+ (the cloud environment uses Node.js 24).

```sh
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

Open the development server in a browser and press Play to enable audio. All sounds are generated locally with the Web Audio API; no music services, API keys, or audio downloads are needed. Google Fonts are optional; system fonts are used offline.

## Production

```sh
npm run build
npm run preview -- --port 4173
```

Deploy the generated `dist/` directory to any static host. The focus timer continues to account for elapsed time when a tab is in the background. It resets when the page reloads.
