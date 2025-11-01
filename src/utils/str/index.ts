import { BaseContainer } from "../../core";
import { isString, isArray, isInteger, isNaNValue, isFinite } from "../../guard";
export { isString }

/**
 * toCharArray("abc") => ["a", "b", "c"].
 * @param str 
 */
export function toCharArray(str: string): string[] {
    return str.split("");
}

/**
 * repeat("abc", 3) => "abcabcabc".
 * repeat("abc", 0) => "".
 * @param repeatString 
 * @param repeatCount 
 */
export function repeatString(repeatString: string, repeatCount: number): string {
    if (!isInteger(repeatCount) || repeatCount < 0) {
        throw new Error("repeatStr: Invalid repeatCount = " + repeatCount);
    }

    return new Array(repeatCount + 1).join(repeatString);
}

/**
 * "abcdefgh":chunkSize = 3 => ["abc", "def", "gh"]
 * @param str 
 * @param chunkSize
 */
export function chunkString(str: string, chunkSize: number): string[] {
    if (!isInteger(chunkSize) || chunkSize < 1) {
        throw new Error("chunckString: Invalid chuckSize = " + chunkSize);
    }
    let result: string[] = [];
    for (let i = 0; i < str.length; i += chunkSize) {
        result.push(str.slice(i, i + chunkSize));
    }
    return result;
}

/**
 * Replaces part of string.
 * @param str 
 * @param pos 
 * @param removeCount 
 * @param insert 
 */
export function replaceAt(str: string, pos: number, removeCount: number, insert: string) {
    if (!isInteger(removeCount) || removeCount < 0) {
        throw new Error("replaceAt: Invalid removeCount = " + removeCount);
    }
    else if (!isInteger(pos) || pos < 0 || pos + removeCount > str.length) {
        throw new Error("replaceAt: Invalid pos = " + pos + ", removeCount = " + removeCount + ", str.length = " + str.length);
    }
    else {
        return str.substring(0, pos) + insert + str.substring(pos + removeCount);
    }
}

/**
 * Insert string to another.
 * @param str 
 * @param pos 
 * @param insertStr 
 */
export function insertAt(str: string, pos: number, insertStr: string) {
    return replaceAt(str, pos, 0, insertStr);
}

/**
 * Remove part of string.
 * @param str 
 * @param pos 
 * @param removeCount 
 */
export function removeAt(str: string, pos: number, removeCount: number) {
    return replaceAt(str, pos, removeCount, "");
}

/**
 * Count number of char in string.
 * @param str
 * @param ch - must be single char.
 * @returns number of chars in string.
 */
export function charCount(str: string, ch: string): number {
    if (ch.length !== 1 || str.length === 0) return 0;

    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === ch) count++;
    }

    return count;
}

/**
 * "UndeclaredVariable" => "Undeclared variable"
 * @param PascalString 
 */
export function makeSentenceFromPascal(PascalString: string) {
    if (PascalString === "") {
        return "";
    }
    let word = PascalString.charAt(0);
    let sentence = "";

    const addWord = () => {
        if (word !== "") {
            if (sentence === "") {
                sentence += word.charAt(0).toUpperCase() + word.substring(1);
            }
            else {
                sentence += " " + word;
            }
            word = "";
        }
    }

    const isLetterAndCapital = (c: string) => {
        return c.toUpperCase() !== c.toLowerCase() && c === c.toUpperCase();
    }

    for (let i = 1; i < PascalString.length; i++) {
        let c = PascalString.charAt(i);
        if (isLetterAndCapital(c)) {
            addWord();
        }
        word += c.toLowerCase();
    }

    addWord();

    return sentence;
}

function getCtorName(value: any): string {
    if (value === null) return "null";
    if (Array.isArray(value)) return "Array";
    if (typeof value !== "object") return typeof value;

    const tag = Object.prototype.toString.call(value).slice(8, -1);
    return tag || "Object";
}

