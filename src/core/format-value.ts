import { isArray, isFunction, isString } from "../guard";

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