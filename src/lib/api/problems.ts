/**
 * Turns the API's RFC 9457 Problem Details into what a form can show:
 * one message per field, plus one message for the form as a whole.
 */
import type { Problem } from "./client";

export interface FormErrors {
    /** Field name -> message, e.g. { url: "Must start with http:// or https://" }. */
    readonly fields: Readonly<Record<string, string>>;
    /** A problem that isn't about one field (body too large, server error...). */
    readonly form?: string;
}

/** Problem types whose message belongs under a specific field. */
const FIELD_FOR_PROBLEM: Readonly<Record<string, string>> = {
    "/problems/code-taken": "code",
};

export function toFormErrors(problem: Problem): FormErrors {
    // 400 validation-error: the API lists every field problem at once.
    if (problem.errors && problem.errors.length > 0) {
        const fields: Record<string, string> = {};
        const unplaced: string[] = [];
        for (const error of problem.errors) {
            if (error.field.startsWith("("))
                unplaced.push(error.message); // e.g. "(body)"
            else fields[error.field] ??= error.message; // first message per field wins
        }
        return { fields, form: unplaced.length > 0 ? unplaced.join(" ") : undefined };
    }

    // 409 code-taken and similar: one problem that belongs to one field.
    const field = FIELD_FOR_PROBLEM[problem.type];
    const message = problem.detail ?? problem.title;
    return field ? { fields: { [field]: message } } : { fields: {}, form: message };
}
