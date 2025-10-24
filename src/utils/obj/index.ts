import { isObject } from "../../guard";

export { isObject }

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

export function deepEqual<T>(a: T, b: T): boolean {
    if (a === b) return true;

    // Handle null (typeof null === 'object')
    if (a === null || b === null) return false;

    // Handle non-objects (primitives, functions, etc.)
    if (typeof a !== 'object' || typeof b !== 'object') return false;

    // Arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((val, i) => deepEqual(val, b[i]));
    }

    // If one is array and the other isn’t
    if (Array.isArray(a) !== Array.isArray(b)) return false;

    // Objects
    const keysA = Object.keys(a) as (keyof T)[];
    const keysB = Object.keys(b) as (keyof T)[];
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
        if (!deepEqual(a[key], b[key])) return false;
    }

    return true;
}
