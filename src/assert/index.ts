import { Guard } from "..";
import { EnumObject } from "../utils/enum";
import { stringify } from "../utils/str";

const fmt = stringify;

export type ErrorConstructor = new (msg: string) => Error;

let errorConstructor: ErrorConstructor = Error;

export function setErrorClass(errorClass?: ErrorConstructor) {
    errorConstructor = errorClass ?? Error;
}

function _fail(...msgs: (string | undefined)[]): never {
    let msg = msgs.join(", ");
    throw new errorConstructor("Assertion Failed!" + (msg === "" ? "" : (" " + msg)));
}

export function assert<T>(condition: T, msg?: string) {
    if (!condition) {
        _fail(msg);
    }
}

export function require<T>(val: T | null | undefined, msg?: string): T {
    if (val == null) { // catches both null and undefined
        _fail(`Expected ${fmt(val)} not to be nullish`, msg);
    }
    return val;
}

export function requireDefined<T>(val: T | undefined, msg?: string): T {
    if (val === undefined) {
        _fail(`Expected ${fmt(val)} not to be undefined`, msg);
    }
    return val;
}

export function fail(msg?: string): never {
    _fail(msg);
}

export function isEqual<T = any>(val1: T, val2: unknown, msg?: string): T {
    if (!Guard.isEqual(val1, val2))
        _fail(`Expected ${fmt(val1)} to equal with ${val2}`, msg);
    return val1;
}

export function isDeepEqual<T = any>(val1: T, val2: unknown, msg?: string): T {
    if (!Guard.isDeepEqual(val1, val2))
        _fail(`Expected ${fmt(val1)} to deep equal with ${fmt(val2)}`, msg);
    return val1;
}

export function isUndefined(val: unknown, msg?: string): undefined {
    if (!Guard.isUndefined(val))
        _fail(`Expected ${fmt(val)} to be undefined`, msg);
    return val;
}

export function isNull(val: unknown, msg?: string): null {
    if (!Guard.isNull(val))
        _fail(`Expected ${fmt(val)} to be null`, msg);
    return val;
}

export function isNullish(val: unknown, msg?: string): null | undefined {
    if (!Guard.isNullish(val))
        _fail(`Expected ${fmt(val)} to be null or undefined`, msg);
    return val;
}

export function isObject(val: unknown, msg?: string): Record<string, unknown> {
    if (!Guard.isObject(val))
        _fail(`Expected ${fmt(val)} to be object`, msg);
    return val;
}

export function isObjectOrUndefined(val: unknown, msg?: string): Record<string, unknown> | undefined {
    if (!Guard.isObjectOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be object or undefined`, msg);
    return val;
}

export function isTypedObject<T extends object>(val: unknown, keys: (keyof T)[], msg?: string): Guard.HasProps<T> {
    if (!Guard.isTypedObject(val, keys))
        _fail(`Expected ${fmt(val)} to have keys ${fmt(keys)}`, msg);
    return val;
}

export function isArray<T>(val: unknown, msg?: string): T[] {
    if (!Guard.isArray(val))
        _fail(`Expected ${fmt(val)} to be array`, msg);
    return val as T[];
}

export function isArrayOrUndefined(val: unknown, msg?: string): val is unknown[] | undefined {
    if (!Guard.isArrayOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be array or undefined`, msg);
    return true;
}

export function isEmptyArray<T = any>(val: T[], msg?: string): asserts val is T[] {
    if (!Guard.isEmptyArray(val))
        _fail(`Expected ${fmt(val)} to be empty array`, msg);
}

export function isNonEmptyArray<T = any>(val: T[], msg?: string): asserts val is T[] {
    if (!Guard.isNonEmptyArray(val))
        _fail(`Expected ${fmt(val)} to be non-empty array`, msg);
}

export function isEmptyArrayOrUndefined<T = any>(val: unknown, msg?: string): asserts val is T[] | undefined {
    if (!Guard.isEmptyArrayOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be empty array or undefined`, msg);
}

export function isNonEmptyArrayOrUndefined<T = any>(val: unknown, msg?: string): asserts val is T[] | undefined {
    if (!Guard.isNonEmptyArrayOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be non-empty array or undefined`, msg);
}

export function isString(val: unknown, msg?: string): string {
    if (!Guard.isString(val))
        _fail(`Expected ${fmt(val)} to be string`, msg);
    return val;
}

export function isEmptyString(val: unknown, msg?: string): "" {
    if (!Guard.isEmptyString(val))
        _fail(`Expected ${fmt(val)} to be empty string`, msg);
    return val;
}

export function isNonEmptyString(val: unknown, msg?: string): string {
    if (!Guard.isNonEmptyString(val))
        _fail(`Expected ${fmt(val)} to be non-empty string`, msg);
    return val;
}

