/**
 * dateUtils.ts
 *
 * Centralised date normalisation utilities.
 * Firebase Firestore stores timestamps as `Timestamp` objects
 * ({ seconds: number, nanoseconds: number }) when read via the JS SDK.
 * After round-tripping through React state or JSON serialisation they may
 * also arrive as plain objects or ISO strings.  This module provides a
 * single conversion function that handles every variant so that the rest
 * of the application can work with plain milliseconds or ISO strings
 * without any surprises.
 */

/**
 * Converts any value that may represent a date/time into a Unix timestamp
 * in milliseconds.  Returns 0 for unknown / null / undefined values so
 * callers can always do numeric comparisons safely.
 *
 * Handled input shapes:
 *   - Firebase `Timestamp` object (has `.toMillis()` method)
 *   - Plain object with `{ seconds, nanoseconds }` (serialised Timestamp)
 *   - ISO 8601 string
 *   - Unix timestamp as a number (milliseconds)
 *   - `null` / `undefined` → 0
 */
export function toTimestampMs(value: unknown): number {
  if (value == null) return 0;

  // Firebase Timestamp instance (has toMillis method)
  if (typeof (value as any).toMillis === 'function') {
    return (value as any).toMillis();
  }

  // Plain serialised Timestamp { seconds, nanoseconds }
  if (
    typeof value === 'object' &&
    typeof (value as any).seconds === 'number'
  ) {
    return (value as any).seconds * 1000 +
      Math.floor(((value as any).nanoseconds ?? 0) / 1_000_000);
  }

  // ISO string or numeric timestamp
  if (typeof value === 'string' || typeof value === 'number') {
    const ms = new Date(value).getTime();
    return isNaN(ms) ? 0 : ms;
  }

  return 0;
}

/**
 * Converts any date-like value to an ISO 8601 string.
 * Returns an empty string for unknown / null / undefined values.
 */
export function toISOString(value: unknown): string {
  const ms = toTimestampMs(value);
  if (ms === 0) return '';
  return new Date(ms).toISOString();
}
