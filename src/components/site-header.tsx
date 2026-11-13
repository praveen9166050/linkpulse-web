/** The top bar: brand on the left; the API it talks to and the theme menu on the right. */
import { Link2Icon } from "lucide-react";
import { StatusDot } from "@/components/status-dot";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { API_BASE_URL } from "@/lib/config";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                        <Link2Icon className="size-4" />
                    </span>
                    <span className="font-semibold tracking-tight">LinkPulse</span>
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                        Dashboard
                    </Badge>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="hidden items-center gap-2 rounded-md border bg-background px-2.5 py-1 sm:flex">
                                <StatusDot tone="neutral" />
                                <code className="font-mono text-xs text-muted-foreground">
                                    {API_BASE_URL}
                                </code>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            The API this dashboard talks to. Not connected yet.
                        </TooltipContent>
                    </Tooltip>
                    <Separator orientation="vertical" className="hidden h-5 sm:block" />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
