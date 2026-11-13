"use client";

/** The "Requests / min" stat: requests the API handled in the last 60 s, from the live log. */
import { GaugeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useRequestLog } from "./request-log-provider";

const WINDOW_MS = 60_000;
/** Re-count this often, so requests age out of the window even when none arrive. */
const TICK_MS = 5000;

export function RequestsPerMinuteCard() {
    const { status, entries } = useRequestLog();
    // The clock is read only in timer callbacks, never while rendering: Next.js
    // pre-renders this component on the server, where "now" would differ from
    // the browser's and the HTML wouldn't match. null = not measured yet.
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        const tick = () => setNow(Date.now());
        const first = setTimeout(tick, 0);
        const timer = setInterval(tick, TICK_MS);
        return () => {
            clearTimeout(first);
            clearInterval(timer);
        };
    }, []);

    const live = status === "live" && now !== null;
    const count = live ? entries.filter((e) => now - Date.parse(e.at) <= WINDOW_MS).length : 0;

    return (
        <StatCard
            icon={GaugeIcon}
            label="Requests / min"
            value={live ? count : <span className="text-muted-foreground">—</span>}
            hint={live ? "Handled by the API in the last 60 s" : "Needs the live request stream"}
        />
    );
}
