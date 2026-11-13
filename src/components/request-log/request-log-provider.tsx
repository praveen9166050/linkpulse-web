"use client";

/**
 * Subscribes to the API's live request stream (Server-Sent Events) and
 * shares the entries with the log panel and the "Requests / min" card.
 *
 * The browser's EventSource does the hard parts: it keeps one HTTP response
 * open, splits it into events, and RECONNECTS by itself if it drops (after
 * the `retry` the server sent). Like every API call from this dashboard, it
 * goes to the API directly, which allows this origin with CORS.
 */
import {
    createContext,
    type ReactNode,
    use,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { RequestLogEntry } from "@/lib/api/client";
import { API_BASE_URL } from "@/lib/config";

export const REQUEST_STREAM_URL = `${API_BASE_URL}/api/v1/dev/requests`;

/** Keep the newest entries only: memory stays bounded however long the tab is open. */
const MAX_ENTRIES = 200;

export type StreamStatus =
    | "connecting"
    | "live"
    /** Dropped; EventSource is retrying by itself. */
    | "reconnecting"
    /** Refused for good: the API is down, or runs without DEV_TOOLS=true (404). */
    | "unavailable";

export interface RequestLogContextValue {
    readonly status: StreamStatus;
    /** Newest first. */
    readonly entries: readonly RequestLogEntry[];
    readonly clear: () => void;
}

const RequestLogContext = createContext<RequestLogContextValue>({
    status: "connecting",
    entries: [],
    clear: () => undefined,
});

export function RequestLogProvider({ children }: { readonly children: ReactNode }) {
    const [status, setStatus] = useState<StreamStatus>("connecting");
    const [entries, setEntries] = useState<readonly RequestLogEntry[]>([]);

    useEffect(() => {
        const source = new EventSource(REQUEST_STREAM_URL);

        source.onopen = () => setStatus("live");
        source.onerror = () => {
            // CLOSED: EventSource gave up (for example a 404); otherwise it's retrying.
            setStatus(source.readyState === EventSource.CLOSED ? "unavailable" : "reconnecting");
        };
        source.addEventListener("request", (event: MessageEvent<string>) => {
            const entry = parseEntry(event.data);
            if (!entry) return;
            setEntries((current) =>
                // The server replays recent history on every (re)connect: skip what we have.
                current.some((e) => entryKey(e) === entryKey(entry))
                    ? current
                    : [entry, ...current].slice(0, MAX_ENTRIES),
            );
        });

        return () => source.close(); // leaving the page closes the stream
    }, []);

    const clear = useCallback(() => setEntries([]), []);
    const value = useMemo(() => ({ status, entries, clear }), [status, entries, clear]);
    return <RequestLogContext value={value}>{children}</RequestLogContext>;
}

export function useRequestLog(): RequestLogContextValue {
    return use(RequestLogContext);
}

/**
 * What makes an entry unique. Not `id` alone: ids start again at 1 when the
 * API restarts, and EventSource reconnects to the new process by itself, so
 * the new #1 must not be mistaken for the old #1.
 */
export function entryKey(entry: RequestLogEntry): string {
    return `${entry.at}#${String(entry.id)}`;
}

/** Every field of a RequestLogEntry and the type it must have. */
const ENTRY_FIELDS = {
    id: "number",
    at: "string",
    method: "string",
    path: "string",
    status: "number",
    durationMs: "number",
} as const satisfies Record<keyof RequestLogEntry, "number" | "string">;

/** Checks each event's shape: data from the network is never trusted as-is. */
function parseEntry(data: string): RequestLogEntry | undefined {
    let value: unknown;
    try {
        value = JSON.parse(data);
    } catch {
        return undefined; // not JSON: ignore the event
    }
    if (typeof value !== "object" || value === null) return undefined;
    const record = value as Record<string, unknown>;
    const valid = Object.entries(ENTRY_FIELDS).every(([key, type]) => typeof record[key] === type);
    return valid ? (record as unknown as RequestLogEntry) : undefined;
}
