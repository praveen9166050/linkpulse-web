# Talking to the API

```
browser ──/api/v1/links──▶ Next.js (localhost:3001) ──rewrite──▶ LinkPulse API (127.0.0.1:3000)
```

## The dev proxy

`next.config.ts` rewrites `/api/v1/:path*` to the API. The browser only ever calls its own
origin, so no CORS is needed while developing. Set `NEXT_PUBLIC_API_BASE_URL` to proxy to a
different API.

The short links the API returns (`shortUrl`) point at the API itself, so opening one goes
straight to the API's `302` redirect.

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

## Showing API errors

The API answers errors with RFC 9457 Problem Details. `src/lib/api/problems.ts` turns one
into form errors:

| API answer | Shown |
| --- | --- |
| `400` with `errors[]` | Each message under its field (`url`, `code`) |
| `409 /problems/code-taken` | Under the code field |
| Anything else with a Problem body | One message above the button |
| No answer at all (API down) | "Can't reach the API at ... Is it running?" |

The API is the single source of truth for validation: forms use `noValidate`, so the
browser's own popups never disagree with it.
