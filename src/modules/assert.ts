import * as Is from "../utils/is";
import { getEnumValues } from "../utils/enum";

export namespace Assert {

    export type ErrorConstructor = new (msg: string) => Error;

    let errorConstructor: ErrorConstructor = Error;

    export function setErrorClass(ec?: ErrorConstructor) {
        errorConstructor = ec ?? Error;
    }

    function throwError(errorMsg: string, userMsg?: string): never {
        throw new errorConstructor("Assertion Error: " + errorMsg + (userMsg ? " " + userMsg : ""));
    }

    export function assert<T>(a: T, userMsg?: string) {
        if (!a) {
            throwError(userMsg ?? "Assertion failed!");
        }
    }

    export function assertEnum<E extends Record<string, string | number>>(value: unknown, enumObj: E, name = "value"): asserts value is E[keyof E] {
        if (!getEnumValues(enumObj).some(v => v === value)) {
            throw new TypeError(`Invalid ${name} enum value: ${value}`);
        }
    }

    export function interrupt(userMsg?: string): never {
        throwError(userMsg ?? "Interrupted!");
    }

    export function int(a: unknown, userMsg?: string): number {
        if (!Is.isInteger(a)) {
            throwError(`Expected ${a} to be integer.`, userMsg);
        }
        return a;
    }

    export function eq<T>(a: T, b: T, userMsg?: string): T {
        if (a !== b) {
            throwError(`Expected ${a} to equal ${b}.`, userMsg);
        }
        return a;
    }

    export function int_eq(a: unknown, b: unknown, userMsg?: string): number {
        if (!(Is.isNumber(b) && Is.isIntegerEq(a, b))) {
            throwError(`Expected ${a} to be integer equal to ${b}.`, userMsg);
        }
        return a;
    }

    export function int_lt(a: unknown, b: unknown, userMsg?: string): number {
        if (!(Is.isNumber(b) && Is.isIntegerLt(a, b))) {
            throwError(`Expected ${a} to be integer less than ${b}.`, userMsg);
        }
        return a;
    }

    export function int_lte(a: unknown, b: unknown, userMsg?: string): number {
        if (!(Is.isNumber(b) && Is.isIntegerLte(a, b))) {
            throwError(`Expected ${a} to be integer less than or equal to ${b}.`, userMsg);
        }
        return a;
    }

    export function int_gt(a: unknown, b: unknown, userMsg?: string): number {
        if (!(Is.isNumber(b) && Is.isIntegerGt(a, b))) {
            throwError(`Expected ${a} to be integer greater than ${b}.`, userMsg);
        }
        return a;
    }

    export function int_gte(a: unknown, b: unknown, userMsg?: string): number {
        if (!(Is.isNumber(b) && Is.isIntegerGte(a, b))) {
            throwError(`Expected ${a} to be integer greater than or equal to ${b}.`, userMsg);
        }
        return a;
    }

    export function int_between(a: unknown, min: unknown, max: unknown, userMsg?: string): number {
        if (!(Is.isNumber(min) && Is.isNumber(max) && Is.isIntegerBetween(a, min, max))) {
            throwError(`Expected ${a} to be integer between ${min} and ${max}.`, userMsg);
        }
        return a;
    }

    export function odd(a: unknown, userMsg?: string): number {
        if (!Is.isOddNumber(a)) {
            throwError(`Expected ${a} to be odd number.`, userMsg);
        }
        return a;
    }

    export function even(a: unknown, userMsg?: string): number {
        if (!Is.isEvenNumber(a)) {
            throwError(`Expected ${a} to be even number.`, userMsg);
        }
        return a;
    }

    export function in_group<T>(a: T, group: ReadonlyArray<T>, userMsg?: string): T {
        if (!(group.some(e => e === a))) {
            let strGroup = group.map(v => String(v)).join(", ");
            throwError(`Expected ${a} to be in group [${strGroup}].`, userMsg);
        }
        return a;
    }

    export function finite(a: unknown, userMsg?: string): number {
        if (!Is.isFinite(a)) {
            throwError(`Expected ${a} to be finite number.`, userMsg);
        }
        return a;
    }

    export function array_id<T>(arr: Readonly<T[]>, id: unknown, userMsg?: string): number {
        if (!(Is.isInteger(id) && Is.isArray(arr) && id >= 0 && id < arr.length)) {
            throwError(`Expected ${id} to be array index in bounds [0..${arr.length - 1}].`, userMsg);
        }
        return id;
    }

    export function array_elem<T>(arr: Readonly<T[]>, id: number, userMsg?: string): T {
        return arr[array_id(arr, id, userMsg)];
    }

    export function require<T>(arg: T, userMsg?: string): NonNullable<T> {
        if (arg === undefined) {
            throwError("Required value is undefined.", userMsg);
        }
        else {
            return arg!;
        }
    }
}
