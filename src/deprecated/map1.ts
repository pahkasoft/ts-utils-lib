import { stringify } from "../utils/str";
import { isFunction } from "../guard";
import { BaseContainer, KVComponent } from "../core";

/**
 * @deprecated - Use {@link UniMap} instead. Will be removed in v2.0.0.
 * @private
 * A Map implementation mapping a single key to a value.
 */
export class Map1<KEY1, VALUE> extends BaseContainer  implements KVComponent<[KEY1], VALUE> {
    private map1: Map<KEY1, VALUE>;

    constructor();
    constructor(map1: Map1<KEY1, VALUE>)
    constructor(entries: Iterable<[KEY1, VALUE]>)
    constructor(entries?: Map1<KEY1, VALUE> | Iterable<[KEY1, VALUE]>) {
        super();

        this.map1 = entries instanceof Map1 ? new Map(entries.map1) : new Map(entries);

        /*
        this.keys = this.keys.bind(this);
        this.values = this.values.bind(this);
        this.entries = this.entries.bind(this);
        this.kvKeys = this.kvKeys.bind(this);
        this.kvValues = this.kvValues.bind(this);
        this.kvEntries = this.kvEntries.bind(this);
        */
    }

    has(key1: KEY1): boolean {
        return this.map1.has(key1);
    }

    set(key1: KEY1, value: VALUE): VALUE {
        this.map1.set(key1, value);
        return value;
    }

    get(key1: KEY1): VALUE | undefined {
        return this.map1.get(key1);
    }

    getOrDefault(key1: KEY1, defaultValue: VALUE): VALUE {
        return this.get(key1) ?? defaultValue;
    }

    getOrCreate(key1: KEY1, value: VALUE): VALUE;
    getOrCreate(key1: KEY1, creator: () => VALUE): VALUE;
    getOrCreate(key1: KEY1, creatorOrValue: VALUE | (() => VALUE)): VALUE {
        if (!this.has(key1)) {
            const value = isFunction(creatorOrValue)
                ? creatorOrValue()
                : creatorOrValue;
            this.set(key1, value);
            return value;
        }
        return this.get(key1)!;
    }

    delete(key1: KEY1): boolean {
        return this.map1.delete(key1);
    }

    clear(): void {
        this.map1.clear();
    }

    get size(): number {
        return this.map1.size;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    forEach(callbackfn: (value: VALUE, key1: KEY1, map1: Map1<KEY1, VALUE>) => void, thisArg?: any): void {
        this.map1.forEach((value, key1) => callbackfn.call(thisArg, value, key1, this));
    }

    *keys(): IterableIterator<KEY1> {
        yield* this.map1.keys();
    }

    *values(): IterableIterator<VALUE> {
        yield* this.map1.values();
    }

    *entries(): IterableIterator<[KEY1, VALUE]> {
        for (const [key1, value] of this.map1)
            yield [key1, value];
    }

    keysArray(): KEY1[] {
        return [...this.keys()];
    }

    valuesArray(): VALUE[] {
        return [...this.values()];
    }

    entriesArray(): [KEY1, VALUE][] {
        return [...this.entries()];
    }

    *kvKeys(): IterableIterator<[KEY1]> {
        for (const key of this.keys()) {
            yield [key];
        }
    }

    *kvValues(): IterableIterator<VALUE> {
        for (const el of this.values()) {
            yield el;
        }
    }

    *kvEntries(): IterableIterator<[[KEY1], VALUE]> {
        for (const [key, el] of this.entries()) {
            yield [[key], el];
        }
    }

    *[Symbol.iterator](): IterableIterator<[KEY1, VALUE]> {
        yield* this.entries();
    }

    clone(): Map1<KEY1, VALUE> {
        return new Map1(this);
    }

    merge(other: Map1<KEY1, VALUE>, conflictResolver?: (oldValue: VALUE, newValue: VALUE, key1: KEY1) => VALUE): this {
        for (const [key1, value] of other.entries()) {
            if (this.has(key1) && conflictResolver) {
                this.set(key1, conflictResolver(this.get(key1)!, value, key1));
            }
            else {
                this.set(key1, value);
            }
        }
        return this;
    }

    some(fn: (value: VALUE, key1: KEY1) => boolean): boolean {
        for (const [key1, value] of this.map1) {
            if (fn(value, key1)) return true;
        }
        return false;
    }

    every(fn: (value: VALUE, key1: KEY1) => boolean): boolean {
        for (const [key1, value] of this.map1) {
            if (!fn(value, key1)) return false;
        }
        return true;
    }

    filter<S extends VALUE>(predicate: (value: VALUE, key1: KEY1, array: Map1<KEY1, VALUE>) => value is S): Map1<KEY1, S>;
    filter(predicate: (value: VALUE, key1: KEY1, array: Map1<KEY1, VALUE>) => unknown): Map1<KEY1, VALUE>;
    filter(predicate: (value: VALUE, key1: KEY1, array: Map1<KEY1, VALUE>) => unknown) {
        // Preserve subclass type using the constructor
        const result = new (this.constructor as { new(): Map1<KEY1, VALUE> })();
        for (const [key1, value] of this.map1) {
            if (predicate(value, key1, this)) result.set(key1, value);
        }
        return result;
    }

    reduce(fn: (acc: VALUE, value: VALUE, key1: KEY1) => VALUE): VALUE;
    reduce<R>(fn: (acc: R, value: VALUE, key1: KEY1) => R, init: R): R;
    reduce<R>(fn: (acc: R, value: VALUE, key1: KEY1) => R, init?: R): R {
        let iterator = this.entries();
        let first = iterator.next();

        if (first.done) {
            if (arguments.length < 2) {
                throw new TypeError("Reduce of empty Map1 with no initial value!");
            }
            return init!;
        }

        let acc: any;
        let start: IteratorResult<[KEY1, VALUE]>;

        if (arguments.length < 2) {
            // no init → use first entry as accumulator
            acc = first.value[1]; // [key1, value]
            start = iterator.next();
        } else {
            acc = init;
            start = first;
        }

        for (let current = start; !current.done; current = iterator.next()) {
            const [key1, value] = current.value;
            acc = fn(acc, value, key1);
        }

        return acc;
    }

    mapEntries<R>(fn: (value: VALUE, key1: KEY1) => R): R[] {
        let result: R[] = [];
        for (const [key1, value] of this.map1) {
            result.push(fn(value, key1));
        }
        return result;
    }

    mapValues<R = VALUE>(fn: (value: VALUE, key1: KEY1) => R): Map1<KEY1, R> {
        let result = new Map1<KEY1, R>();
        for (const [key1, value] of this.map1) {
            result.set(key1, fn(value, key1));
        }
        return result;
    }

    toMap(): Map<KEY1, VALUE> {
        return new Map(this.map1);
    }

    toString(): string {
        const entries = [...this.map1].map(([k, v]) => `${stringify(k)} => ${stringify(v)}`).join(', ');
        return entries.length === 0 ?  `Map(${this.size}){ }` : `Map(${this.size}){ ${entries} }`;
    }
}
