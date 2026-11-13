"use client";

/** The link just created: its short URL with Copy and Open, and where it leads. */
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Link } from "@/lib/api/client";

const COPIED_FOR_MS = 1500;

export function CreatedLink({ link }: { readonly link: Link }) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(link.shortUrl);
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), COPIED_FOR_MS);
        } catch {
            toast.error("Couldn't copy: the browser blocked clipboard access");
        }
    }

    return (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Your short link
            </p>
            <div className="mt-1.5 flex items-center gap-2">
                <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 truncate font-mono text-sm font-medium underline-offset-4 hover:underline"
                >
                    {link.shortUrl}
                </a>
                <div className="ml-auto flex shrink-0 gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => void copy()}
                                aria-label="Copy the short link"
                            >
                                {copied ? <CheckIcon /> : <CopyIcon />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm" asChild>
                                <a
                                    href={link.shortUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Open the short link in a new tab"
                                >
                                    <ExternalLinkIcon />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Open</TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <p className="mt-2 truncate text-xs text-muted-foreground">
                Leads to <span className="text-foreground">{link.url}</span>
            </p>
        </div>
    );
}
