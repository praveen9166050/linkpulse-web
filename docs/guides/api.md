# Talking to the API

```
browser (page from localhost:3001) ──▶ LinkPulse API (127.0.0.1:3000) ──▶ MongoDB Atlas
          ▲
          └── Next.js dev server (localhost:3001) serves only the page itself
```

## Direct calls, allowed by CORS

The browser calls the API **directly**. The API is another **origin** (scheme + host +
port), so the browser only lets the page read its responses because the API names this
dashboard in `Access-Control-Allow-Origin`. That allow-list is the API's `CORS_ORIGINS`
setting, which must include `http://localhost:3001`.

What you see in DevTools (Network tab):

| Request | Notes |
| --- | --- |
| `GET 127.0.0.1:3000/health`, `GET .../api/v1/links` | Simple requests: sent straight away |
| `OPTIONS .../api/v1/links`, then `POST` | A JSON `POST` is "non-simple": the browser first asks permission (a **preflight**). The answer is cached for 10 minutes |
| `GET .../api/v1/dev/requests` (EventStream) | The live log: one response that never ends |

`NEXT_PUBLIC_API_BASE_URL` points the dashboard at another API (default
`http://127.0.0.1:3000`); that API must list the dashboard's origin in its `CORS_ORIGINS`.

The short links the API returns (`shortUrl`) point at the API too, so opening one goes
straight to its `302` redirect.

## The generated client

The backend's `api/openapi.yaml` is the contract. `openapi-typescript` turns it into
TypeScript types (`src/lib/api/schema.d.ts`); `openapi-fetch` uses them for typed calls:

```ts
const { data, error, response } = await apiClient.POST("/api/v1/links", {
    body: { url: "https://example.com/long" }, // typed as CreateLinkRequest
});
// data: Link (201) | undefined;   error: Problem (400/409/413) | undefined
```

A path, field or response the contract doesn't have is a **compile error**, so the
dashboard can't drift from the API.

### After the contract changes

```powershell
npm run api:generate   # reads ../linkpulse/api/openapi.yaml, rewrites schema.d.ts
npm run check          # anything now out of date fails to compile
```

Commit `schema.d.ts` with the change, so the dashboard builds without the backend repo.

## The live request log

`EventSource` opens `GET /api/v1/dev/requests` (Server-Sent Events) on the API. It exists
only when the API runs with `DEV_TOOLS=true`; otherwise the panel shows "Unavailable".
`EventSource` reconnects by itself after a drop or an API restart.

## Showing API errors

The API answers errors with RFC 9457 Problem Details. `src/lib/api/problems.ts` turns one
into form errors:

| API answer | Shown |
| --- | --- |
| `400` with `errors[]` | Each message under its field (`url`, `code`) |
| `409 /problems/code-taken` | Under the code field |
| Anything else with a Problem body | One message above the button |
| No answer at all (API down, or CORS refused) | "Can't reach the API at ... Is it running?" |

The API is the single source of truth for validation: forms use `noValidate`, so the
browser's own popups never disagree with it.
