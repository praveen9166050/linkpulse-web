/**
 * LIVE REQUEST LOG: every request the API handles, streamed with
 * Server-Sent Events (the API's dev-only stream, step U5).
 */
import { RadioIcon, Trash2Icon } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusDot } from "@/components/status-dot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const COLUMNS = ["Time", "Method", "Path", "Status", "Duration"] as const;

export function RequestLogCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Live request log</CardTitle>
                <CardDescription>Every request the API handles, as it happens.</CardDescription>
                <CardAction className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1.5">
                        <StatusDot tone="neutral" />
                        Not connected
                    </Badge>
                    <Button variant="ghost" size="icon-sm" aria-label="Clear the log" disabled>
                        <Trash2Icon />
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent>
                <div className="overflow-hidden rounded-lg border">
                    {/* On narrow screens the columns scroll sideways inside this box, not the page. */}
                    <div className="overflow-x-auto">
                        <div className="grid min-w-[32rem] grid-cols-[5.5rem_4.5rem_1fr_4rem_5rem] gap-3 border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                            {COLUMNS.map((column) => (
                                <span key={column}>{column}</span>
                            ))}
                        </div>
                    </div>
                    <EmptyState
                        icon={RadioIcon}
                        title="Waiting for the request stream"
                        className="rounded-none border-0"
                    >
                        Requests appear here live once the API streams them (it will need
                        DEV_TOOLS=true in its .env).
                    </EmptyState>
                </div>
            </CardContent>
        </Card>
    );
}
