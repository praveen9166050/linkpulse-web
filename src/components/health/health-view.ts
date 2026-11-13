/**
 * How a health state is SHOWN: one place decides the label, colour and
 * explanation, so the header pill and the status card can never disagree.
 */
import type { StatusTone } from "@/components/status-dot";
import { API_BASE_URL } from "@/lib/config";
import type { HealthState } from "./health-provider";

export interface HealthView {
    readonly tone: StatusTone;
    readonly label: string;
    /** One line: why it has this status. */
    readonly detail: string;
}

export function describeHealth(state: HealthState): HealthView {
    switch (state.status) {
        case "checking":
            return { tone: "neutral", label: "Checking…", detail: "Asking GET /health" };
        case "unreachable":
            return {
                tone: "danger",
                label: "Unreachable",
                detail: `No answer from ${API_BASE_URL}`,
            };
        case "ok": {
            const { database, eventLoopDelayMs } = state.report;
            return {
                tone: "success",
                label: "Healthy",
                detail: `DB ping ${formatMs(database.latencyMs)} · event loop p99 ${formatMs(eventLoopDelayMs.p99)}`,
            };
        }
        case "degraded": {
            const { database, eventLoopDelayMs } = state.report;
            return {
                tone: "warning",
                label: "Degraded",
                detail:
                    database.status === "down"
                        ? "MongoDB isn't answering"
                        : `Event loop lagging (p99 ${formatMs(eventLoopDelayMs.p99)})`,
            };
        }
    }
}

function formatMs(ms: number | null): string {
    return ms === null ? "n/a" : `${String(Math.round(ms))} ms`;
}

/** "3h 12m", "4m 05s", "12s": how long the API process has been up. */
export function formatUptime(seconds: number): string {
    const s = Math.floor(seconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${String(h)}h ${String(m)}m`;
    if (m > 0) return `${String(m)}m ${String(s % 60).padStart(2, "0")}s`;
    return `${String(s)}s`;
}
