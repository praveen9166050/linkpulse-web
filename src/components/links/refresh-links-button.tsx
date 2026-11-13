"use client";

import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLinks } from "./links-provider";

/** Reloads the list from the newest link. */
export function RefreshLinksButton() {
    const { state, refresh } = useLinks();
    const loading = state.status === "loading";

    return (
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCwIcon data-icon="inline-start" className={cn(loading && "animate-spin")} />
            Refresh
        </Button>
    );
}
