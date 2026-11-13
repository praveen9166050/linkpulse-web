# Code structure

```
src/
├── app/                       Next.js App Router: folders are routes
│   ├── layout.tsx                 root layout: fonts, theme, toasts (every page)
│   ├── page.tsx                   the dashboard, route "/"
│   └── globals.css                Tailwind + theme tokens (light and .dark)
├── components/
│   ├── ui/                        shadcn/ui components, copied in by its CLI (we own them)
│   ├── dashboard/                 the dashboard's panels and their parts
│   ├── site-header.tsx            shared app chrome
│   ├── status-dot.tsx, theme-*.tsx
└── lib/
    ├── api/
    │   ├── schema.d.ts            GENERATED from ../linkpulse/api/openapi.yaml: never edit
    │   ├── client.ts              the typed API client and its types
    │   └── problems.ts            Problem Details -> form errors
    ├── config.ts                  settings from the environment (API URL)
    └── utils.ts                   cn(): merge Tailwind classes
```

## Server or client component?

Every component is a **Server Component** unless its file starts with `"use client"`.

| Server Component (the default) | Client Component (`"use client"`) |
| --- | --- |
| Rendered on the server; ships no JavaScript | Ships JavaScript and hydrates in the browser |
| Layout, cards, static markup | State (`useState`, `useActionState`), event handlers, browser APIs |
| `page.tsx`, `create-link-card.tsx`, `links-card.tsx` | `create-link-form.tsx`, `created-link.tsx`, `theme-toggle.tsx` |

Rule: **push `"use client"` down to the smallest component that needs it.** The create
card is a server component; only the form inside it is a client component.

## Conventions

- **File names** are kebab-case (`create-link-form.tsx`); components are PascalCase
  (`CreateLinkForm`); one exported component per file.
- **Props are typed and `readonly`.** No `any`; `import type` for types.
- **Imports** use the `@/` alias (`@/components/ui/button`), never long `../../` paths.
- **No magic values:** settings come from `lib/config.ts`.
- **Data from the network is checked**, not trusted (see `isProblem()` in
  `create-link-form.tsx`).
- 4-space indentation, enforced by Prettier.

## Adding a panel

1. Add the API operation to `../linkpulse/api/openapi.yaml` (contract first) and run
   `npm run api:generate`.
2. Create `components/dashboard/<name>-card.tsx` as a server component (the card).
3. Put the interactive part in its own `"use client"` file inside it.
4. Show loading, empty and error states, not just the happy path.
5. Check it in light and dark mode and at phone width, then `npm run check`.