export function stringify(value: any, maxDepth = 5, seen = new WeakSet()): string {
    // --- Primitive & simple values ---
    if (value === null) return "null";
    if (value === undefined) return "undefined";

    const t = typeof value;
    switch (t) {
        case "boolean": return value ? "true" : "false";
        case "number":
            if (isNaNValue(value)) return "NaN";
            if (!isFinite(value))
                return value < 0 ? "-Infinity" : "Infinity";
            return value.toString();
        case "bigint": return `${value}n`;
        case "string": return `"${value}"`;
        case "symbol": return value.description
            ? `Symbol(${value.description})`
            : "Symbol()";
        case "function":
            return `[Function${value.name ? ` ${value.name}` : ""}]`;
    }

    // Prevent infinite recursion
    if (seen.has(value))
        return "[Circular]";
    if (maxDepth <= 0)
        return "[Depth limit]";

    maxDepth--;

    // Mark as seen before descending
    seen.add(value);

    const strfy = (v: any): string => stringify(v, maxDepth, seen);

    // --- Containers ---
    if (isArray(value)) {
        const inner = value.map(v => strfy(v)).join(", ");
        return inner.length === 0 ? "[ ]" : `[ ${inner} ]`;
    }

    // --- Typed arrays ---
    if (ArrayBuffer.isView(value)) {
        // covers all TypedArrays + DataView
        if (value instanceof DataView)
            return `DataView(${value.byteLength})`;
        const inner = Array.from(value as any).map(v => strfy(v)).join(", ");
        return `${value.constructor.name}[ ${inner} ]`;
    }

    // --- ArrayBuffer ---
    if (value instanceof ArrayBuffer)
        return `ArrayBuffer(${value.byteLength})`;

    // --- Map / Set ---
    if (value instanceof Map) {
        const entries = Array.from(value.entries())
            .map(([k, v]) => `${strfy(k)} => ${strfy(v)}`)
            .join(", ");
        return entries.length === 0
            ? `Map(${value.size}){ }`
            : `Map(${value.size}){ ${entries} }`;
    }

    if (value instanceof Set) {
        const entries = Array.from(value.values())
            .map(v => strfy(v))
            .join(", ");
        return entries.length === 0
            ? `Set(${value.size}){ }`
            : `Set(${value.size}){ ${entries} }`;
    }

    if (value instanceof WeakMap)
        return "WeakMap{ ? }";
    if (value instanceof WeakSet)
        return "WeakSet{ ? }";

    // --- Custom container class ---
    if (typeof BaseContainer !== "undefined" && value instanceof BaseContainer)
        return value.toString();

    // --- Built-ins ---
    if (value instanceof Date)
        return `Date("${value.toISOString()}")`;

    if (value instanceof RegExp)
        return value.toString();

    if (value instanceof Error)
        return `${value.name}("${value.message}")`;

    if (value instanceof Promise)
        return "Promise{ ? }";

    if (value instanceof URL)
        return `URL("${value.href}")`;

    if (value instanceof URLSearchParams)
        return `URLSearchParams("${value.toString()}")`;

    // --- Common singletons ---
    if (value === Math) return "Math";
    if (value === JSON) return "JSON";
    if (value === Reflect) return "Reflect";
    if (value === Intl) return "Intl";

    // --- Custom toString method ---
    const hasCustomToString =
        typeof value?.toString === "function" &&
        value.toString !== Object.prototype.toString;

    if (hasCustomToString) {
        try {
            const str = value.toString();
            // Optional: skip if it’s just "[object Object]"
            if (!/^\[object .+\]$/.test(str)) return str;
        }
        catch { /* ignore broken toString() */ }
    }

    // --- Plain object or class instance ---
    if (t === "object") {
        const ctorName = getCtorName(value);
        const entries = Object.entries(value).map(
            ([key, val]) => `${strfy(key)}: ${strfy(val)}`
        );
        if (entries.length === 0) return `${ctorName}{ }`;
        return `${ctorName}{ ${entries.join(", ")} }`;
    }

    // --- Fallback ---
    return String(value);
}
