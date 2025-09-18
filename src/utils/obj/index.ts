import { isArray } from "../arr";

export function isObject(obj: unknown): obj is Record<string, unknown> {
    return typeof obj === "object" && obj !== null && !isArray(obj);
}

/**
 * <pre>
 * Usage:
 *   hasProperties(obj, ["a", "b"]);          // Gives type Record<string, unknown>
 *   hasProperties(obj, ["a", "b"] as const); // Gives type Record<"a" | "b", unknown>
 * </pre>
 */
export function hasProperties<T extends readonly string[]>(obj: unknown, props: T | string[]): obj is Record<T[number], unknown> {
    return isObject(obj) && props.every(p => p in obj);
}
