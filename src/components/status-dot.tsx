import { cn } from "@/lib/utils";

export type StatusTone = "neutral" | "success" | "warning" | "danger";

const TONES: Record<StatusTone, string> = {
    neutral: "bg-muted-foreground/50",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
};

/** A small coloured dot; `pulse` adds a ping ring for "live" states. */
export function StatusDot({
    tone,
    pulse = false,
    className,
}: {
    readonly tone: StatusTone;
    readonly pulse?: boolean;
    readonly className?: string;
}) {
    return (
        <span className={cn("relative inline-flex size-2 shrink-0", className)} aria-hidden>
            {pulse && (
                <span
                    className={cn(
                        "absolute inline-flex size-full animate-ping rounded-full opacity-60",
                        TONES[tone],
                    )}
                />
            )}
            <span className={cn("relative inline-flex size-2 rounded-full", TONES[tone])} />
        </span>
    );
}
