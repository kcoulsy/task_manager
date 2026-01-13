import { parseDate, getLocalTimeZone, type CalendarDate } from "@internationalized/date";

/**
 * Converts a CalendarDate to an ISO date string (YYYY-MM-DD)
 */
export function dateValueToString(dateValue: CalendarDate | null): string | null {
  if (!dateValue) return null;
  const date = dateValue.toDate(getLocalTimeZone());
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Converts an ISO date string (YYYY-MM-DD) to a CalendarDate
 */
export function stringToDateValue(dateString: string | null | undefined): CalendarDate | null {
  if (!dateString) return null;
  try {
    return parseDate(dateString);
  } catch {
    return null;
  }
}

/**
 * Formats a date as a human-readable relative time (e.g., "5m ago", "2h ago", "3d ago")
 * Falls back to a formatted date string for dates older than 7 days
 */
export function formatHumanRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) || "";
}
