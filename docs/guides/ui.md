# UI conventions

## shadcn/ui

Components in `src/components/ui/` were **copied in** by the shadcn CLI: the source is ours
to read and change. They are built on **Radix** primitives (keyboard support, focus
management and screen-reader roles) and styled with Tailwind.

```powershell
npx shadcn@4.23.0 add <component>    # e.g. dialog, select; then format and review the diff
```

Settings are in `components.json` (style `radix-nova`, neutral base colour, Lucide icons).

## Theme and dark mode

Colours, radius and fonts are **design tokens**: CSS variables in `globals.css`, with a
light set (`:root`) and a dark set (`.dark`). Use the token classes (`bg-background`,
`text-muted-foreground`, `border`), never raw colours, so both themes stay right.
`next-themes` puts `class="dark"` on `<html>`; the header menu offers Light, Dark and System.

## Accessibility checklist

- Every input has a `<Label htmlFor>`; hints and errors are linked with `aria-describedby`.
- A field with an error gets `aria-invalid`; form-level errors use `role="alert"`.
- Icon-only buttons have an `aria-label`; decorative icons are `aria-hidden`.
- Content that appears after an action sits in an `aria-live` region.
- Everything works with the keyboard alone.

## States, not just data

Every panel designs four states: **loading**, **empty**, **error** and **data**. Empty
states say what will fill them and what is missing ("Waiting for the request stream").

## Checking the UI

Check every change in **light and dark mode** and at **phone width (390 px)**. In devtools,
use the device toolbar; for screenshots, headless Edge:

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new `
    --window-size=1360,1000 --screenshot=page.png http://localhost:3001/
```

Edge has a minimum window width, so for a true 390 px view load the page in a 390 px-wide
`<iframe>` and screenshot that.
