"use client";

/**
 * The create-a-link form, wired to POST /api/v1/links.
 *
 * A CLIENT component: it has state and handles a submit. It uses React 19's
 * useActionState: submitting runs `createLink`, whose return value becomes
 * the new state, and React tracks `isPending` while it runs.
 *
 * The API is the single source of truth for validation (noValidate turns
 * off the browser's own popups): its Problem Details are shown under the
 * field they belong to.
 */
import { useActionState } from "react";
import { toast } from "sonner";
import {
    CodeField,
    FormAlert,
    SubmitButton,
    UrlField,
} from "@/components/dashboard/create-link-fields";
import { CreatedLink } from "@/components/dashboard/created-link";
import { apiClient, type Link, type Problem } from "@/lib/api/client";
import { type FormErrors, toFormErrors } from "@/lib/api/problems";
import { API_BASE_URL } from "@/lib/config";

interface FormValues {
    readonly url: string;
    readonly code: string;
}

type CreateLinkState =
    | { readonly status: "idle" }
    | { readonly status: "created"; readonly link: Link }
    | { readonly status: "rejected"; readonly errors: FormErrors; readonly values: FormValues };

const INITIAL_STATE: CreateLinkState = { status: "idle" };

export function CreateLinkForm() {
    const [state, formAction, isPending] = useActionState(createLink, INITIAL_STATE);

    const errors = state.status === "rejected" ? state.errors : undefined;
    // Kept after a rejection, so nothing typed is lost; cleared after success.
    const values = state.status === "rejected" ? state.values : { url: "", code: "" };

    return (
        <div className="grid gap-5">
            <form action={formAction} noValidate className="grid gap-5">
                <UrlField defaultValue={values.url} error={errors?.fields.url} />
                <CodeField defaultValue={values.code} error={errors?.fields.code} />
                <FormAlert message={errors?.form} />
                <SubmitButton pending={isPending} />
            </form>

            {/* aria-live: screen readers announce the new link when it appears. */}
            <div aria-live="polite">
                {state.status === "created" && <CreatedLink link={state.link} />}
            </div>
        </div>
    );
}

/** The form's action: POST the link, then turn the outcome into the next state. */
async function createLink(_previous: CreateLinkState, form: FormData): Promise<CreateLinkState> {
    const values: FormValues = {
        url: readText(form, "url"),
        code: readText(form, "code"),
    };

    try {
        const { data, error, response } = await apiClient.POST("/api/v1/links", {
            // An empty code means "generate one": leave the field out.
            body: values.code ? { url: values.url, code: values.code } : { url: values.url },
        });
        if (data) {
            toast.success("Short link created", { description: data.shortUrl });
            return { status: "created", link: data };
        }
        // Anything that reaches us over the network is checked, not trusted.
        const errors = isProblem(error)
            ? toFormErrors(error)
            : { fields: {}, form: `The API answered ${String(response.status)} unexpectedly.` };
        return { status: "rejected", errors, values };
    } catch {
        // fetch() itself failed: no answer at all.
        return {
            status: "rejected",
            errors: { fields: {}, form: `Can't reach the API at ${API_BASE_URL}. Is it running?` },
            values,
        };
    }
}

function readText(form: FormData, name: string): string {
    const value = form.get(name);
    return typeof value === "string" ? value.trim() : "";
}

function isProblem(value: unknown): value is Problem {
    return (
        typeof value === "object" &&
        value !== null &&
        "type" in value &&
        "title" in value &&
        "status" in value
    );
}
