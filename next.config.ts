import type { NextConfig } from "next";

/**
 * Next.js settings. The first two are Next.js 16 defaults from create-next-app:
 * - cacheComponents: nothing is cached unless a component opts in ("use cache").
 * - partialPrefetching: links prefetch only the static part of the next page.
 *
 * No proxy: the browser calls the LinkPulse API directly (another origin),
 * and the API allows this dashboard's origin with CORS. See docs/guides/api.md.
 */
const nextConfig: NextConfig = {
    cacheComponents: true,
    partialPrefetching: true,
    turbopack: {
        rules: {
            // Tailwind CSS 4 runs as a Turbopack loader on every CSS file.
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
};

export default nextConfig;