export function isStringOrUndefined(val: unknown, msg?: string): string | undefined {
    if (!Guard.isStringOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be string or undefined`, msg);
    return val;
}

export function isEmptyStringOrUndefined(val: unknown, msg?: string): "" | undefined {
    if (!Guard.isEmptyStringOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be empty string or undefined`, msg);
    return val;
}

export function isNonEmptyStringOrUndefined(val: unknown, msg?: string): string | undefined {
    if (!Guard.isNonEmptyStringOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be non-empty string or undefined`, msg);
    return val;
}

export function isBoolean(val: unknown, msg?: string): boolean {
    if (!Guard.isBoolean(val))
        _fail(`Expected ${fmt(val)} to be boolean`, msg);
    return val;
}

export function isBooleanOrUndefined(val: unknown, msg?: string): boolean | undefined {
    if (!Guard.isBooleanOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be boolean or undefined`, msg);
    return val;
}

export function isTrue(val: unknown, msg?: string): true {
    if (!Guard.isTrue(val))
        _fail(`Expected ${fmt(val)} to be true`, msg);
    return val;
}

export function isTrueOrUndefined(val: unknown, msg?: string): true | undefined {
    if (!Guard.isTrueOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be true or undefined`, msg);
    return val;
}

export function isFalse(val: unknown, msg?: string): false {
    if (!Guard.isFalse(val))
        _fail(`Expected ${fmt(val)} to be false`, msg);
    return val;
}

export function isFalseOrUndefined(val: unknown, msg?: string): false | undefined {
    if (!Guard.isFalseOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be false or undefined`, msg);
    return val;
}

export function isFunction<T extends (...args: any[]) => any>(val: unknown, msg?: string): T {
    if (!Guard.isFunction(val))
        _fail(`Expected ${fmt(val)} to be function`, msg);
    return val as T;
}

export function isFunctionOrUndefined<T extends (...args: any[]) => any>(val: unknown, msg?: string): T | undefined {
    if (!Guard.isFunctionOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be function or undefined`, msg);
    return val as T | undefined;
}

export function isEnumValue<E extends EnumObject>(val: unknown, enumObject: E, msg?: string): E[keyof E] {
    if (!Guard.isEnumValue(val, enumObject))
        _fail(`Expected ${fmt(val)} to be enum val`, msg);
    return val;
}

export function isEnumValueOrUndefined<E extends EnumObject>(val: unknown, enumObject: E, msg?: string): E[keyof E] | undefined {
    if (!Guard.isEnumValueOrUndefined(val, enumObject))
        _fail(`Expected ${fmt(val)} to be enum val or undefined`, msg);
    return val;
}

export function isNumber(val: unknown, msg?: string): number {
    if (!Guard.isNumber(val))
        _fail(`Expected ${fmt(val)} to be number`, msg);
    return val;
}

export function isNumberOrUndefined(val: unknown, msg?: string): number | undefined {
    if (!Guard.isNumberOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be number or undefined`, msg);
    return val;
}

export function isFinite(val: unknown, msg?: string): number {
    if (!Guard.isFinite(val))
        _fail(`Expected ${fmt(val)} to be finite`, msg);
    return val;
}

export function isInteger(val: unknown, msg?: string): number {
    if (!Guard.isInteger(val))
        _fail(`Expected ${fmt(val)} to be integer`, msg);
    return val;
}

export function isIntegerOrUndefined(val: unknown, msg?: string): number | undefined {
    if (!Guard.isIntegerOrUndefined(val))
        _fail(`Expected ${fmt(val)} to be integer or undefined`, msg);
    return val;
}

export function isIntegerEq(val: unknown, ref: unknown, msg?: string): number {
    if (!Guard.isIntegerEq(val, ref))
        _fail(`Expected ${fmt(val)} to be integer equal to ${fmt(ref)}`, msg);
    return val;
}

export function isIntegerGt(val: unknown, ref: unknown, msg?: string): number {
    if (!Guard.isIntegerGt(val, ref))
        _fail(`Expected ${fmt(val)} to be integer > ${fmt(ref)}`, msg);
    return val;
}

export function isIntegerGte(val: unknown, ref: unknown, msg?: string): number {
    if (!Guard.isIntegerGte(val, ref))
        _fail(`Expected ${fmt(val)} to be integer >= ${fmt(ref)}`, msg);
    return val;
}

export function isIntegerLt(val: unknown, ref: unknown, msg?: string): number {
    if (!Guard.isIntegerLt(val, ref))
        _fail(`Expected ${fmt(val)} to be integer < ${fmt(ref)}`, msg);
    return val;
}

export function isIntegerLte(val: unknown, ref: unknown, msg?: string): number {
    if (!Guard.isIntegerLte(val, ref))
        _fail(`Expected ${fmt(val)} to be integer <= ${fmt(ref)}`, msg);
    return val;
}

