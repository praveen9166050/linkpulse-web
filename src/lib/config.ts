/**
 * Where the LinkPulse API runs. NEXT_PUBLIC_ variables are inlined into the
 * browser bundle at build time, so this must never hold a secret.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3000";

/** The host part, as shown in short links ("127.0.0.1:3000"). */
export const API_HOST = new URL(API_BASE_URL).host;
