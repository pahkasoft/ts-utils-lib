import * as Is from "../utils/is";
import { EnumObject } from "../utils/enum";

export namespace Assert {
    export type ErrorConstructor = new (msg: string) => Error;

    let errorConstructor: ErrorConstructor = Error;

    export function setErrorClass(errorClass?: ErrorConstructor) {
        errorConstructor = errorClass ?? Error;
    }

    function _fail(...msgs: (string | undefined)[]): never {
        let msg = msgs.join(", ");
        throw new errorConstructor("Assertion Failed!" + msgs === "" ? "" : (" " + msg));
    }

    //--------------------------------------------------------------------------------------------------------
    // Deprecated

    /** @deprecated */
    export function interrupt(msg?: string): never {
        _fail("Interrupted!");
    }

    /** @deprecated */
    export function assertEnum<E extends EnumObject>(enumVal: unknown, enumObj: E, name = "value"): asserts enumVal is E[keyof E] {
        if (!Is.isEnumValue(enumVal, enumObj))
            _fail(`Invalid enum value ${enumVal}.`);
    }

    /** @deprecated */
    export function int(value: unknown, msg?: string): number {
        if (!Is.isInteger(value))
            _fail(`Expected ${value} to be integer.`, msg);
        return value;
    }

    /** @deprecated */
    export function eq<T>(value1: T, value2: T, msg?: string): T {
        if (value1 !== value2)
            _fail(`Expected ${value1} to equal ${value2}.`, msg);
        return value1;
    }

    /** @deprecated */
    export function int_eq(value: unknown, compareTo: unknown, msg?: string): number {
        if (!Is.isIntegerEq(value, compareTo))
            _fail(`Expected ${value} to be integer equal to ${compareTo}.`, msg);
        return value;
    }

    /** @deprecated */
    export function int_lt(value: unknown, compareTo: unknown, msg?: string): number {
        if (!Is.isIntegerLt(value, compareTo))
            _fail(`Expected ${value} to be integer less than ${compareTo}.`, msg);
        return value;
    }

    /** @deprecated */
    export function int_lte(value: unknown, compareTo: unknown, msg?: string): number {
        if (!Is.isIntegerLte(value, compareTo))
            _fail(`Expected ${value} to be integer less than or equal to ${compareTo}.`, msg);
        return value;
    }

    /** @deprecated */
    export function int_gt(value: unknown, compareTo: unknown, msg?: string): number {
        if (!Is.isIntegerGt(value, compareTo))
            _fail(`Expected ${value} to be integer greater than ${compareTo}.`, msg);
        return value;
    }

    /** @deprecated */
    export function int_gte(value: unknown, compareTo: unknown, msg?: string): number {
        if (!Is.isIntegerGte(value, compareTo))
            _fail(`Expected ${value} to be integer greater than or equal to ${compareTo}.`, msg);
        return value;
    }

    /** @deprecated */
    export function int_between(value: unknown, min: unknown, max: unknown, msg?: string): number {
        if (!Is.isIntegerBetween(value, min, max))
            _fail(`Expected integer between ${min} <= ${value} <= ${max}.`, msg);
        return value;
    }

    /** @deprecated */
    export function int_between_exclusive(value: unknown, min: unknown, max: unknown, msg?: string): number {
        if (!Is.isIntegerBetweenExclusive(value, min, max))
            _fail(`Expected integer between ${min} < ${value} < ${max}.`, msg);
        return value;
    }

    /** @deprecated */
    export function odd(value: unknown, msg?: string): number {
        if (!Is.isOddNumber(value))
            _fail(`Expected ${value} to be odd number.`, msg);
        return value;
    }

    /** @deprecated */
    export function even(value: unknown, msg?: string): number {
        if (!Is.isEvenNumber(value))
            _fail(`Expected ${value} to be even number.`, msg);
        return value;
    }

    /** @deprecated */
    export function in_group<T>(value: T, group: ReadonlyArray<T>, msg?: string): T {
        if (!(group.some(e => e === value)))
            _fail(`Expected ${value} to be in group [${group.map(v => String(v)).join(", ")}].`, msg);
        return value;
    }

    /** @deprecated */
    export function finite(value: unknown, msg?: string): number {
        if (!Is.isFinite(value))
            _fail(`Expected ${value} to be finite number.`, msg);
        return value;
    }

