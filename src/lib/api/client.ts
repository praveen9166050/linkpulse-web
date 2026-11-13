/**
 * The typed LinkPulse API client. Paths, request bodies and responses all
 * come from `schema.d.ts`, which is GENERATED from the backend's
 * api/openapi.yaml (`npm run api:generate`). If the contract changes, calls
 * that no longer match it fail to compile.
 *
 * Calls go from the browser STRAIGHT to the API (another origin), which
 * allows this dashboard's origin with CORS (the API's CORS_ORIGINS).
 */
import createClient from "openapi-fetch";
import { API_BASE_URL } from "@/lib/config";
import type { components, paths } from "./schema";

export const apiClient = createClient<paths>({ baseUrl: API_BASE_URL });

export type Link = components["schemas"]["Link"];
export type CreateLinkRequest = components["schemas"]["CreateLinkRequest"];
export type Problem = components["schemas"]["Problem"];
export type Health = components["schemas"]["Health"];
export type LinkPage = components["schemas"]["LinkPage"];
export type RequestLogEntry = components["schemas"]["RequestLogEntry"];
