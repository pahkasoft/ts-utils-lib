import { Guard } from "..";
import { EnumObject } from "../utils/enum";

export type ErrorConstructor = new (msg: string) => Error;

let errorConstructor: ErrorConstructor = Error;

export function setErrorClass(errorClass?: ErrorConstructor) {
    errorConstructor = errorClass ?? Error;
}

function _fail(...msgs: (string | undefined)[]): never {
    let msg = msgs.join(", ");
    throw new errorConstructor("Assertion Failed!" + (msg === "" ? "" : (" " + msg)));
}

//--------------------------------------------------------------------------------------------------------
// Deprecated

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function interrupt(msg?: string): never {
    _fail("Interrupted!");
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function assertEnum<E extends EnumObject>(enumVal: unknown, enumObj: E, name = "value"): asserts enumVal is E[keyof E] {
    if (!Guard.isEnumValue(enumVal, enumObj))
        _fail(`Invalid enum value ${enumVal}.`);
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function int(value: unknown, msg?: string): number {
    if (!Guard.isInteger(value))
        _fail(`Expected ${value} to be integer.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function eq<T>(value1: T, value2: T, msg?: string): T {
    if (value1 !== value2)
        _fail(`Expected ${value1} to equal ${value2}.`, msg);
    return value1;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function int_eq(value: unknown, compareTo: unknown, msg?: string): number {
    if (!Guard.isIntegerEq(value, compareTo))
        _fail(`Expected ${value} to be integer equal to ${compareTo}.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function int_lt(value: unknown, compareTo: unknown, msg?: string): number {
    if (!Guard.isIntegerLt(value, compareTo))
        _fail(`Expected ${value} to be integer less than ${compareTo}.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function int_lte(value: unknown, compareTo: unknown, msg?: string): number {
    if (!Guard.isIntegerLte(value, compareTo))
        _fail(`Expected ${value} to be integer less than or equal to ${compareTo}.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function int_gt(value: unknown, compareTo: unknown, msg?: string): number {
    if (!Guard.isIntegerGt(value, compareTo))
        _fail(`Expected ${value} to be integer greater than ${compareTo}.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function int_gte(value: unknown, compareTo: unknown, msg?: string): number {
    if (!Guard.isIntegerGte(value, compareTo))
        _fail(`Expected ${value} to be integer greater than or equal to ${compareTo}.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function int_between(value: unknown, min: unknown, max: unknown, msg?: string): number {
    if (!Guard.isIntegerBetween(value, min, max))
        _fail(`Expected integer between ${min} <= ${value} <= ${max}.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function int_between_exclusive(value: unknown, min: unknown, max: unknown, msg?: string): number {
    if (!Guard.isIntegerBetweenExclusive(value, min, max))
        _fail(`Expected integer between ${min} < ${value} < ${max}.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function odd(value: unknown, msg?: string): number {
    if (!Guard.isOddNumber(value))
        _fail(`Expected ${value} to be odd number.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function even(value: unknown, msg?: string): number {
    if (!Guard.isEvenNumber(value))
        _fail(`Expected ${value} to be even number.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function in_group<T>(value: T, group: ReadonlyArray<T>, msg?: string): T {
    if (!(group.some(e => e === value)))
        _fail(`Expected ${value} to be in group [${group.map(v => String(v)).join(", ")}].`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function finite(value: unknown, msg?: string): number {
    if (!Guard.isFinite(value))
        _fail(`Expected ${value} to be finite number.`, msg);
    return value;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function array_id<T>(array: Readonly<T[]>, index: unknown, msg?: string): number {
    if (!Guard.isInteger(index) || !Guard.isArray(array) || index < 0 || index >= array.length)
        _fail(`Expected ${index} to be array index in bounds [0..${array.length - 1}].`, msg);
    return index;
}

/**
 * @deprecated - Wil be removed in v2.0.0.
 * @private
 */
export function array_elem<T>(array: Readonly<T[]>, index: number, msg?: string): T {
    return array[array_id(array, index, msg)];
}

//--------------------------------------------------------------------------------------------------------
// New functions

export function assert<T>(condition: T, msg?: string) {
    if (!condition) {
        _fail(msg);
    }
}

export function require<T>(value: T | null | undefined, msg?: string): T {
    if (value == null) { // catches both null and undefined
        _fail(`Expected ${value} not to be nullish`, msg);
    }
    return value;
}

export function requireDefined<T>(value: T | undefined, msg?: string): T {
    if (value === undefined) {
        _fail(`Expected ${value} not to be undefined`, msg);
    }
    return value;
}

export function fail(msg?: string): never {
    _fail(msg);
}

export function isEqual(value1: unknown, value2: unknown, msg?: string) {
    if (!Guard.isEqual(value1, value2))
        _fail(`Expected ${value1} to equal with ${value2}`, msg);
    return true;
}

export function isDeepEqual(value1: unknown, value2: unknown, msg?: string) {
    if (!Guard.isDeepEqual(value1, value2))
        _fail(`Expected ${value1} to deep equal with ${value2}`, msg);
    return true;
}

export function isUndefined(value: unknown, msg?: string): value is undefined {
    if (!Guard.isUndefined(value))
        _fail(`Expected ${value} to be undefined`, msg);
    return true;
}

export function isNull(value: unknown, msg?: string): value is null {
    if (!Guard.isNull(value))
        _fail(`Expected ${value} to be null`, msg);
    return true;
}

export function isNullish(value: unknown, msg?: string): value is null | undefined {
    if (!Guard.isNullish(value))
        _fail(`Expected ${value} to be null or undefined`, msg);
    return true;
}

export function isObject(value: unknown, msg?: string): value is Record<string, unknown> {
    if (!Guard.isObject(value))
        _fail(`Expected ${value} to be object`, msg);
    return true;
}

export function isObjectOrUndefined(value: unknown, msg?: string): value is Record<string, unknown> | undefined {
    if (!Guard.isObjectOrUndefined(value))
        _fail(`Expected ${value} to be object or undefined`, msg);
    return true;
}

export function isTypedObject<T extends object>(obj: unknown, keys: (keyof T)[], msg?: string): obj is Guard.HasProps<T> {
    if (!Guard.isTypedObject(obj, keys))
        _fail(`Expected ${obj} to be object with keys [${keys.map(key => `'${String(key)}'`).join(", ")}]`, msg);
    return true;
}

export function isArray<T>(value: T[] | unknown, msg?: string): value is T[] {
    if (!Guard.isArray(value))
        _fail(`Expected ${value} to be array`, msg);
    return true;
}

export function isArrayOrUndefined(value: unknown, msg?: string): value is unknown[] | undefined {
    if (!Guard.isArrayOrUndefined(value))
        _fail(`Expected ${value} to be array or undefined`, msg);
    return true;
}

export function isEmptyArray<T>(value: T[] | unknown, msg?: string): value is T[] {
    if (!Guard.isEmptyArray(value))
        _fail(`Expected ${value} to be empty array`, msg);
    return true;
}

export function isNonEmptyArray<T>(value: T[] | unknown, msg?: string): value is T[] {
    if (!Guard.isNonEmptyArray(value))
        _fail(`Expected ${value} to be non-empty array`, msg);
    return true;
}

export function isEmptyArrayOrUndefined<T>(value: T[] | unknown, msg?: string): value is T[] | undefined {
    if (!Guard.isEmptyArrayOrUndefined(value))
        _fail(`Expected ${value} to be empty array or undefined`, msg);
    return true;
}

export function isNonEmptyArrayOrUndefined<T>(value: T[] | unknown, msg?: string): value is T[] | undefined {
    if (!Guard.isNonEmptyArrayOrUndefined(value))
        _fail(`Expected ${value} to be non-empty array or undefined`, msg);
    return true;
}

export function isString(value: unknown, msg?: string): value is string {
    if (!Guard.isString(value))
        _fail(`Expected ${value} to be string`, msg);
    return true;
}

export function isEmptyString(value: unknown, msg?: string): value is "" {
    if (!Guard.isEmptyString(value))
        _fail(`Expected ${value} to be empty string`, msg);
    return true;
}

export function isNonEmptyString(value: unknown, msg?: string): value is string {
    if (!Guard.isNonEmptyString(value))
        _fail(`Expected ${value} to be non-empty string`, msg);
    return true;
}

export function isStringOrUndefined(value: unknown, msg?: string): value is string | undefined {
    if (!Guard.isStringOrUndefined(value))
        _fail(`Expected ${value} to be string or undefined`, msg);
    return true;
}

export function isEmptyStringOrUndefined(value: unknown, msg?: string): value is "" | undefined {
    if (!Guard.isEmptyStringOrUndefined(value))
        _fail(`Expected ${value} to be empty string or undefined`, msg);
    return true;
}

export function isNonEmptyStringOrUndefined(value: unknown, msg?: string): value is string | undefined {
    if (!Guard.isNonEmptyStringOrUndefined(value))
        _fail(`Expected ${value} to be non-empty string or undefined`, msg);
    return true;
}

export function isBoolean(value: unknown, msg?: string): value is boolean {
    if (!Guard.isBoolean(value))
        _fail(`Expected ${value} to be boolean`, msg);
    return true;
}

export function isBooleanOrUndefined(value: unknown, msg?: string): value is boolean | undefined {
    if (!Guard.isBooleanOrUndefined(value))
        _fail(`Expected ${value} to be boolean or undefined`, msg);
    return true;
}

export function isTrue(value: unknown, msg?: string): value is boolean {
    if (!Guard.isTrue(value))
        _fail(`Expected ${value} to be true`, msg);
    return true;
}

export function isTrueOrUndefined(value: unknown, msg?: string): value is boolean {
    if (!Guard.isTrueOrUndefined(value))
        _fail(`Expected ${value} to be true or undefined`, msg);
    return true;
}

export function isFalse(value: unknown, msg?: string): value is boolean {
    if (!Guard.isFalse(value))
        _fail(`Expected ${value} to be false`, msg);
    return true;
}

export function isFalseOrUndefined(value: unknown, msg?: string): value is boolean {
    if (!Guard.isFalseOrUndefined(value))
        _fail(`Expected ${value} to be false or undefined`, msg);
    return true;
}

export function isFunction(value: unknown, msg?: string): value is Function {
    if (!Guard.isFunction(value))
        _fail(`Expected ${value} to be function`, msg);
    return true;
}

export function isFunctionOrUndefined(value: unknown, msg?: string): value is Function | undefined {
    if (!Guard.isFunctionOrUndefined(value))
        _fail(`Expected ${value} to be function or undefined`, msg);
    return true;
}

export function isEnumValue<E extends EnumObject>(enumValue: unknown, enumObject: E, msg?: string): enumValue is E[keyof E] {
    if (!Guard.isEnumValue(enumValue, enumObject))
        _fail(`Expected ${enumValue} to be enum value`, msg);
    return true;
}

export function isEnumValueOrUndefined<E extends EnumObject>(enumValue: unknown, enumObject: E, msg?: string): enumValue is E[keyof E] {
    if (!Guard.isEnumValueOrUndefined(enumValue, enumObject))
        _fail(`Expected ${enumValue} to be enum value or undefined`, msg);
    return true;
}

export function isNumber(value: unknown, msg?: string): value is number {
    if (!Guard.isNumber(value))
        _fail(`Expected ${value} to be number`, msg);
    return true;
}

export function isNumberOrUndefined(value: unknown, msg?: string): value is number | undefined {
    if (!Guard.isNumberOrUndefined(value))
        _fail(`Expected ${value} to be number or undefined`, msg);
    return true;
}

export function isFinite(value: unknown, msg?: string): value is number {
    if (!Guard.isFinite(value))
        _fail(`Expected ${value} to be finite`, msg);
    return true;
}

export function isInteger(value: unknown, msg?: string): value is number {
    if (!Guard.isInteger(value))
        _fail(`Expected ${value} to be integer`, msg);
    return true;
}

export function isIntegerOrUndefined(value: unknown, msg?: string): value is number | undefined {
    if (!Guard.isIntegerOrUndefined(value))
        _fail(`Expected ${value} to be integer or undefined`, msg);
    return true;
}

export function isIntegerEq(value: unknown, compareTo: unknown, msg?: string): value is number {
    if (!Guard.isIntegerEq(value, compareTo))
        _fail(`Expected ${value} to be integer equal to ${compareTo}`, msg);
    return true;
}

export function isIntegerGt(value: unknown, compareTo: unknown, msg?: string): value is number {
    if (!Guard.isIntegerGt(value, compareTo))
        _fail(`Expected ${value} to be integer > ${compareTo}`, msg);
    return true;
}

export function isIntegerGte(value: unknown, compareTo: unknown, msg?: string): value is number {
    if (!Guard.isIntegerGte(value, compareTo))
        _fail(`Expected ${value} to be integer >= ${compareTo}`, msg);
    return true;
}

export function isIntegerLt(value: unknown, compareTo: unknown, msg?: string): value is number {
    if (!Guard.isIntegerLt(value, compareTo))
        _fail(`Expected ${value} to be integer < ${compareTo}`, msg);
    return true;
}

export function isIntegerLte(value: unknown, compareTo: unknown, msg?: string): value is number {
    if (!Guard.isIntegerLte(value, compareTo))
        _fail(`Expected ${value} to be integer <= ${compareTo}`, msg);
    return true;
}

export function isIntegerBetween(value: unknown, min: unknown, max: unknown, msg?: string): value is number {
    if (!Guard.isIntegerBetween(value, min, max))
        _fail(`Expected integer ${min} <= ${value} <= ${max}.`, msg);
    return true;
}

export function isIntegerBetweenExclusive(value: unknown, min: unknown, max: unknown, msg?: string): value is number {
    if (!Guard.isIntegerBetweenExclusive(value, min, max))
        _fail(`Expected integer ${min} < ${value} < ${max}.`, msg);
    return true;
}

export function isNumberBetween(value: unknown, min: unknown, max: unknown, msg?: string): value is number {
    if (!Guard.isNumberBetween(value, min, max))
        _fail(`Expected number ${min} <= ${value} <= ${max}.`, msg);
    return true;
}

export function isNumberBetweenExclusive(value: unknown, min: unknown, max: unknown, msg?: string): value is number {
    if (!Guard.isNumberBetweenExclusive(value, min, max))
        _fail(`Expected number ${min} < ${value} < ${max}.`, msg);
    return true;
}

export function isNaNValue(value: unknown, msg?: string): value is number {
    if (!Guard.isNaNValue(value))
        _fail(`Expected ${value} to be NaN.`, msg);
    return true;
}

export function isInfinity(value: unknown, msg?: string): value is number {
    if (!Guard.isInfinity(value))
        _fail(`Expected ${value} to be +-Infinity.`, msg);
    return true;
}

export function isPosInfinity(value: unknown, msg?: string): value is number {
    if (!Guard.isPosInfinity(value))
        _fail(`Expected ${value} to be +Infinity.`, msg);
    return true;
}

export function isNegInfinity(value: unknown, msg?: string): value is number {
    if (!Guard.isNegInfinity(value))
        _fail(`Expected ${value} to be -Infinity.`, msg);
    return true;
}

export function isOddNumber(value: unknown, msg?: string): value is number {
    if (!Guard.isOddNumber(value))
        _fail(`Expected ${value} to odd number.`, msg);
    return true;
}

export function isEvenNumber(value: unknown, msg?: string): value is number {
    if (!Guard.isEvenNumber(value))
        _fail(`Expected ${value} to even number.`, msg);
    return true;
}

export function isIncluded<T>(value: T, array: ReadonlyArray<T>, msg?: string): value is T {
    if (!Guard.isIncluded(value, array))
        _fail(`Expected ${value} to be included in [${array.map(v => String(v)).join(", ")}].`, msg);
    return true;
}

export function isArrayIndex<T>(index: unknown, array: ReadonlyArray<T>, msg?: string): index is number {
    if (!Guard.isArrayIndex(index, array))
        _fail(`Expected ${index} to be index for array [${array.map(v => String(v)).join(", ")}]`, msg);
    return true;
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
