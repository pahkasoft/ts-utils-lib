import { isFunction, isIntegerGte } from "../utils/is";
import { KVComponent } from "./kv-container";

/**
 * An array-like structure for non-negative indexes.
 */
export class IndexArray<EL> implements KVComponent<[number], EL> {
    private static toNegIndex(id: number): number {
        return -id - 1;
    }

    private static validateIndex(id: number): number {
        if (!isIntegerGte(id, 0)) throw new Error(`Invalid index ${id} - must be an integer >= 0!`);
        return id;
    }

    // for indexes >= 0
    private posEl: EL[];
    private hasPos: boolean[];
    // number of elems
    private elCount: number;

    constructor();
    constructor(arr: IndexArray<EL>)
    constructor(entries: Iterable<[number, EL]>)
    constructor(entries?: IndexArray<EL> | Iterable<[number, EL]>) {
        if (entries instanceof IndexArray) {
            this.posEl = entries.posEl.slice();
            this.hasPos = entries.hasPos.slice();
            this.elCount = entries.elCount;
        }
        else {
            this.posEl = [];
            this.hasPos = [];
            this.elCount = 0;

            if (entries) {
                for (const [id, el] of entries) {
                    this.set(id, el);
                }
            }
        }

        /*
        this.indices = this.indices.bind(this);
        this.values = this.values.bind(this);
        this.entries = this.entries.bind(this);
        this.kvKeys = this.kvKeys.bind(this);
        this.kvValues = this.kvValues.bind(this);
        this.kvEntries = this.kvEntries.bind(this);
        */
    }

    private get posLen(): number {
        return this.hasPos.length;
    }

