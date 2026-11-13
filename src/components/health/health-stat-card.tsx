"use client";

/** The "API status" card: live health from the HealthProvider. */
import { ActivityIcon } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusDot } from "@/components/status-dot";
import { describeHealth, formatUptime } from "./health-view";
import { useHealth } from "./health-provider";

export function HealthStatCard() {
    const health = useHealth();
    const view = describeHealth(health);
    const uptime =
        health.status === "ok" || health.status === "degraded"
            ? health.report.uptimeSeconds
            : undefined;

    return (
        <StatCard
            icon={ActivityIcon}
            label="API status"
            value={
                // role="status": screen readers announce the change when it flips.
                <span role="status" className="flex items-center gap-2 text-base font-medium">
                    <StatusDot tone={view.tone} pulse={view.tone === "success"} />
                    {view.label}
                    {uptime !== undefined && (
                        <span className="text-xs font-normal text-muted-foreground">
                            up {formatUptime(uptime)}
                        </span>
                    )}
                </span>
            }
            hint={view.detail}
        />
    );
}
