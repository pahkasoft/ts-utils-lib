import { isInteger, isArray } from "../../guard";

export { isArray }

export function toArray<T>(a: T | T[]): Array<T> {
    return isArray(a) ? a : [a];
}

export function duplicate<T>(a: T[] | undefined) {
    return a === undefined ? a : a.slice();
}

export function removeDuplicates<T>(arr: T[], compareFn?: (a: T, b: T) => boolean): T[] {
    return compareFn !== undefined
        ? arr.filter((a, id, self) => id === self.findIndex(b => compareFn(a, b)))
        : arr.filter((a, id, self) => id === self.indexOf(a));
}

/**
 * @deprecated - Use {@link removeDuplicates} with compareFn instead.  Will be removed in v2.0.0.
 * @private
 */
export function removeDuplicatesCmp<T>(arr: ReadonlyArray<T>, compareFn: (t1: T, t2: T) => boolean): T[] {
    return arr.filter((a, id, self) => id === self.findIndex(b => compareFn(a, b)));
}

export function fillArray<T>(fillValue: T, fillCount: number): T[] {
    if (!isInteger(fillCount) || fillCount < 0) {
        throw new Error("fillArray: Invalid fillCount = " + fillCount);
    }
    return new Array<T>(fillCount).fill(fillValue);
}

export function mapSequenceArray<T>(len: number, fn: (i: number) => T): T[] {
    if (!isInteger(len) || len < 0) {
        throw new Error("mapSequenceArray: Invalid len = " + len);
    }
    let arr: T[] = new Array(len);
    for (let i = 0; i < len; i++) { arr[i] = fn(i); }
    return arr;
}

export function getSequenceArray(len: number): number[] {
    return mapSequenceArray(len, i => i);
}

export function mapRangeArray<T>(start: number, end: number, fn: (i: number) => T): T[] {
    if (!isInteger(start)) {
        throw new Error("mapRangeArray: Invalid start = " + end);
    }
    if (!isInteger(end)) {
        throw new Error("mapRangeArray: Invalid end = " + end);
    }
    let len = Math.abs(end - start) + 1;
    let arr: T[] = new Array(len);
    for (let i = 0, s = start, inc = Math.sign(end - start); i < len; s += inc, i++) { arr[i] = fn(s); }
    return arr;
}

export function getRangeArray(start: number, end: number): number[] {
    return mapRangeArray(start, end, i => i);
}

export function arrayContains<T extends unknown>(arg: T[], item: T): boolean {
    return arg.indexOf(item) >= 0;
}

export function chunckArray<A>(arr: ReadonlyArray<A>, chunckSize: number): A[][] {
    if (!isInteger(chunckSize) || chunckSize < 1) {
        throw new Error("chunckArray: Invalid chunckSize = " + chunckSize);
    }
    let result: A[][] = [];
    for (let i = 0; i < arr.length; i += chunckSize) {
        result.push(arr.slice(i, i + chunckSize));
    }
    return result;
}
