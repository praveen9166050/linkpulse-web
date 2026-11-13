"use client";

/** The header's API address, with a dot showing its live health. */
import { StatusDot } from "@/components/status-dot";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { API_BASE_URL } from "@/lib/config";
import { describeHealth } from "./health-view";
import { useHealth } from "./health-provider";

export function ApiStatusPill() {
    const view = describeHealth(useHealth());

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div
                    tabIndex={0}
                    aria-label={`API at ${API_BASE_URL}: ${view.label}`}
                    className="hidden items-center gap-2 rounded-md border bg-background px-2.5 py-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:flex"
                >
                    <StatusDot tone={view.tone} />
                    <code className="font-mono text-xs text-muted-foreground">{API_BASE_URL}</code>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                {view.label}: {view.detail}
            </TooltipContent>
        </Tooltip>
    );
}
