import { isFunction } from "../guard";
import { KVComponent } from "./kv-container";

/**
 * A Set-like structure that conforms to the KVComponent interface.
 * Methods like get(), set(), and getOrCreate() exist only for interface compatibility.
 * Use add(), has(), delete(), etc., for normal Set behavior.
 */
export class Set1<VALUE> implements KVComponent<[VALUE], VALUE> {
    private _set: Set<VALUE>;

    constructor();
    constructor(set: Set1<VALUE>)
    constructor(entries: Iterable<VALUE>)
    constructor(entries?: Set1<VALUE> | Iterable<VALUE>) {
        this._set = new Set(entries);

        /*
        this.keys = this.keys.bind(this);
        this.values = this.values.bind(this);
        this.entries = this.entries.bind(this);
        this.kvKeys = this.kvKeys.bind(this);
        this.kvValues = this.kvValues.bind(this);
        this.kvEntries = this.kvEntries.bind(this);
        */
    }

    has(value: VALUE): boolean {
        return this._set.has(value);
    }

    add(value: VALUE): VALUE {
        this._set.add(value);
        return value;
    }

    /** @internal - This method exists only for interface `KVComponent` compatibility.*/
    set(key: VALUE, value: VALUE): void {
        if (key !== value)
            throw new TypeError("Set1.set() requires key === value.");
        this.add(value);
    }

    /** @internal - This method exists only for interface `KVComponent` compatibility.*/
    get(key: VALUE): VALUE | undefined {
        return this._set.has(key) ? key : undefined;
    }

    /** @internal - This method exists only for interface `KVComponent` compatibility.*/
    getOrDefault(key: VALUE, defaultValue: VALUE): VALUE {
        return this.get(key) ?? defaultValue;
    }

    /** @internal - This method exists only for interface `KVComponent` compatibility.*/
    getOrCreate(key: VALUE, value: VALUE): VALUE;
    /** @internal - This method exists only for interface `KVComponent` compatibility.*/
    getOrCreate(key: VALUE, creator: () => VALUE): VALUE;
    getOrCreate(key: VALUE, creatorOrValue: VALUE | (() => VALUE)): VALUE {
        if (!this.has(key)) {
            const value = isFunction(creatorOrValue)
                ? creatorOrValue()
                : creatorOrValue;
            this.set(key, value);
            return value;
        }
        return this.get(key)!;
    }

    delete(value: VALUE): boolean {
        return this._set.delete(value);
    }

    clear(): void {
        this._set.clear();
    }

    get size(): number {
        return this._set.size;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    forEach(callbackfn: (value: VALUE, set1: Set1<VALUE>) => void, thisArg?: any): void {
        this._set.forEach(value => callbackfn.call(thisArg, value, this));
    }

    *keys(): IterableIterator<VALUE> {
        yield* this._set.keys();
    }

    *values(): IterableIterator<VALUE> {
        yield* this._set.values();
    }

    *entries(): IterableIterator<[VALUE, VALUE]> {
        yield* this._set.entries();
    }

    *kvKeys(): IterableIterator<[VALUE]> {
        for (const key of this.keys()) {
            yield [key];
        }
    }

    *kvValues(): IterableIterator<VALUE> {
        for (const el of this.values()) {
            yield el;
        }
    }

    *kvEntries(): IterableIterator<[[VALUE], VALUE]> {
        for (const [key, el] of this.entries()) {
            yield [[key], el];
        }
    }

    *[Symbol.iterator](): IterableIterator<VALUE> {
        yield* this.values();
    }

    clone(): Set1<VALUE> {
        return new Set1(this);
    }

    merge(other: Set1<VALUE>): this {
        for (const value of other.values()) {
            this.add(value);
        }
        return this;
    }

    some(fn: (value: VALUE) => boolean): boolean {
        for (const value of this._set) {
            if (fn(value)) return true;
        }
        return false;
    }

    every(fn: (value: VALUE) => boolean): boolean {
        for (const value of this._set) {
            if (!fn(value)) return false;
        }
        return true;
    }

    filter<S extends VALUE>(predicate: (value: VALUE, set1: Set1<VALUE>) => value is S): Set1<S>;
    filter(predicate: (value: VALUE, set1: Set1<VALUE>) => unknown): Set1<VALUE>;
    filter(predicate: (value: VALUE, set1: Set1<VALUE>) => unknown) {
        // Preserve subclass type using the constructor
        const result = new (this.constructor as { new(): Set1<VALUE> })();
        for (const value of this._set) {
            if (predicate(value, this)) result.add(value);
        }
        return result;
    }

    reduce(fn: (acc: VALUE, value: VALUE) => VALUE): VALUE;
    reduce<R>(fn: (acc: R, value: VALUE) => R, init: R): R;
    reduce<R>(fn: (acc: R, value: VALUE) => R, init?: R): R {
        let iterator = this.values();
        let first = iterator.next();

        if (first.done) {
            if (arguments.length < 2) {
                throw new TypeError("Reduce of empty Set1 with no initial value!");
            }
            return init!;
        }

        let acc: any;
        let start: IteratorResult<VALUE>;

        if (arguments.length < 2) {
            // no init → use first entry as accumulator
            acc = first.value;
            start = iterator.next();
        } else {
            acc = init;
            start = first;
        }

        for (let current = start; !current.done; current = iterator.next()) {
            const value = current.value;
            acc = fn(acc, value);
        }

        return acc;
    }

    mapValues<R = VALUE>(fn: (value: VALUE) => R): Set1<R> {
        let result = new Set1<R>();
        for (const value of this._set) {
            result.add(fn(value));
        }
        return result;
    }

    mapToArray<R>(fn: (value: VALUE) => R): R[] {
        let result: R[] = [];
        for (const value of this.values()) {
            result.push(fn(value));
        }
        return result;
    }

    map<R = VALUE>(fn: (value: VALUE) => R): Set1<R> {
        let result = new Set1<R>();
        for (const value of this.values()) {
            result.add(fn(value));
        }
        return result;
    }

    toSet(): Set<VALUE> {
        return new Set(this._set);
    }

    toArray(): VALUE[] {
        return [...this.values()];
    }

    toString(): string {
        const values = [...this._set].map(v => `${v}`).join(', ');
        return values.length === 0 ? `Set1(0){ }` : `Set1(${this.size}){ ${values} }`;
    }
}
