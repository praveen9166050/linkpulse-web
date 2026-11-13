/** Display helpers for dates. Pure functions: easy to test, no React. */

const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const absolute = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "medium" });

/** Largest unit first: the first one that fits is used ("3 hours ago", not "180 minutes ago"). */
const UNITS: readonly [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 365 * 24 * 3600],
    ["month", 30 * 24 * 3600],
    ["day", 24 * 3600],
    ["hour", 3600],
    ["minute", 60],
];

/** "just now", "5 minutes ago", "yesterday", "3 months ago". */
export function timeAgo(date: Date, now: Date = new Date()): string {
    const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
    if (Math.abs(seconds) < 45) return "just now";
    for (const [unit, size] of UNITS) {
        if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
    }
    return relative.format(Math.round(seconds / 60), "minute");
}

/** "Nov 14, 2026, 9:30:00 AM" in the viewer's time zone. */
export function fullDateTime(date: Date): string {
    return absolute.format(date);
}
