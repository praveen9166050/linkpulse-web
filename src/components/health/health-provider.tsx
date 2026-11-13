"use client";

/**
 * Polls GET /health and shares the result with every component that shows
 * it (the header pill and the status card), so the page makes ONE request
 * per interval however many places display the status.
 *
 * Polling is fine for a status badge: it changes rarely and being 10 s late
 * is harmless. (The live request log will need a push stream instead.)
 */
import { createContext, type ReactNode, use, useEffect, useState } from "react";
import { apiClient, type Health } from "@/lib/api/client";

export type HealthState =
    | { readonly status: "checking" }
    | { readonly status: "ok" | "degraded"; readonly report: Health; readonly checkedAt: Date }
    | { readonly status: "unreachable"; readonly checkedAt: Date };

const POLL_EVERY_MS = 10_000;

const HealthContext = createContext<HealthState>({ status: "checking" });

export function HealthProvider({ children }: { readonly children: ReactNode }) {
    const [state, setState] = useState<HealthState>({ status: "checking" });

    useEffect(() => {
        let controller: AbortController | undefined;

        async function check() {
            // Don't poll a tab nobody is looking at.
            if (document.visibilityState === "hidden") return;
            controller?.abort(); // a slow previous check is superseded
            controller = new AbortController();
            const { signal } = controller;
            const next = await fetchHealth(signal);
            // An aborted check failed because WE cancelled it, not because the API is down.
            if (!signal.aborted) setState(next);
        }

        function onVisibilityChange() {
            if (document.visibilityState === "visible") void check();
        }

        void check();
        const timer = setInterval(() => void check(), POLL_EVERY_MS);
        document.addEventListener("visibilitychange", onVisibilityChange);

        // Cleanup when the component unmounts: no timer, listener or request left behind.
        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            controller?.abort();
        };
    }, []);

    return <HealthContext value={state}>{children}</HealthContext>;
}

/** The latest health state, from the nearest HealthProvider. */
export function useHealth(): HealthState {
    return use(HealthContext);
}

async function fetchHealth(signal: AbortSignal): Promise<HealthState> {
    try {
        // 200 and 503 both carry a Health body: openapi-fetch puts the 503 one in `error`.
        const { data, error } = await apiClient.GET("/health", { signal });
        const report: unknown = data ?? error;
        return isHealth(report)
            ? { status: report.status, report, checkedAt: new Date() }
            : { status: "unreachable", checkedAt: new Date() };
    } catch {
        return { status: "unreachable", checkedAt: new Date() };
    }
}

/** Checks the shape before trusting it: the proxy answers HTML when the API is down. */
function isHealth(value: unknown): value is Health {
    return (
        typeof value === "object" &&
        value !== null &&
        "status" in value &&
        (value.status === "ok" || value.status === "degraded") &&
        "database" in value &&
        "eventLoopDelayMs" in value
    );
}
