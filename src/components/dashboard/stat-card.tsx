/** One number at the top of the dashboard, with an icon and a one-line hint. */
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
    icon: Icon,
    label,
    value,
    hint,
}: {
    readonly icon: LucideIcon;
    readonly label: string;
    readonly value: ReactNode;
    readonly hint: string;
}) {
    return (
        <Card className="gap-0 py-5">
            <CardContent className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1.5">
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    {/* Fixed height: every card's hint lines up, whatever the value is. */}
                    <div className="flex h-8 items-center text-2xl font-semibold tracking-tight">
                        {value}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{hint}</p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
                    <Icon className="size-4" />
                </span>
            </CardContent>
        </Card>
    );
}