    /** @deprecated */
    export function array_id<T>(array: Readonly<T[]>, index: unknown, msg?: string): number {
        if (!Is.isInteger(index) || !Is.isArray(array) || index < 0 || index >= array.length)
            _fail(`Expected ${index} to be array index in bounds [0..${array.length - 1}].`, msg);
        return index;
    }

    /** @deprecated */
    export function array_elem<T>(array: Readonly<T[]>, index: number, msg?: string): T {
        return array[array_id(array, index, msg)];
    }

    //--------------------------------------------------------------------------------------------------------
    // New functions

    export function assert<T>(condition: T, msg?: string) {
        if (!condition) {
            _fail();
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
        if (!Is.isEqual(value1, value2))
            _fail(`Expected ${value1} to equal with ${value2}`, msg);
        return true;
    }

    export function isDeepEqual(value1: unknown, value2: unknown, msg?: string) {
        if (!Is.isDeepEqual(value1, value2))
            _fail(`Expected ${value1} to deep equal with ${value2}`, msg);
        return true;
    }

    export function isUndefined(value: unknown, msg?: string): value is undefined {
        if (!Is.isUndefined(value))
            _fail(`Expected ${value} to be undefined`, msg);
        return true;
    }

    export function isNull(value: unknown, msg?: string): value is null {
        if (!Is.isNull(value))
            _fail(`Expected ${value} to be null`, msg);
        return true;
    }

    export function isNullish(value: unknown, msg?: string): value is null | undefined {
        if (!Is.isNullish(value))
            _fail(`Expected ${value} to be null or undefined`, msg);
        return true;
    }

    export function isObject(value: unknown, msg?: string): value is Record<string, unknown> {
        if (!Is.isObject(value))
            _fail(`Expected ${value} to be object`, msg);
        return true;
    }

    export function isObjectOrUndefined(value: unknown, msg?: string): value is Record<string, unknown> | undefined {
        if (!Is.isObjectOrUndefined(value))
            _fail(`Expected ${value} to be object or undefined`, msg);
        return true;
    }

    export function isTypedObject<T extends object>(obj: unknown, keys: (keyof T)[], msg?: string): obj is Is.HasProps<T> {
        if (!Is.isTypedObject(obj, keys))
            _fail(`Expected ${obj} to be object with keys [${keys.map(key => `'${String(key)}'`).join(", ")}]`, msg);
        return true;
    }

    export function isArray<T>(value: T[] | unknown, msg?: string): value is T[] {
        if (!Is.isArray(value))
            _fail(`Expected ${value} to be array`, msg);
        return true;
    }

    export function isArrayOrUndefined(value: unknown, msg?: string): value is unknown[] | undefined {
        if (!Is.isArrayOrUndefined(value))
            _fail(`Expected ${value} to be array or undefined`, msg);
        return true;
    }

    export function isEmptyArray<T>(value: T[] | unknown, msg?: string): value is T[] {
        if (!Is.isEmptyArray(value))
            _fail(`Expected ${value} to be empty array`, msg);
        return true;
    }

    export function isNonEmptyArray<T>(value: T[] | unknown, msg?: string): value is T[] {
        if (!Is.isNonEmptyArray(value))
            _fail(`Expected ${value} to be non-empty array`, msg);
        return true;
    }

    export function isEmptyArrayOrUndefined<T>(value: T[] | unknown, msg?: string): value is T[] | undefined {
        if (!Is.isEmptyArrayOrUndefined(value))
            _fail(`Expected ${value} to be empty array or undefined`, msg);
        return true;
    }

    export function isNonEmptyArrayOrUndefined<T>(value: T[] | unknown, msg?: string): value is T[] | undefined {
        if (!Is.isNonEmptyArrayOrUndefined(value))
            _fail(`Expected ${value} to be non-empty array or undefined`, msg);
        return true;
    }

    export function isString(value: unknown, msg?: string): value is string {
        if (!Is.isString(value))
            _fail(`Expected ${value} to be string`, msg);
        return true;
    }

    export function isEmptyString(value: unknown, msg?: string): value is "" {
        if (!Is.isEmptyString(value))
            _fail(`Expected ${value} to be empty string`, msg);
        return true;
    }

    export function isNonEmptyString(value: unknown, msg?: string): value is string {
        if (!Is.isNonEmptyString(value))
            _fail(`Expected ${value} to be non-empty string`, msg);
        return true;
    }

    export function isStringOrUndefined(value: unknown, msg?: string): value is string | undefined {
        if (!Is.isStringOrUndefined(value))
            _fail(`Expected ${value} to be string or undefined`, msg);
        return true;
    }

    export function isEmptyStringOrUndefined(value: unknown, msg?: string): value is "" | undefined {
        if (!Is.isEmptyStringOrUndefined(value))
            _fail(`Expected ${value} to be empty string or undefined`, msg);
        return true;
    }

    export function isNonEmptyStringOrUndefined(value: unknown, msg?: string): value is string | undefined {
        if (!Is.isNonEmptyStringOrUndefined(value))
            _fail(`Expected ${value} to be non-empty string or undefined`, msg);
        return true;
    }

    export function isBoolean(value: unknown, msg?: string): value is boolean {
        if (!Is.isBoolean(value))
            _fail(`Expected ${value} to be boolean`, msg);
        return true;
    }

    export function isBooleanOrUndefined(value: unknown, msg?: string): value is boolean | undefined {
        if (!Is.isBooleanOrUndefined(value))
            _fail(`Expected ${value} to be boolean or undefined`, msg);
        return true;
    }

    export function isTrue(value: unknown, msg?: string): value is boolean {
        if (!Is.isTrue(value))
            _fail(`Expected ${value} to be true`, msg);
        return true;
    }

    export function isTrueOrUndefined(value: unknown, msg?: string): value is boolean {
        if (!Is.isTrueOrUndefined(value))
            _fail(`Expected ${value} to be true or undefined`, msg);
        return true;
    }

    export function isFalse(value: unknown, msg?: string): value is boolean {
        if (!Is.isFalse(value))
            _fail(`Expected ${value} to be false`, msg);
        return true;
    }

    export function isFalseOrUndefined(value: unknown, msg?: string): value is boolean {
        if (!Is.isFalseOrUndefined(value))
            _fail(`Expected ${value} to be false or undefined`, msg);
        return true;
    }

    export function isFunction(value: unknown, msg?: string): value is Function {
        if (!Is.isFunction(value))
            _fail(`Expected ${value} to be function`, msg);
        return true;
    }

    export function isFunctionOrUndefined(value: unknown, msg?: string): value is Function | undefined {
        if (!Is.isFunctionOrUndefined(value))
            _fail(`Expected ${value} to be function or undefined`, msg);
        return true;
    }

    export function isEnumValue<E extends EnumObject>(enumValue: unknown, enumObject: E, msg?: string): enumValue is E[keyof E] {
        if (!Is.isEnumValue(enumValue, enumObject))
            _fail(`Expected ${enumValue} to be enum value`, msg);
        return true;
    }

    export function isEnumValueOrUndefined<E extends EnumObject>(enumValue: unknown, enumObject: E, msg?: string): enumValue is E[keyof E] {
        if (!Is.isEnumValueOrUndefined(enumValue, enumObject))
            _fail(`Expected ${enumValue} to be enum value or undefined`, msg);
        return true;
    }

    export function isNumber(value: unknown, msg?: string): value is number {
        if (!Is.isNumber(value))
            _fail(`Expected ${value} to be number`, msg);
        return true;
    }

    export function isNumberOrUndefined(value: unknown, msg?: string): value is number | undefined {
        if (!Is.isNumberOrUndefined(value))
            _fail(`Expected ${value} to be number or undefined`, msg);
        return true;
    }

    export function isFinite(value: unknown, msg?: string): value is number {
        if (!Is.isFinite(value))
            _fail(`Expected ${value} to be finite`, msg);
        return true;
    }

    export function isInteger(value: unknown, msg?: string): value is number {
        if (!Is.isInteger(value))
            _fail(`Expected ${value} to be integer`, msg);
        return true;
    }

    export function isIntegerOrUndefined(value: unknown, msg?: string): value is number | undefined {
        if (!Is.isIntegerOrUndefined(value))
            _fail(`Expected ${value} to be integer or undefined`, msg);
        return true;
    }

    export function isIntegerEq(value: unknown, compareTo: unknown, msg?: string): value is number {
        if (!Is.isIntegerEq(value, compareTo))
            _fail(`Expected ${value} to be integer equal to ${compareTo}`, msg);
        return true;
    }

    export function isIntegerGt(value: unknown, compareTo: unknown, msg?: string): value is number {
        if (!Is.isIntegerGt(value, compareTo))
            _fail(`Expected ${value} to be integer > ${compareTo}`, msg);
        return true;
    }

    export function isIntegerGte(value: unknown, compareTo: unknown, msg?: string): value is number {
        if (!Is.isIntegerGte(value, compareTo))
            _fail(`Expected ${value} to be integer >= ${compareTo}`, msg);
        return true;
    }

    export function isIntegerLt(value: unknown, compareTo: unknown, msg?: string): value is number {
        if (!Is.isIntegerLt(value, compareTo))
            _fail(`Expected ${value} to be integer < ${compareTo}`, msg);
        return true;
    }

    export function isIntegerLte(value: unknown, compareTo: unknown, msg?: string): value is number {
        if (!Is.isIntegerLte(value, compareTo))
            _fail(`Expected ${value} to be integer <= ${compareTo}`, msg);
        return true;
    }

    export function isIntegerBetween(value: unknown, min: unknown, max: unknown, msg?: string): value is number {
        if (!Is.isIntegerBetween(value, min, max))
            _fail(`Expected integer ${min} <= ${value} <= ${max}.`, msg);
        return true;
    }

    export function isIntegerBetweenExclusive(value: unknown, min: unknown, max: unknown, msg?: string): value is number {
        if (!Is.isIntegerBetweenExclusive(value, min, max))
            _fail(`Expected integer ${min} < ${value} < ${max}.`, msg);
        return true;
    }

    export function isNumberBetween(value: unknown, min: unknown, max: unknown, msg?: string): value is number {
        if (!Is.isNumberBetween(value, min, max))
            _fail(`Expected number ${min} <= ${value} <= ${max}.`, msg);
        return true;
    }

    export function isNumberBetweenExclusive(value: unknown, min: unknown, max: unknown, msg?: string): value is number {
        if (!Is.isNumberBetweenExclusive(value, min, max))
            _fail(`Expected number ${min} < ${value} < ${max}.`, msg);
        return true;
    }

    export function isNaNValue(value: unknown, msg?: string): value is number {
        if (!Is.isNaNValue(value))
            _fail(`Expected ${value} to be NaN.`, msg);
        return true;
    }

    export function isInfinity(value: unknown, msg?: string): value is number {
        if (!Is.isInfinity(value))
            _fail(`Expected ${value} to be +-Infinity.`, msg);
        return true;
    }

    export function isPosInfinity(value: unknown, msg?: string): value is number {
        if (!Is.isPosInfinity(value))
            _fail(`Expected ${value} to be +Infinity.`, msg);
        return true;
    }

    export function isNegInfinity(value: unknown, msg?: string): value is number {
        if (!Is.isNegInfinity(value))
            _fail(`Expected ${value} to be -Infinity.`, msg);
        return true;
    }

    export function isOddNumber(value: unknown, msg?: string): value is number {
        if (!Is.isOddNumber(value))
            _fail(`Expected ${value} to odd number.`, msg);
        return true;
    }

    export function isEvenNumber(value: unknown, msg?: string): value is number {
        if (!Is.isEvenNumber(value))
            _fail(`Expected ${value} to even number.`, msg);
        return true;
    }

    export function isIncluded<T>(value: T, array: ReadonlyArray<T>, msg?: string): value is T {
        if (!Is.isIncluded(value, array))
            _fail(`Expected ${value} to be included in [${array.map(v => String(v)).join(", ")}].`, msg);
        return true;
    }

    export function isArrayIndex<T>(index: unknown, array: ReadonlyArray<T>, msg?: string): index is number {
        if (!Is.isArrayIndex(index, array))
            _fail(`Expected ${index} to be index for array [${array.map(v => String(v)).join(", ")}]`, msg);
        return true;
    }

    export function isThrowing(throwTestFn: () => void, msg?: string): true {
        if (!Is.isThrowing(throwTestFn))
            _fail(`Expected to throw`, msg);
        return true;
    }
}
