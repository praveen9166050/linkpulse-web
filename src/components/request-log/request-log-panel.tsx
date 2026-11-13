"use client";

/**
 * The live request log: one row per request the API handled, newest on top,
 * arriving as it happens. "Hide health checks" filters out the dashboard's
 * own /health polling, which would otherwise be most of the rows.
 */
import { RadioIcon } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusDot } from "@/components/status-dot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RequestLogEntry } from "@/lib/api/client";
import { HttpStatusBadge } from "./http-status-badge";
import { entryKey, type StreamStatus, useRequestLog } from "./request-log-provider";

const COLUMNS = ["Time", "Method", "Path", "Status", "Duration"] as const;
const GRID = "grid min-w-[32rem] grid-cols-[5.5rem_4.5rem_1fr_3.5rem_5rem] items-center gap-3";

const STATUS_VIEW: Record<
    StreamStatus,
    { tone: "neutral" | "success" | "warning" | "danger"; label: string }
> = {
    connecting: { tone: "neutral", label: "Connecting…" },
    live: { tone: "success", label: "Live" },
    reconnecting: { tone: "warning", label: "Reconnecting…" },
    unavailable: { tone: "danger", label: "Unavailable" },
};

const time = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
});

export function RequestLogStatus() {
    const { status } = useRequestLog();
    const view = STATUS_VIEW[status];
    return (
        <Badge variant="outline" className="gap-1.5" role="status">
            <StatusDot tone={view.tone} pulse={status === "live"} />
            {view.label}
        </Badge>
    );
}

export function RequestLogPanel() {
    const { status, entries, clear } = useRequestLog();
    const [hideHealth, setHideHealth] = useState(true);
    const visible = hideHealth ? entries.filter((e) => e.path !== "/health") : entries;

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    aria-pressed={hideHealth}
                    onClick={() => setHideHealth((hide) => !hide)}
                >
                    {hideHealth ? "Show health checks" : "Hide health checks"}
                </Button>
                <Button variant="ghost" size="sm" onClick={clear} disabled={entries.length === 0}>
                    Clear
                </Button>
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                    {visible.length} shown
                </span>
            </div>

            <div className="overflow-hidden rounded-lg border">
                <div className="overflow-x-auto">
                    <div
                        className={`${GRID} border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground`}
                    >
                        {COLUMNS.map((column) => (
                            <span
                                key={column}
                                className={column === "Duration" ? "text-right" : undefined}
                            >
                                {column}
                            </span>
                        ))}
                    </div>
                    {visible.length === 0 ? (
                        <EmptyState
                            icon={RadioIcon}
                            title={emptyTitle(status)}
                            className="rounded-none border-0"
                        >
                            {emptyHint(status)}
                        </EmptyState>
                    ) : (
                        <ScrollArea className="h-80">
                            {/* role="log": screen readers treat new rows as a live feed */}
                            <ol
                                role="log"
                                aria-label="Requests handled by the API"
                                className="divide-y"
                            >
                                {visible.map((entry) => (
                                    <LogRow key={entryKey(entry)} entry={entry} />
                                ))}
                            </ol>
                        </ScrollArea>
                    )}
                </div>
            </div>
        </div>
    );
}

function LogRow({ entry }: { readonly entry: RequestLogEntry }) {
    return (
        <li
            className={`${GRID} px-4 py-2 text-sm animate-in fade-in slide-in-from-top-1 duration-300`}
        >
            <time
                dateTime={entry.at}
                className="font-mono text-xs text-muted-foreground tabular-nums"
            >
                {time.format(new Date(entry.at))}
            </time>
            <span className="font-mono text-xs font-semibold">{entry.method}</span>
            <span className="truncate font-mono text-xs">{entry.path}</span>
            <HttpStatusBadge status={entry.status} />
            <span className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                {entry.durationMs.toFixed(1)} ms
            </span>
        </li>
    );
}

function emptyTitle(status: StreamStatus): string {
    if (status === "unavailable") return "The request stream is off";
    return status === "live" ? "Waiting for requests" : "Connecting to the request stream";
}

function emptyHint(status: StreamStatus): string {
    if (status === "unavailable") {
        return "Start the API with DEV_TOOLS=true and CORS_ORIGINS=http://localhost:3001 in its .env.";
    }
    return "Create a link or follow one: each request the API handles appears here instantly.";
}
