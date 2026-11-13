import type { NextConfig } from "next";

/** Where the LinkPulse API runs (the same variable the browser code reads). */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3000";

/**
 * Next.js settings. The first two are Next.js 16 defaults from create-next-app:
 * - cacheComponents: nothing is cached unless a component opts in ("use cache").
 * - partialPrefetching: links prefetch only the static part of the next page.
 */
const nextConfig: NextConfig = {
    cacheComponents: true,
    partialPrefetching: true,

    /**
     * PROXY: the browser calls /api/v1/... on THIS origin (localhost:3001)
     * and Next.js forwards it to the API. One origin for the browser means no
     * CORS during development; CORS on the API comes later (step U4).
     */
    rewrites() {
        return [{ source: "/api/v1/:path*", destination: `${API_BASE_URL}/api/v1/:path*` }];
    },

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
