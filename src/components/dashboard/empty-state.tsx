/** What a panel shows when it has nothing to show yet, and why. */
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
    icon: Icon,
    title,
    children,
    className,
}: {
    readonly icon: LucideIcon;
    readonly title: string;
    readonly children: ReactNode;
    readonly className?: string;
}) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-10 text-center",
                className,
            )}
        >
            <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon className="size-5" />
            </span>
            <p className="text-sm font-medium">{title}</p>
            <p className="max-w-sm text-xs text-balance text-muted-foreground">{children}</p>
        </div>
    );
}
