import { deepEqual } from "../utils/obj";
import { EnumObject, getEnumValues } from "../utils/enum";

export type HasProps<T extends object> = T extends Record<string, unknown> ? T : never;

export function isEqual(val1: unknown, val2: unknown): boolean {
    return val1 === val2;
}

export function isDeepEqual(val1: unknown, val2: unknown): boolean {
    return deepEqual(val1, val2);
}

export function isUndefined(val: unknown): val is undefined {
    return val === undefined;
}

export function isNull(val: unknown): val is null {
    return val === null;
}

export function isNullish(val: unknown): val is null | undefined {
    return val === undefined || val === null;
}

export function isObject(val: unknown): val is Record<string, unknown> {
    return typeof val === "object" && val !== null && !isArray(val);
}

export function isObjectOrUndefined(val: unknown): val is Record<string, unknown> | undefined {
    return val === undefined || isObject(val);
}

export function isTypedObject<T extends object>(val: unknown, keys: (keyof T)[]): val is HasProps<T> {
    return isObject(val) && keys.every(k => k in val);
}

export function isArray<T>(arr: T[] | unknown): arr is T[] {
    return !!arr && Object.prototype.toString.call(arr) === "[object Array]";
}

export function isArrayOrUndefined(arr: unknown): arr is unknown[] | undefined {
    return arr === undefined || isArray(arr);
}

export function isEmptyArray<T>(arr: T[] | unknown): arr is T[] {
    return isArray(arr) && arr.length === 0;
}

export function isNonEmptyArray<T>(arr: T[] | unknown): arr is T[] {
    return isArray(arr) && arr.length > 0;
}

export function isEmptyArrayOrUndefined<T>(arr: T[] | unknown): arr is T[] | undefined {
    return isArray(arr) && arr.length === 0 || arr === undefined;
}

export function isNonEmptyArrayOrUndefined<T>(arr: T[] | unknown): arr is T[] | undefined {
    return isArray(arr) && arr.length > 0 || arr === undefined;
}

export function isString(val: unknown): val is string {
    return typeof val === "string";
}

export function isEmptyString(val: unknown): val is "" {
    return typeof val === "string" && val.length === 0;
}

export function isNonEmptyString(val: unknown): val is string {
    return typeof val === "string" && val.length > 0;
}

export function isStringOrUndefined(val: unknown): val is string | undefined {
    return val === undefined || typeof val === "string";
}

export function isEmptyStringOrUndefined(val: unknown): val is "" | undefined {
    return typeof val === "string" && val.length === 0 || val === undefined;
}

export function isNonEmptyStringOrUndefined(val: unknown): val is string | undefined {
    return typeof val === "string" && val.length > 0 || val === undefined;
}

export function isBoolean(val: unknown): val is boolean {
    return typeof val === "boolean";
}

export function isBooleanOrUndefined(val: unknown): val is boolean | undefined {
    return val === undefined || typeof val === "boolean";
}

export function isTrue(val: unknown): val is true {
    return val === true;
}

export function isTrueOrUndefined(val: unknown): val is true | undefined {
    return val === true || val === undefined;
}

export function isFalse(val: unknown): val is false {
    return val === false;
}

export function isFalseOrUndefined(val: unknown): val is false | undefined {
    return val === false || val === undefined;
}

export function isFunction(val: unknown): val is ((...args: any[]) => any) {
    return typeof val === "function";
}

export function isFunctionOrUndefined(val: unknown): val is ((...args: any[]) => any) | undefined {
    return val === undefined || typeof val === "function";
}

export function isEnumValue<E extends EnumObject>(val: unknown, enumObj: E): val is E[keyof E] {
    return getEnumValues(enumObj).some(v => v === val);
}

export function isEnumValueOrUndefined<E extends EnumObject>(val: unknown, enumObj: E): val is E[keyof E] | undefined {
    return val === undefined || getEnumValues(enumObj).some(v => v === val);
}

export function isNumber(val: unknown): val is number {
    return typeof val === "number";
}

export function isNumberOrUndefined(val: unknown): val is number | undefined {
    return typeof val === "number" || val === undefined;
}

export function isFinite(val: unknown): val is number {
    return typeof val === "number" && Number.isFinite(val);
}

export function isInteger(val: unknown): val is number {
    return typeof val === "number" && isFinite(val) && val === Math.trunc(val);
}

export function isIntegerOrUndefined(val: unknown): val is number | undefined {
    return typeof val === "number" && isFinite(val) && val === Math.trunc(val) || val === undefined;
}

export function isIntegerEq(val: unknown, ref: unknown): val is number {
    return isInteger(val) && val === ref;
}

export function isIntegerGt(val: unknown, ref: unknown): val is number {
    return isInteger(val) && isNumber(ref) && val > ref;
}

export function isIntegerGte(val: unknown, ref: unknown): val is number {
    return isInteger(val) && isNumber(ref) && val >= ref;
}

export function isIntegerLt(val: unknown, ref: unknown): val is number {
    return isInteger(val) && isNumber(ref) && val < ref;
}

export function isIntegerLte(val: unknown, ref: unknown): val is number {
    return isInteger(val) && isNumber(ref) && val <= ref;
}

export function isIntegerBetween(val: unknown, min: unknown, max: unknown): val is number {
    return isInteger(val) && isNumber(min) && isNumber(max) && val >= min && val <= max;
}

export function isIntegerBetweenExclusive(val: unknown, min: unknown, max: unknown): val is number {
    return isInteger(val) && isNumber(min) && isNumber(max) && val > min && val < max;
}

export function isNumberBetween(val: unknown, min: unknown, max: unknown): val is number {
    return isNumber(val) && isNumber(min) && isNumber(max) && val >= min && val <= max;
}

export function isNumberBetweenExclusive(val: unknown, min: unknown, max: unknown): val is number {
    return isNumber(val) && isNumber(min) && isNumber(max) && val > min && val < max;
}

export function isNaNValue(val: unknown): val is number {
    return typeof val === "number" && Number.isNaN(val);
}

export function isInfinity(val: unknown): val is number {
    return typeof val === "number" && Math.abs(val) === Infinity;
}

export function isPosInfinity(val: unknown): val is number {
    return typeof val === "number" && val === Infinity;
}

export function isNegInfinity(val: unknown): val is number {
    return typeof val === "number" && val === -Infinity;
}

export function isPos(val: unknown): val is number {
    return typeof val === "number" && val > 0;
}

export function isNeg(val: unknown): val is number {
    return typeof val === "number" && val < 0;
}

export function isZero(val: unknown): val is number {
    return typeof val === "number" && val === 0;
}

export function isPosZero(val: unknown): val is number {
    return typeof val === "number" && val === 0 && (1 / val === Infinity);
}

export function isNegZero(val: unknown): val is number {
    return typeof val === "number" && val === 0 && (1 / val === -Infinity);
}

export function isOddNumber(val: unknown): val is number {
    return isInteger(val) && val % 2 === 1;
}

export function isEvenNumber(val: unknown): val is number {
    return isInteger(val) && val % 2 === 0;
}

export function isDivisibleBy(val: unknown, n: unknown): val is number {
    return typeof val === "number" && typeof n === "number" && (val % n === 0);
}

export function isIncluded<T>(val: unknown, array: ReadonlyArray<T>): val is T {
    return isArray(array) && array.includes(val as T);
}

export function isArrayIndex<T>(index: unknown, array: ReadonlyArray<T>): index is number {
    return isArray(array) && isIntegerBetween(index, 0, array.length - 1);
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