    get size(): number {
        return this.elCount;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    has(id: number): boolean {
        IndexArray.validateIndex(id);

        return this.hasPos[id] === true;
    }

    set(id: number, el: EL): void {
        IndexArray.validateIndex(id);

        if (this.hasPos[id] !== true) this.elCount++;
        this.posEl[id] = el;
        this.hasPos[id] = true;
    }

    get(id: number): EL | undefined {
        IndexArray.validateIndex(id);

        return this.hasPos[id] ? this.posEl[id] : undefined;
    }

    getOrDefault(id: number, defaultValue: EL): EL {
        return this.get(id) ?? defaultValue;
    }

    getOrCreate(id: number, value: EL): EL;
    getOrCreate(id: number, creator: () => EL): EL;
    getOrCreate(id: number, creatorOrValue: EL | (() => EL)): EL {
        if (!this.has(id)) {
            const value = isFunction(creatorOrValue)
                ? creatorOrValue()
                : creatorOrValue;
            this.set(id, value);
            return value;
        }
        return this.get(id)!;
    }

    delete(id: number): boolean {
        IndexArray.validateIndex(id);

        if (!this.hasPos[id]) return false;
        this.posEl[id] = undefined!;
        this.hasPos[id] = false;
        this.elCount--;
        return true;
    }

    clear(): void {
        this.posEl = [];
        this.hasPos = [];
        this.elCount = 0;
    }

    forEach(callbackfn: (el: EL, id: number, arr: IndexArray<EL>) => void, thisArg?: any): void {
        for (const [id, el] of this.entries()) {
            callbackfn.call(thisArg, el, id, this);
        }
    }

    *indices(): IterableIterator<number> {
        for (let id = 0; id < this.posLen; id++) {
            if (this.hasPos[id]) yield id;
        }
    }

    *values(): IterableIterator<EL> {
        for (let id = 0; id < this.posLen; id++) {
            if (this.hasPos[id]) yield this.posEl[id];
        }
    }

    *entries(): IterableIterator<[number, EL]> {
        for (let id = 0; id < this.posLen; id++) {
            if (this.hasPos[id]) yield [id, this.posEl[id]];
        }
    }

    indicesArray(): number[] {
        return [...this.indices()];
    }

    valuesArray(): EL[] {
        return [...this.values()];
    }

    entriesArray(): [number, EL][] {
        return [...this.entries()];
    }

    *kvKeys(): IterableIterator<[number]> {
        for (const id of this.indices()) {
            yield [id];
        }
    }

    *kvValues(): IterableIterator<EL> {
        for (const el of this.values()) {
            yield el;
        }
    }

    *kvEntries(): IterableIterator<[[number], EL]> {
        for (const [id, el] of this.entries()) {
            yield [[id], el];
        }
    }

    *[Symbol.iterator]() {
        yield* this.entries();
    }

    clone(): IndexArray<EL> {
        return new IndexArray(this);
    }

    merge(other: IndexArray<EL>, conflictResolver?: (oldValue: EL, newValue: EL, id: number) => EL): this {
        for (const [id, value] of other.entries()) {
            if (this.has(id) && conflictResolver) {
                this.set(id, conflictResolver(this.get(id)!, value, id));
            }
            else {
                this.set(id, value);
            }
        }
        return this;
    }

    some(fn: (el: EL, id: number) => boolean): boolean {
        for (const [id, el] of this.entries()) {
            if (fn(el, id)) return true;
        }
        return false;
    }

    every(fn: (value: EL, key1: number) => boolean): boolean {
        for (const [id, el] of this.entries()) {
            if (!fn(el, id)) return false;
        }
        return true;
    }

    filter(fn: (value: EL, key1: number) => boolean): IndexArray<EL> {
        let result = new IndexArray<EL>();
        for (const [id, el] of this.entries()) {
            if (fn(el, id)) result.set(id, el);
        }
        return result;
    }

    reduce(fn: (acc: EL, el: EL, id: number) => EL): EL;
    reduce<R>(fn: (acc: R, el: EL, id: number) => R, init: R): R;
    reduce<R>(fn: (acc: R, el: EL, id: number) => R, init?: R): R {
        let iterator = this.entries();
        let first = iterator.next();

        if (first.done) {
            if (arguments.length < 2) {
                throw new TypeError("Reduce of empty IndexArray with no initial value!");
            }
            return init!;
        }

        let acc: any;
        let start: IteratorResult<[number, EL]>;

        if (arguments.length < 2) {
            // no init → use first entry as accumulator
            acc = first.value[1];
            start = iterator.next();
        } else {
            acc = init;
            start = first;
        }

        for (let current = start; !current.done; current = iterator.next()) {
            const [id, el] = current.value;
            acc = fn(acc, el, id);
        }

        return acc;
    }

    mapToArray<R>(fn: (value: EL, key1: number) => R): R[] {
        let result: R[] = [];
        for (const [id, el] of this.entries()) {
            result.push(fn(el, id));
        }
        return result;
    }

    map<R = EL>(fn: (value: EL, key1: number) => R): IndexArray<R> {
        let result = new IndexArray<R>();
        for (const [id, el] of this.entries()) {
            result.set(id, fn(el, id));
        }
        return result;
    }

    equals(other: IndexArray<EL>): boolean;
    equals(other: IndexArray<EL>, eq: (a: EL, b: EL) => boolean): boolean;
    equals(other: IndexArray<EL>, eq?: (a: EL, b: EL) => boolean): boolean {
        if (this.size !== other.size) return false;

        eq ??= (a, b) => a === b;

        const posLen = Math.max(this.posLen, other.posLen);
        for (let i = 0; i < posLen; ++i) {
            const hasA = this.hasPos[i];
            const hasB = other.hasPos[i];
            if (hasA !== hasB) return false;
            if (hasA && !eq(this.posEl[i], other.posEl[i])) return false;
        }

        return true;
    }

    toString(): string {
        if (this.size === 0) return `IndexArray[ ]`;
        const entries = this.entriesArray().map(([id, el]) => `${id}: ${el}`).join(', ');
        return `IndexArray[ ${entries} ]`;
    }
}
