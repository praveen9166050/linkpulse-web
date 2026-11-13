/** The top bar: brand on the left; the API it talks to and the theme menu on the right. */
import { Link2Icon } from "lucide-react";
import { ApiStatusPill } from "@/components/health/api-status-pill";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
                    <ApiStatusPill />
                    <Separator orientation="vertical" className="hidden h-5 sm:block" />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
