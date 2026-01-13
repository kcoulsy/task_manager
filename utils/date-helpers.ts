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
