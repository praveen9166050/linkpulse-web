/**
 * The typed LinkPulse API client. Paths, request bodies and responses all
 * come from `schema.d.ts`, which is GENERATED from the backend's
 * api/openapi.yaml (`npm run api:generate`). If the contract changes, calls
 * that no longer match it fail to compile.
 *
 * Browser code only: the base URL is empty, so requests go to this same
 * origin (/api/v1/...), where the Next.js proxy forwards them to the API.
 */
import createClient from "openapi-fetch";
import type { components, paths } from "./schema";

export const apiClient = createClient<paths>({ baseUrl: "" });

export type Link = components["schemas"]["Link"];
export type CreateLinkRequest = components["schemas"]["CreateLinkRequest"];
export type Problem = components["schemas"]["Problem"];
