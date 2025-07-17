import { getEnumValues } from "../enum";

export function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}

export function isNull(value: unknown): value is null {
    return value === null;
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !isArray(value);
}

export function isObjectOrUndefined(value: unknown): value is Record<string, unknown> | undefined {
    return value === undefined || isObject(value);
}

export function isArray<T>(a: T[] | unknown): a is T[] {
    return !!a && Object.prototype.toString.call(a) === "[object Array]";
}

export function isArrayOrUndefined(value: unknown): value is unknown[] | undefined {
    return value === undefined || isArray(value);
}

export function isString(value: unknown): value is string {
    return typeof value === "string";
}

export function isStringOrUndefined(value: unknown): value is string | undefined {
    return value === undefined || typeof value === "string";
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

export function isBooleanOrUndefined(value: unknown): value is boolean | undefined {
    return value === undefined || typeof value === "boolean";
}

export function isFunction(value: unknown): value is Function {
    return typeof value === "function";
}

export function isFunctionOrUndefined(value: unknown): value is Function | undefined {
    return value === undefined || typeof value === "function";
}

export function isNumber(value: unknown): value is number {
    return typeof value === "number";
}

export function isNumberOrUndefined(value: unknown): value is number | undefined {
    return value === undefined || typeof value === "number";
}

export function isEnumValue<E extends Record<string, string | number>>(value: unknown, enumObj: E, name = "value"): value is E[keyof E] {
    return getEnumValues(enumObj).some(v => v === value);
}

export function isEnumValueOrUndefined<E extends Record<string, string | number>>(value: unknown, enumObj: E, name = "value"): value is E[keyof E] | undefined {
    return value === undefined || getEnumValues(enumObj).some(v => v === value);
}

export function isInteger(n: unknown): n is number {
    return typeof n === "number" && isFinite(n) && n === Math.trunc(n);
}

export function isIntegerEq(value: unknown, compareTo: number): value is number {
    return isInteger(value) && value === compareTo;
}

export function isIntegerGt(value: unknown, compareTo: number): value is number {
    return isInteger(value) && value > compareTo;
}

export function isIntegerGte(value: unknown, compareTo: number): value is number {
    return isInteger(value) && value >= compareTo;
}

export function isIntegerLt(value: unknown, compareTo: number): value is number {
    return isInteger(value) && value < compareTo;
}

export function isIntegerLte(value: unknown, compareTo: number): value is number {
    return isInteger(value) && value <= compareTo;
}
