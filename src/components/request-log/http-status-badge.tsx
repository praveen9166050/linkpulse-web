/** An HTTP status code, coloured by its class: 2xx ok, 3xx redirect, 4xx client error, 5xx server error. */
import { cn } from "@/lib/utils";

const CLASS_STYLES: Readonly<Record<number, string>> = {
    2: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    3: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
    4: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    5: "bg-red-500/10 text-red-700 dark:text-red-400",
};

export function HttpStatusBadge({ status }: { readonly status: number }) {
    return (
        <span
            className={cn(
                "inline-flex w-11 justify-center rounded-md px-1.5 py-0.5 font-mono text-xs font-medium tabular-nums",
                CLASS_STYLES[Math.floor(status / 100)] ?? "bg-muted text-muted-foreground",
            )}
        >
            {status}
        </span>
    );
}
