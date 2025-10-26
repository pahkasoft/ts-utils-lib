import { isArray, isFunction, isString } from "../guard";

/**
 * This function formats any value, strings, numbers, arrays, maps, sets, etc.
 * @param value 
 * @returns 
 */
export function formatValue(value: unknown): string {
    if(isString(value)) {
        return `"${value}"`;
    }
    else if (isArray(value)) {
        return `[ ${value.map(e => formatValue(e)).join(", ")} ]`.replaceAll("  ", " ");
    }
    else if (isFunction((value as any).toString)) {
        return (value as any).toString();
    }
    else {
        return JSON.stringify(value);
    }
}