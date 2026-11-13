# LinkPulse dashboard

The web dashboard for [LinkPulse](https://github.com/praveen9166050/linkpulse), a URL
shortener built step by step to learn backend and cloud engineering. Create short links,
browse them, and watch the API handle each request.

| Panel | Status | Uses |
| --- | --- | --- |
| Create a short link | Working | `POST /api/v1/links` |
| API status | Working | `GET /health` |
| Links | Working | `GET /api/v1/links` |
| Live request log | Working | `GET /api/v1/dev/requests` (Server-Sent Events) |

## Tech stack

- **Next.js 16** (App Router, Turbopack) and **React 19**, in TypeScript
- **Tailwind CSS 4** and **shadcn/ui** (Radix primitives), light and dark themes
- A typed API client **generated from the backend's OpenAPI contract**
  (`openapi-typescript` + `openapi-fetch`)

## Getting started

Prerequisites: Node 26 (see `.nvmrc`) and the
[LinkPulse API](https://github.com/praveen9166050/linkpulse) cloned **next to this repo**
(`../linkpulse`) and running on port 3000.

```powershell
npm ci           # install exactly what package-lock.json lists
npm run dev      # http://localhost:3001
```

The dashboard runs on **port 3001**; the API keeps 3000. The browser calls the API
**directly**, so the API's `.env` must allow this origin, and turn on the live request log:

```ini
CORS_ORIGINS=http://localhost:3001
DEV_TOOLS=true
```

To point it at another API, set `NEXT_PUBLIC_API_BASE_URL` (default `http://127.0.0.1:3000`).

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Development server with hot reload, port 3001 |
| `npm run build` / `npm start` | Production build, then serve it |
| `npm run api:generate` | Regenerate `src/lib/api/schema.d.ts` from `../linkpulse/api/openapi.yaml` |
| `npm run check` | Format check, lint and typecheck. **Run before every push** |
| `npm run format` / `npm run lint:fix` | Fix formatting / auto-fixable lint problems |

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| API status says **Unreachable**, but the API is running | The API doesn't allow this origin, so the browser blocks its answers (DevTools console: "blocked by CORS policy") | Add `CORS_ORIGINS=http://localhost:3001` to the API's `.env` and restart it |
| Live request log says **Unavailable** | The API runs without dev tools | Add `DEV_TOOLS=true` to the API's `.env` and restart it |
| **Unreachable**, and the API isn't running | Nothing on port 3000 | Start the API: `npm start` in `../linkpulse` |
| Something behaves as if old after switching branches | The dev server kept a stale `next.config.ts` | Restart `npm run dev` |

## Docs

- [Guides](docs/guides/README.md): how the dashboard is built and how to work on it.

## Known issues

- `npm audit` reports 7 moderate findings in `minimatch`, pulled in by `eslint-config-next`
  through `typescript-eslint`. They affect **lint tooling only** (never the app), and need a
  newer `eslint-config-next` to fix. Accepted until Next.js ships one.

## License

[MIT](LICENSE)
