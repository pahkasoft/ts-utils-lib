import { stringify } from "../utils/str";
import { isFunction } from "../guard";
import { BaseContainer, KVComponent } from "./base";

/**
 * `DefaultArray` is an array list where every index is guaranteed to have a value.
 * There are no undefineds unless that is part of the value type.
 * When you create `DefaultArray` you give a default value. For example if you
 * delete an index then that index is set to the default value.
 */
export class DefaultArray<VALUE> extends BaseContainer implements KVComponent<[number], VALUE> {
    private data: VALUE[];

    constructor(values: Iterable<VALUE>, defaultValue: VALUE);
    constructor(length: number, defaultValue: VALUE);
    constructor(lengthOrValues: number | Iterable<VALUE>, readonly defaultValue: VALUE) {
        super();

        if (typeof lengthOrValues === "number") {
            this.data = Array(lengthOrValues).fill(defaultValue);
        }
        else {
            this.data = Array.from(lengthOrValues).map(v =>
                v === undefined ? defaultValue : v
            );
        }
    }

    get size(): number {
        return this.data.length;
    }

    get length(): number {
        return this.data.length;
    }

    private assertId(id: number): number {
        if (id < 0 || id >= this.data.length)
            throw new RangeError(`DefaultArray: Index ${id} out of range`);
        return id;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    isDefault(id: number): boolean {
        return this.data[this.assertId(id)] === this.defaultValue;
    }

    isSet(id: number): boolean {
        return this.data[this.assertId(id)] !== this.defaultValue;
    }

    /** @internal - This method exists only for interface `KVComponent` compatibility.*/
    has(id: number): boolean {
        return this.isSet(id);
    }

    set(id: number, value: VALUE): VALUE {
        return this.data[this.assertId(id)] = value;
    }

    get(id: number): VALUE {
        return this.data[this.assertId(id)];
    }

    getOrDefault(id: number, defaultValue: VALUE): VALUE {
        let value = this.get(id);
        return value === this.defaultValue ? defaultValue : value;
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
        return this.get(id);
    }

    delete(id: number): boolean {
        this.assertId(id);
        if (this.data[id] === this.defaultValue) return false;
        this.data[id] = this.defaultValue;
        return true;
    }

    clear(empty = false): void {
        if (empty)
            this.data = [];
        else
            this.data.fill(this.defaultValue);
    }

    forEach(callbackfn: (value: VALUE, id: number, arr: DefaultArray<VALUE>) => void, thisArg?: any): void {
        for (const [id, value] of this.entries()) {
            callbackfn.call(thisArg, value, id, this);
        }
    }

    *indices(): IterableIterator<number> {
        yield* this.data.keys();
    }

    *values(): IterableIterator<VALUE> {
        yield* this.data.values();
    }

    *entries(): IterableIterator<[number, VALUE]> {
        yield* this.data.entries();
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

    clone(): this {
        const ctor = this.constructor as new (len: number, def: VALUE) => this;
        const clone = new ctor(this.length, this.defaultValue);
        clone.data = this.data.slice();
        return clone;
    }

    merge(other: DefaultArray<VALUE>, conflictResolver?: (oldValue: VALUE, newValue: VALUE, id: number) => VALUE): this {
        if (this.constructor !== other.constructor)
            throw new Error(`Cannot merge DefaultArray: different classes (${this.constructor.name} vs ${other.constructor.name})`);

        if (this.defaultValue !== other.defaultValue)
            throw new Error(`Cannot merge DefaultArray: different defaultValue (${this.defaultValue} vs ${other.defaultValue})`);

        for (const [id, value] of other.entries()) {
            if (this.isDefault(id))
                this.set(id, value);
            else if (conflictResolver)
                this.set(id, conflictResolver(this.get(id), value, id));
            else
                this.set(id, value);
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

    filter<S extends VALUE>(predicate: (value: VALUE, id: number, array: DefaultArray<VALUE>) => value is S): DefaultArray<S>;
    filter(predicate: (value: VALUE, id: number, array: DefaultArray<VALUE>) => unknown): DefaultArray<VALUE>;
    filter(predicate: (value: VALUE, id: number, array: DefaultArray<VALUE>) => unknown) {
        // Preserve subclass type using the constructor
        const result = new (this.constructor as { new(length: number, def: VALUE): DefaultArray<VALUE> })(this.length, this.defaultValue);
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
                throw new TypeError("Reduce of empty DefaultArray with no initial value!");
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

    map<R = VALUE>(fn: (value: VALUE, key1: number) => R, defaultValue: R): DefaultArray<R> {
        let result = new DefaultArray<R>(this.data.length, defaultValue);
        for (let id = 0; id < this.data.length; id++) {
            result.data[id] = fn(this.data[id], id);
        }
        return result;
    }

    equals(other: DefaultArray<VALUE>): boolean;
    equals(other: DefaultArray<VALUE>, eq: (a: VALUE, b: VALUE) => boolean): boolean;
    equals(other: DefaultArray<VALUE>, eq?: (a: VALUE, b: VALUE) => boolean): boolean {
        if (this.size !== other.size) return false;
        eq ??= (a, b) => a === b;
        for (let id = 0; id < this.data.length; ++id) {
            if (!eq(this.data[id], other.data[id])) return false;
        }
        return true;
    }

    toArray(): VALUE[] {
        return this.valuesArray();
    }

    toString(): string {
        return stringify(this.data);
    }
}