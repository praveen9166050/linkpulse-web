"use client";

/** The links table: loading, error, empty and data states, plus "Load more". */
import { AlertTriangleIcon, LinkIcon, Loader2Icon } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Link } from "@/lib/api/client";
import { fullDateTime, timeAgo } from "@/lib/format";
import { useLinks } from "./links-provider";

const COLUMNS = ["Short link", "Destination", "Created"] as const;
const SKELETON_ROWS = 4;

export function LinksTable() {
    const { state, refresh, loadMore } = useLinks();

    if (state.status === "error") {
        return (
            <EmptyState icon={AlertTriangleIcon} title="Couldn't load links">
                {state.message}{" "}
                <Button variant="link" size="xs" className="h-auto p-0" onClick={refresh}>
                    Try again
                </Button>
            </EmptyState>
        );
    }

    return (
        <div className="space-y-3">
            <Table>
                <TableHeader>
                    <TableRow>
                        {COLUMNS.map((column) => (
                            <TableHead key={column}>{column}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody aria-busy={state.status === "loading"}>
                    {state.status === "loading" && <SkeletonRows />}
                    {state.status === "ready" && state.items.length === 0 && <EmptyRow />}
                    {state.status === "ready" &&
                        state.items.map((link) => <LinkRow key={link.code} link={link} />)}
                </TableBody>
            </Table>

            {state.status === "ready" && state.nextCursor !== null && (
                <div className="flex flex-col items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadMore}
                        disabled={state.loadingMore}
                    >
                        {state.loadingMore && (
                            <Loader2Icon data-icon="inline-start" className="animate-spin" />
                        )}
                        Load more
                    </Button>
                    {state.loadMoreError && (
                        <p role="alert" className="text-xs text-destructive">
                            {state.loadMoreError}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

function LinkRow({ link }: { readonly link: Link }) {
    const createdAt = new Date(link.createdAt);
    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-1">
                    <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm font-medium underline-offset-4 hover:underline"
                    >
                        /{link.code}
                    </a>
                    <CopyButton value={link.shortUrl} label={`Copy ${link.shortUrl}`} />
                </div>
            </TableCell>
            <TableCell className="max-w-56">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span
                            tabIndex={0}
                            className="block truncate text-muted-foreground outline-none"
                        >
                            {link.url}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm break-all">{link.url}</TooltipContent>
                </Tooltip>
            </TableCell>
            <TableCell className="whitespace-nowrap text-muted-foreground">
                <time dateTime={link.createdAt} title={fullDateTime(createdAt)}>
                    {timeAgo(createdAt)}
                </time>
            </TableCell>
        </TableRow>
    );
}

function SkeletonRows() {
    return Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <TableRow key={i} className="hover:bg-transparent">
            <TableCell>
                <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-20" />
            </TableCell>
        </TableRow>
    ));
}

function EmptyRow() {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell colSpan={COLUMNS.length} className="p-0 pt-4">
                <EmptyState icon={LinkIcon} title="No links yet">
                    Create one with the form; it appears here straight away.
                </EmptyState>
            </TableCell>
        </TableRow>
    );
}
