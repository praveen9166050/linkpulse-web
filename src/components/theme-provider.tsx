"use client";

/**
 * Light / dark / system theme, from next-themes. A CLIENT component: it
 * reads the OS preference and localStorage, which only exist in the browser.
 * It sets `class="dark"` on <html>, which switches the CSS variables in
 * globals.css (`.dark { --background: ... }`).
 */
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props} />;
}
