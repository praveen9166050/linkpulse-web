"use client";

/**
 * Owns the links list: its pages, loading and errors. Shared through context
 * so the create form can put a new link at the top of the table the moment
 * it's created, without refetching anything.
 *
 * Pages come from GET /api/v1/links with keyset pagination: "Load more"
 * passes back the previous page's opaque `nextCursor`.
 */
import {
    createContext,
    type ReactNode,
    use,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { apiClient, type Link, type LinkPage } from "@/lib/api/client";

const PAGE_SIZE = 10;

export type LinksState =
    | { readonly status: "loading" }
    | { readonly status: "error"; readonly message: string }
    | {
          readonly status: "ready";
          readonly items: readonly Link[];
          readonly nextCursor: string | null;
          readonly loadingMore: boolean;
          readonly loadMoreError?: string;
      };

export interface LinksContextValue {
    readonly state: LinksState;
    /** Reload from the newest link. */
    readonly refresh: () => void;
    /** Append the next page. */
    readonly loadMore: () => void;
    /** Put a just-created link at the top. */
    readonly add: (link: Link) => void;
}

const LinksContext = createContext<LinksContextValue>({
    state: { status: "loading" },
    refresh: () => undefined,
    loadMore: () => undefined,
    add: () => undefined,
});

export function LinksProvider({ children }: { readonly children: ReactNode }) {
    const [state, setState] = useState<LinksState>({ status: "loading" });
    /** Bumped by refresh(): a new value re-runs the first-page effect. */
    const [reloads, setReloads] = useState(0);

    // Synchronise with an external system (the API): start the request here,
    // and set state only in its callback, never synchronously in the effect.
    useEffect(() => {
        const controller = new AbortController();
        void fetchPage(undefined, controller.signal).then((result) => {
            if (!controller.signal.aborted) setState(firstPageState(result));
        });
        return () => controller.abort();
    }, [reloads]);

    const refresh = useCallback(() => {
        setState({ status: "loading" }); // in an event handler: fine
        setReloads((count) => count + 1);
    }, []);

    const loadMore = useCallback(() => {
        if (state.status !== "ready" || !state.nextCursor || state.loadingMore) return;
        const cursor = state.nextCursor;
        setState({ ...state, loadingMore: true, loadMoreError: undefined });

        void fetchPage(cursor).then((result) => {
            setState((current) => {
                if (current.status !== "ready") return current;
                if (!result.ok)
                    return { ...current, loadingMore: false, loadMoreError: result.message };
                return {
                    status: "ready",
                    items: withoutDuplicates([...current.items, ...result.page.items]),
                    nextCursor: result.page.nextCursor,
                    loadingMore: false,
                };
            });
        });
    }, [state]);

    const add = useCallback((link: Link) => {
        setState((current) =>
            current.status === "ready"
                ? { ...current, items: withoutDuplicates([link, ...current.items]) }
                : current,
        );
    }, []);

    // A stable object, so consumers only re-render when something really changed.
    const value = useMemo(
        () => ({ state, refresh, loadMore, add }),
        [state, refresh, loadMore, add],
    );
    return <LinksContext value={value}>{children}</LinksContext>;
}

export function useLinks(): LinksContextValue {
    return use(LinksContext);
}

type PageResult =
    | { readonly ok: true; readonly page: LinkPage }
    | { readonly ok: false; readonly message: string };

async function fetchPage(cursor: string | undefined, signal?: AbortSignal): Promise<PageResult> {
    try {
        const { data, response } = await apiClient.GET("/api/v1/links", {
            params: { query: cursor ? { limit: PAGE_SIZE, cursor } : { limit: PAGE_SIZE } },
            signal,
        });
        return data && Array.isArray(data.items)
            ? { ok: true, page: data }
            : { ok: false, message: `The API answered ${String(response.status)}.` };
    } catch {
        return { ok: false, message: "Can't reach the API." };
    }
}

function firstPageState(result: PageResult): LinksState {
    return result.ok
        ? {
              status: "ready",
              items: result.page.items,
              nextCursor: result.page.nextCursor,
              loadingMore: false,
          }
        : { status: "error", message: result.message };
}

/** Keeps the first occurrence of each code (a just-added link may also arrive in a page). */
function withoutDuplicates(links: readonly Link[]): Link[] {
    const seen = new Set<string>();
    return links.filter((link) => !seen.has(link.code) && seen.add(link.code));
}
