"use client";

/** An icon button that copies `value`, confirms with a check mark and a toast. */
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const COPIED_FOR_MS = 1500;

export function CopyButton({
    value,
    label,
}: {
    readonly value: string;
    /** For screen readers, e.g. "Copy the short link". */
    readonly label: string;
}) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success("Copied to clipboard", { description: value });
            setTimeout(() => setCopied(false), COPIED_FOR_MS);
        } catch {
            toast.error("Couldn't copy: the browser blocked clipboard access");
        }
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void copy()}
                    aria-label={label}
                >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
        </Tooltip>
    );
}