export function isIntegerBetween(val: unknown, min: unknown, max: unknown, msg?: string): number {
    if (!Guard.isIntegerBetween(val, min, max))
        _fail(`Expected integer ${fmt(min)} <= ${fmt(val)} <= ${fmt(max)}.`, msg);
    return val;
}

export function isIntegerBetweenExclusive(val: unknown, min: unknown, max: unknown, msg?: string): number {
    if (!Guard.isIntegerBetweenExclusive(val, min, max))
        _fail(`Expected integer ${fmt(min)} < ${fmt(val)} < ${fmt(max)}.`, msg);
    return val;
}

export function isNumberBetween(val: unknown, min: unknown, max: unknown, msg?: string): number {
    if (!Guard.isNumberBetween(val, min, max))
        _fail(`Expected number ${fmt(min)} <= ${fmt(val)} <= ${fmt(max)}.`, msg);
    return val;
}

export function isNumberBetweenExclusive(val: unknown, min: unknown, max: unknown, msg?: string): number {
    if (!Guard.isNumberBetweenExclusive(val, min, max))
        _fail(`Expected number ${fmt(min)} < ${fmt(val)} < ${fmt(max)}.`, msg);
    return val;
}

export function isNaNValue(val: unknown, msg?: string): number {
    if (!Guard.isNaNValue(val))
        _fail(`Expected ${fmt(val)} to be NaN.`, msg);
    return NaN;
}

export function isInfinity(val: unknown, msg?: string): number {
    if (!Guard.isInfinity(val))
        _fail(`Expected ${fmt(val)} to be +-Infinity.`, msg);
    return val;
}

export function isPosInfinity(val: unknown, msg?: string): number {
    if (!Guard.isPosInfinity(val))
        _fail(`Expected ${fmt(val)} to be +Infinity.`, msg);
    return val;
}

export function isNegInfinity(val: unknown, msg?: string): number {
    if (!Guard.isNegInfinity(val))
        _fail(`Expected ${fmt(val)} to be -Infinity.`, msg);
    return val;
}

export function isPos(val: unknown, msg?: string): number {
    if (!Guard.isPos(val))
        _fail(`Expected ${fmt(val)} to be > 0`, msg);
    return val;
}

export function isNeg(val: unknown, msg?: string): number {
    if (!Guard.isNeg(val))
        _fail(`Expected ${fmt(val)} to be < 0`, msg);
    return val;
}

export function isZero(val: unknown, msg?: string): number {
    if (!Guard.isZero(val))
        _fail(`Expected ${fmt(val)} to be 0`, msg);
    return val;
}

export function isPosZero(val: unknown, msg?: string): number {
    if (!Guard.isPosZero(val))
        _fail(`Expected ${fmt(val)} to be +0`, msg);
    return val;
}

export function isNegZero(val: unknown, msg?: string): number {
    if (!Guard.isNegZero(val))
        _fail(`Expected ${fmt(val)} to be -0`, msg);
    return val;
}

export function isOddNumber(val: unknown, msg?: string): number {
    if (!Guard.isOddNumber(val))
        _fail(`Expected ${fmt(val)} to odd number.`, msg);
    return val;
}

export function isEvenNumber(val: unknown, msg?: string): number {
    if (!Guard.isEvenNumber(val))
        _fail(`Expected ${fmt(val)} to even number.`, msg);
    return val;
}

export function isDivisibleBy(val: unknown, n: unknown, msg?: string): number {
    if (!Guard.isDivisibleBy(val, n))
        _fail(`Expected ${fmt(val)} to be divisble bu ${fmt(n)}.`, msg);
    return val;
}

export function isIncluded<T>(val: unknown, array: ReadonlyArray<T>, msg?: string): T {
    if (!Guard.isIncluded(val, array))
        _fail(`Expected ${fmt(val)} to be included in ${fmt(array)}.`, msg);
    return val;
}

export function isArrayIndex<T>(index: unknown, array: ReadonlyArray<T>, msg?: string): number {
    if (!Guard.isArrayIndex(index, array))
        _fail(`Expected ${index} to be index for ${fmt(array)}`, msg);
    return index;
}

export function isArrayElement<T>(index: unknown, array: ReadonlyArray<T>, msg?: string): T {
    if (!Guard.isArrayIndex(index, array))
        _fail(`Expected index ${index} to have element in ${fmt(array)}`, msg);
    return array[index];
}

export function isThrowing(throwTestFn: () => void, msg?: string): true {
    if (!Guard.isThrowing(throwTestFn))
        _fail(`Expected to throw`, msg);
    return true;
}

export function isNotThrowing(throwTestFn: () => void, msg?: string): true {
    if (!Guard.isNotThrowing(throwTestFn))
        _fail(`Expected to throw`, msg);
    return true;
}
