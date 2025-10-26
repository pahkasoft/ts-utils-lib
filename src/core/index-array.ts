import { isFunction, isIntegerGte } from "../guard";
import { formatValue } from "./format-value";
import { KVComponent } from "./kv-container";

/**
 * An array-like structure for non-negative indexes.
 */
export class IndexArray<VALUE> implements KVComponent<[number], VALUE> {
    private static validateIndex(id: number): number {
        if (!isIntegerGte(id, 0)) throw new Error(`Invalid index ${id} - must be an integer >= 0!`);
        return id;
    }

    private posVal: VALUE[];
    private hasPos: boolean[];

    // Number of values
    private valCount: number;

    constructor();
    constructor(arr: IndexArray<VALUE>)
    constructor(entries: Iterable<[number, VALUE]>)
    constructor(entries?: IndexArray<VALUE> | Iterable<[number, VALUE]>) {
        if (entries instanceof IndexArray) {
            this.posVal = entries.posVal.slice();
            this.hasPos = entries.hasPos.slice();
            this.valCount = entries.valCount;
        }
        else {
            this.posVal = [];
            this.hasPos = [];
            this.valCount = 0;

            if (entries) {
                for (const [id, value] of entries) {
                    this.set(id, value);
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
        return this.valCount;
    }

    get length(): number {
        return this.hasPos.length;
    }

    private trimRight() {
        let newLength = this.length;
        while (newLength > 0 && this.hasPos[newLength - 1] !== true) newLength--;
        if (newLength < this.length) this.posVal.length = this.hasPos.length = newLength;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    has(id: number): boolean {
        IndexArray.validateIndex(id);

        return this.hasPos[id] === true;
    }

    set(id: number, value: VALUE): void {
        IndexArray.validateIndex(id);

        if (this.hasPos[id] !== true) this.valCount++;
        this.posVal[id] = value;
        this.hasPos[id] = true;
    }

    get(id: number): VALUE | undefined {
        IndexArray.validateIndex(id);

        return this.hasPos[id] ? this.posVal[id] : undefined;
    }

    getOrDefault(id: number, defaultValue: VALUE): VALUE {
        return this.get(id) ?? defaultValue;
    }

    getOrCreate(id: number, value: VALUE): VALUE;
    getOrCreate(id: number, creator: () => VALUE): VALUE;
    getOrCreate(id: number, creatorOrValue: VALUE | (() => VALUE)): VALUE {
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
        this.posVal[id] = undefined!;
        this.hasPos[id] = false;
        this.valCount--;
        this.trimRight();
        return true;
    }

    clear(): void {
        this.posVal = [];
        this.hasPos = [];
        this.valCount = 0;
    }

    forEach(callbackfn: (value: VALUE, id: number, arr: IndexArray<VALUE>) => void, thisArg?: any): void {
        for (const [id, value] of this.entries()) {
            callbackfn.call(thisArg, value, id, this);
        }
    }

    *indices(): IterableIterator<number> {
        for (let id = 0; id < this.posLen; id++) {
            if (this.hasPos[id]) yield id;
        }
    }

    *values(): IterableIterator<VALUE> {
        for (let id = 0; id < this.posLen; id++) {
            if (this.hasPos[id]) yield this.posVal[id];
        }
    }

    *entries(): IterableIterator<[number, VALUE]> {
        for (let id = 0; id < this.posLen; id++) {
            if (this.hasPos[id]) yield [id, this.posVal[id]];
        }
    }

    indicesArray(): number[] {
        return [...this.indices()];
    }

    valuesArray(): VALUE[] {
        return [...this.values()];
    }

    entriesArray(): [number, VALUE][] {
        return [...this.entries()];
    }

    *kvKeys(): IterableIterator<[number]> {
        for (const id of this.indices()) {
            yield [id];
        }
    }

    *kvValues(): IterableIterator<VALUE> {
        for (const value of this.values()) {
            yield value;
        }
    }

    *kvEntries(): IterableIterator<[[number], VALUE]> {
        for (const [id, value] of this.entries()) {
            yield [[id], value];
        }
    }

    *[Symbol.iterator](): IterableIterator<[number, VALUE]> {
        yield* this.entries();
    }

    clone(): IndexArray<VALUE> {
        return new IndexArray(this);
    }

    merge(other: IndexArray<VALUE>, conflictResolver?: (oldValue: VALUE, newValue: VALUE, id: number) => VALUE): this {
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

    some(fn: (value: VALUE, id: number) => boolean): boolean {
        for (const [id, value] of this.entries()) {
            if (fn(value, id)) return true;
        }
        return false;
    }

    every(fn: (value: VALUE, key1: number) => boolean): boolean {
        for (const [id, value] of this.entries()) {
            if (!fn(value, id)) return false;
        }
        return true;
    }

    filter<S extends VALUE>(predicate: (value: VALUE, index: number, array: IndexArray<VALUE>) => value is S): IndexArray<S>;
    filter(predicate: (value: VALUE, index: number, array: IndexArray<VALUE>) => unknown): IndexArray<VALUE>;
    filter(predicate: (value: VALUE, index: number, array: IndexArray<VALUE>) => unknown) {
        // Preserve subclass type using the constructor
        const result = new (this.constructor as { new(): IndexArray<VALUE> })();
        for (const [id, value] of this.entries()) {
            if (predicate(value, id, this)) result.set(id, value);
        }
        return result;
    }

    reduce(fn: (acc: VALUE, value: VALUE, id: number) => VALUE): VALUE;
    reduce<R>(fn: (acc: R, value: VALUE, id: number) => R, init: R): R;
    reduce<R>(fn: (acc: R, value: VALUE, id: number) => R, init?: R): R {
        let iterator = this.entries();
        let first = iterator.next();

        if (first.done) {
            if (arguments.length < 2) {
                throw new TypeError("Reduce of empty IndexArray with no initial value!");
            }
            return init!;
        }

        let acc: any;
        let start: IteratorResult<[number, VALUE]>;

        if (arguments.length < 2) {
            // no init → use first entry as accumulator
            acc = first.value[1];
            start = iterator.next();
        } else {
            acc = init;
            start = first;
        }

        for (let current = start; !current.done; current = iterator.next()) {
            const [id, value] = current.value;
            acc = fn(acc, value, id);
        }

        return acc;
    }

    mapToArray<R>(fn: (value: VALUE, key1: number) => R): R[] {
        let result: R[] = [];
        for (const [id, value] of this.entries()) {
            result.push(fn(value, id));
        }
        return result;
    }

    map<R = VALUE>(fn: (value: VALUE, key1: number) => R): IndexArray<R> {
        let result = new IndexArray<R>();
        for (const [id, value] of this.entries()) {
            result.set(id, fn(value, id));
        }
        return result;
    }

    equals(other: IndexArray<VALUE>): boolean;
    equals(other: IndexArray<VALUE>, eq: (a: VALUE, b: VALUE) => boolean): boolean;
    equals(other: IndexArray<VALUE>, eq?: (a: VALUE, b: VALUE) => boolean): boolean {
        if (this.size !== other.size) return false;

        eq ??= (a, b) => a === b;

        const posLen = Math.max(this.posLen, other.posLen);
        for (let i = 0; i < posLen; ++i) {
            const hasA = this.hasPos[i];
            const hasB = other.hasPos[i];
            if (hasA !== hasB) return false;
            if (hasA && !eq(this.posVal[i], other.posVal[i])) return false;
        }

        return true;
    }

    toArray(): VALUE[] {
        return this.valuesArray();
    }

    toString(): string {
        const formatEntries = () => this.entriesArray().map(([id, v]) => `${id}: ${formatValue(v)}`).join(', ');
        return this.size === 0
            ? `IndexArray[ ]`
            : `IndexArray[ ${formatEntries()} ]`;
    }
}
