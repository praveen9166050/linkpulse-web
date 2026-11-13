/**
 * The create form's parts, one job each. Kept apart from the form so each
 * stays small; they hold no state, so they need no "use client" of their
 * own (the form that imports them is already a client component).
 */
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_HOST } from "@/lib/config";
import { cn } from "@/lib/utils";

interface FieldProps {
    /** Shown again after a rejected submit, so nothing typed is lost. */
    readonly defaultValue: string;
    /** The API's message for this field, if it rejected it. */
    readonly error?: string;
}

export function UrlField({ defaultValue, error }: FieldProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input
                id="url"
                name="url"
                type="url"
                inputMode="url"
                placeholder="https://example.com/a/very/long/path"
                autoComplete="off"
                defaultValue={defaultValue}
                {...invalidProps(error, "url-error")}
            />
            <FieldError id="url-error" message={error} />
        </div>
    );
}

export function CodeField({ defaultValue, error }: FieldProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor="code">
                Custom code <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <div
                className={cn(
                    "flex items-stretch overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
                    error &&
                        "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
                )}
            >
                <span className="flex items-center border-r bg-muted px-3 font-mono text-xs text-muted-foreground select-none">
                    {API_HOST}/
                </span>
                <Input
                    id="code"
                    name="code"
                    placeholder="my-link"
                    autoComplete="off"
                    spellCheck={false}
                    defaultValue={defaultValue}
                    className="rounded-none border-0 shadow-none focus-visible:ring-0 aria-invalid:ring-0"
                    {...invalidProps(error, "code-error", "code-hint")}
                />
            </div>
            {error ? (
                <FieldError id="code-error" message={error} />
            ) : (
                <p id="code-hint" className="text-xs text-muted-foreground">
                    3 to 32 letters, digits or hyphens. Case-sensitive.
                </p>
            )}
        </div>
    );
}

/** A problem with the request as a whole, above the button. */
export function FormAlert({ message }: { readonly message?: string }) {
    if (!message) return null;
    return (
        <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
            {message}
        </p>
    );
}

export function SubmitButton({ pending }: { readonly pending: boolean }) {
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2Icon data-icon="inline-start" className="animate-spin" />
                    Shortening…
                </>
            ) : (
                <>
                    Shorten link
                    <ArrowRightIcon data-icon="inline-end" />
                </>
            )}
        </Button>
    );
}

function FieldError({ id, message }: { readonly id: string; readonly message?: string }) {
    if (!message) return null;
    return (
        <p id={id} className="text-xs font-medium text-destructive">
            {message}
        </p>
    );
}

/**
 * The accessibility attributes for a field: when it has an error, mark it
 * invalid and point to the error; otherwise point to its hint, if any.
 */
function invalidProps(error: string | undefined, errorId: string, hintId?: string) {
    return error
        ? { "aria-invalid": true, "aria-describedby": errorId }
        : { "aria-describedby": hintId };
}
