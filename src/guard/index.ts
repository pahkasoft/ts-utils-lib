import { deepEqual } from "../utils/obj";
import { getEnumValues } from "../utils/enum";

export function isEqual(value1: unknown, value2: unknown): boolean {
    return value1 === value2;
}

export function isDeepEqual(value1: unknown, value2: unknown): boolean {
    return deepEqual(value1, value2);
}

export function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}

export function isNull(value: unknown): value is null {
    return value === null;
}

export function isNullish(value: unknown): value is null | undefined {
    return value === undefined || value === null;
}

export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !isArray(value);
}

export function isObjectOrUndefined(value: unknown): value is Record<string, unknown> | undefined {
    return value === undefined || isObject(value);
}

export type HasProps<T extends object> = T extends Record<string, unknown> ? T : never;

export function isTypedObject<T extends object>(obj: unknown, keys: (keyof T)[]): obj is HasProps<T> {
    return isObject(obj) && keys.every(k => k in obj);
}

export function isArray<T>(a: T[] | unknown): a is T[] {
    return !!a && Object.prototype.toString.call(a) === "[object Array]";
}

export function isArrayOrUndefined(value: unknown): value is unknown[] | undefined {
    return value === undefined || isArray(value);
}

export function isEmptyArray<T>(a: T[] | unknown): a is T[] {
    return isArray(a) && a.length === 0;
}

export function isNonEmptyArray<T>(a: T[] | unknown): a is T[] {
    return isArray(a) && a.length > 0;
}

export function isEmptyArrayOrUndefined<T>(a: T[] | unknown): a is T[] | undefined {
    return isArray(a) && a.length === 0 || a === undefined;
}

export function isNonEmptyArrayOrUndefined<T>(a: T[] | unknown): a is T[] | undefined {
    return isArray(a) && a.length > 0 || a === undefined;
}

export function isString(value: unknown): value is string {
    return typeof value === "string";
}

export function isEmptyString(value: unknown): value is "" {
    return typeof value === "string" && value.length === 0;
}

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.length > 0;
}

export function isStringOrUndefined(value: unknown): value is string | undefined {
    return value === undefined || typeof value === "string";
}

export function isEmptyStringOrUndefined(value: unknown): value is "" | undefined {
    return typeof value === "string" && value.length === 0 || value === undefined;
}

export function isNonEmptyStringOrUndefined(value: unknown): value is string | undefined {
    return typeof value === "string" && value.length > 0 || value === undefined;
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

export function isBooleanOrUndefined(value: unknown): value is boolean | undefined {
    return value === undefined || typeof value === "boolean";
}

export function isTrue(value: unknown): value is true {
    return value === true;
}

export function isTrueOrUndefined(value: unknown): value is true {
    return value === true || value === undefined;
}

export function isFalse(value: unknown): value is false {
    return value === false;
}

export function isFalseOrUndefined(value: unknown): value is false {
    return value === false || value === undefined;
}

export function isFunction(value: unknown): value is Function {
    return typeof value === "function";
}

export function isFunctionOrUndefined(value: unknown): value is Function | undefined {
    return value === undefined || typeof value === "function";
}

export function isEnumValue<E extends Record<string, string | number>>(value: unknown, enumObj: E, name = "value"): value is E[keyof E] {
    return getEnumValues(enumObj).some(v => v === value);
}

export function isEnumValueOrUndefined<E extends Record<string, string | number>>(value: unknown, enumObj: E, name = "value"): value is E[keyof E] | undefined {
    return value === undefined || getEnumValues(enumObj).some(v => v === value);
}

export function isNumber(value: unknown): value is number {
    return typeof value === "number";
}

export function isNumberOrUndefined(value: unknown): value is number | undefined {
    return typeof value === "number" || value === undefined;
}

export function isFinite(value: unknown): value is number {
    return typeof value === "number" && Number.isFinite(value);
}

export function isInteger(n: unknown): n is number {
    return typeof n === "number" && isFinite(n) && n === Math.trunc(n);
}

export function isIntegerOrUndefined(n: unknown): n is number | undefined {
    return typeof n === "number" && isFinite(n) && n === Math.trunc(n) || n === undefined;
}

export function isIntegerEq(value: unknown, compareTo: unknown): value is number {
    return isInteger(value) && value === compareTo;
}

export function isIntegerGt(value: unknown, compareTo: unknown): value is number {
    return isInteger(value) && isNumber(compareTo) && value > compareTo;
}

export function isIntegerGte(value: unknown, compareTo: unknown): value is number {
    return isInteger(value) && isNumber(compareTo) && value >= compareTo;
}

export function isIntegerLt(value: unknown, compareTo: unknown): value is number {
    return isInteger(value) && isNumber(compareTo) && value < compareTo;
}

export function isIntegerLte(value: unknown, compareTo: unknown): value is number {
    return isInteger(value) && isNumber(compareTo) && value <= compareTo;
}

export function isIntegerBetween(value: unknown, min: unknown, max: unknown): value is number {
    return isInteger(value) && isNumber(min) && isNumber(max) && value >= min && value <= max;
}

export function isIntegerBetweenExclusive(value: unknown, min: unknown, max: unknown): value is number {
    return isInteger(value) && isNumber(min) && isNumber(max) && value > min && value < max;
}

export function isNumberBetween(value: unknown, min: unknown, max: unknown): value is number {
    return isNumber(value) && isNumber(min) && isNumber(max) && value >= min && value <= max;
}

export function isNumberBetweenExclusive(value: unknown, min: unknown, max: unknown): value is number {
    return isNumber(value) && isNumber(min) && isNumber(max) && value > min && value < max;
}

export function isNaNValue(value: unknown): value is number {
    return typeof value === "number" && Number.isNaN(value);
}

export function isInfinity(value: unknown): value is number {
    return typeof value === "number" && Math.abs(value) === Infinity;
}

export function isPosInfinity(value: unknown): value is number {
    return typeof value === "number" && value === Infinity;
}

export function isNegInfinity(value: unknown): value is number {
    return typeof value === "number" && value === -Infinity;
}

export function isOddNumber(value: unknown): value is number {
    return isInteger(value) && value % 2 === 1;
}

export function isEvenNumber(value: unknown): value is number {
    return isInteger(value) && value % 2 === 0;
}

export function isIncluded<T>(value: T, array: ReadonlyArray<T>): value is T {
    return array.includes(value);
}

export function isArrayIndex<T>(index: unknown, array: ReadonlyArray<T>): index is number {
    return isInteger(index) && isArray(array) && index >= 0 && index < array.length;
}

export function isThrowing(throwTestFn: () => void): boolean {
    try { throwTestFn(); return false; }
    catch (err) { return true; }
}

export function isNotThrowing(throwTestFn: () => void): boolean {
    try { throwTestFn(); return true; }
    catch (err) { return false; }
}

export function tryOr<TRY_RVAL, OR_RVAL>(tryFn: () => TRY_RVAL, orVal: OR_RVAL | (() => OR_RVAL)): TRY_RVAL | OR_RVAL {
    try {
        return tryFn();
    }
    catch (err) {
        return isFunction(orVal) ? orVal() : orVal;
    }
}
