import { stringify } from "../utils/str";
import { isFunction } from "../guard";
import { BaseContainer, KVComponent, EqualityFn, DefaultEqualityFn } from "./base";
import { UniMap } from "./uni-map";

/**
 * A Map implementation mapping a double key to a value.
 */
export class BiMap<KEY1, KEY2, VALUE> extends BaseContainer implements KVComponent<[KEY1, KEY2], VALUE> {
    private map1: UniMap<KEY1, UniMap<KEY2, VALUE>>;
    private key1Equals: EqualityFn<KEY1> = DefaultEqualityFn;
    private key2Equals: EqualityFn<KEY2> = DefaultEqualityFn;

    constructor();
    constructor(biMap: BiMap<KEY1, KEY2, VALUE>)
    constructor(entries: Iterable<[KEY1, KEY2, VALUE]>)
    constructor(entries?: BiMap<KEY1, KEY2, VALUE> | Iterable<[KEY1, KEY2, VALUE]>) {
        super();

        this.map1 = new UniMap(this.key1Equals);

        if (entries instanceof BiMap) {
            for (const [key1, map2] of entries.map1) {
                const newMap2 = this.map1.set(key1, new UniMap(this.key2Equals));
                for (const [key2, value] of map2) {
                    newMap2.set(key2, value);
                }
            }
        }
        else if (entries) {
            for (const [key1, key2, value] of entries) {
                this.set(key1, key2, value);
            }
        }

        /*
        this.keys = this.keys.bind(this);
        this.values = this.values.bind(this);
        this.entries = this.entries.bind(this);
        this.kvKeys = this.kvKeys.bind(this);
        this.kvValues = this.kvValues.bind(this);
        this.kvEntries = this.kvEntries.bind(this);
        */
    }

    has(key1: KEY1, key2: KEY2): boolean {
        return this.map1.get(key1)?.has(key2) ?? false;
    }

    set(key1: KEY1, key2: KEY2, value: VALUE): VALUE {
        return this.map1.getOrCreate(key1, () => new UniMap<KEY2, VALUE>(this.key2Equals)).set(key2, value);
    }

    get(key1: KEY1, key2: KEY2): VALUE | undefined {
        return this.map1.get(key1)?.get(key2);
    }

    getOrDefault(key1: KEY1, key2: KEY2, defaultValue: VALUE): VALUE {
        return this.get(key1, key2) ?? defaultValue;
    }

    getOrCreate(key1: KEY1, key2: KEY2, value: VALUE): VALUE;
    getOrCreate(key1: KEY1, key2: KEY2, creator: () => VALUE): VALUE;
    getOrCreate(key1: KEY1, key2: KEY2, creatorOrValue: VALUE | (() => VALUE)): VALUE {
        if (!this.has(key1, key2)) {
            const value = isFunction(creatorOrValue)
                ? creatorOrValue()
                : creatorOrValue;
            this.set(key1, key2, value);
            return value;
        }
        return this.get(key1, key2)!;
    }

    delete(key1: KEY1): boolean;
    delete(key1: KEY1, key2: KEY2): boolean;
    delete(key1: KEY1, key2?: KEY2): boolean {
        if (key2 === undefined) return this.map1.delete(key1);
        const map2 = this.map1.get(key1);
        if (!map2) return false;
        return map2.delete(key2);
    }

    clear(): void {
        this.map1.clear();
    }

    get size(): number {
        let count = 0;
        for (const map2 of this.map1.values()) {
            count += map2.size;
        }
        return count;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    forEach(callbackfn: (value: VALUE, key1: KEY1, key2: KEY2, map2: BiMap<KEY1, KEY2, VALUE>) => void, thisArg?: any): void {
        this.map1.forEach((map2, key1) => map2.forEach((value, key2) => callbackfn.call(thisArg, value, key1, key2, this)));
    }

    *keys(): IterableIterator<[KEY1, KEY2]> {
        for (const [key1, map2] of this.map1)
            for (const key2 of map2.keys())
                yield [key1, key2];
    }

    *values(): IterableIterator<VALUE> {
        for (const map2 of this.map1.values())
            for (const value of map2.values())
                yield value;
    }

    *entries(): IterableIterator<[KEY1, KEY2, VALUE]> {
        for (const [key1, map2] of this.map1)
            for (const [key2, value] of map2)
                yield [key1, key2, value];
    }

    keysArray(): [KEY1, KEY2][] {
        return [...this.keys()];
    }

    valuesArray(): VALUE[] {
        return [...this.values()];
    }

    entriesArray(): [KEY1, KEY2, VALUE][] {
        return [...this.entries()];
    }

    *kvKeys(): IterableIterator<[KEY1, KEY2]> {
        for (const [key1, key2] of this.keys())
            yield [key1, key2];
    }

    *kvValues(): IterableIterator<VALUE> {
        for (const el of this.values())
            yield el;
    }

    *kvEntries(): IterableIterator<[[KEY1, KEY2], VALUE]> {
        for (const [key1, key2, el] of this.entries())
            yield [[key1, key2], el];
    }

    *[Symbol.iterator](): IterableIterator<[KEY1, KEY2, VALUE]> {
        yield* this.entries();
    }

    clone(): BiMap<KEY1, KEY2, VALUE> {
        return new BiMap(this);
    }

    merge(other: BiMap<KEY1, KEY2, VALUE>, conflictResolver?: (oldValue: VALUE, newValue: VALUE, key1: KEY1, key2: KEY2) => VALUE): this {
        for (const [key1, key2, value] of other.entries()) {
            if (this.has(key1, key2) && conflictResolver) {
                this.set(key1, key2, conflictResolver(this.get(key1, key2)!, value, key1, key2));
            }
            else {
                this.set(key1, key2, value);
            }
        }
        return this;
    }

    some(fn: (value: VALUE, key1: KEY1, key2: KEY2) => boolean): boolean {
        for (const [key1, map2] of this.map1) {
            for (const [key2, value] of map2) {
                if (fn(value, key1, key2)) return true;
            }
        }
        return false;
    }

    every(fn: (value: VALUE, key1: KEY1, key2: KEY2) => boolean): boolean {
        for (const [key1, map2] of this.map1) {
            for (const [key2, value] of map2) {
                if (!fn(value, key1, key2)) return false;
            }
        }
        return true;
    }

    filter<S extends VALUE>(predicate: (value: VALUE, key1: KEY1, key2: KEY2, array: BiMap<KEY1, KEY2, VALUE>) => value is S): BiMap<KEY1, KEY2, S>;
    filter(predicate: (value: VALUE, key1: KEY1, key2: KEY2, array: BiMap<KEY1, KEY2, VALUE>) => unknown): BiMap<KEY1, KEY2, VALUE>;
    filter(predicate: (value: VALUE, key1: KEY1, key2: KEY2, array: BiMap<KEY1, KEY2, VALUE>) => unknown) {
        // Preserve subclass type using the constructor
        const result = new (this.constructor as { new(): BiMap<KEY1, KEY2, VALUE> })();
        for (const [key1, map2] of this.map1) {
            for (const [key2, value] of map2) {
                if (predicate(value, key1, key2, this)) result.set(key1, key2, value);
            }
        }
        return result;
    }

    reduce(fn: (acc: VALUE, value: VALUE, key1: KEY1, key2: KEY2) => VALUE): VALUE;
    reduce<R>(fn: (acc: R, value: VALUE, key1: KEY1, key2: KEY2) => R, init: R): R;
    reduce<R>(fn: (acc: R, value: VALUE, key1: KEY1, key2: KEY2) => R, init?: R): R {
        let iterator = this.entries();
        let first = iterator.next();

        if (first.done) {
            if (arguments.length < 2) {
                throw new TypeError("Reduce of empty Map2 with no initial value!");
            }
            return init!;
        }

        let acc: any;
        let start: IteratorResult<[KEY1, KEY2, VALUE]>;

        if (arguments.length < 2) {
            // no init → use first entry as accumulator
            acc = first.value[2]; // [key1, key2, value]
            start = iterator.next();
        } else {
            acc = init;
            start = first;
        }

        for (let current = start; !current.done; current = iterator.next()) {
            const [key1, key2, value] = current.value;
            acc = fn(acc, value, key1, key2);
        }

        return acc;
    }

    mapEntries<R>(fn: (value: VALUE, key1: KEY1, key2: KEY2) => R): R[] {
        let result: R[] = [];
        for (const [key1, map2] of this.map1) {
            for (const [key2, value] of map2) {
                result.push(fn(value, key1, key2));
            }
        }
        return result;
    }

    mapValues<R = VALUE>(fn: (value: VALUE, key1: KEY1, key2: KEY2) => R): BiMap<KEY1, KEY2, R> {
        let result = new BiMap<KEY1, KEY2, R>();
        for (const [key1, map2] of this.map1) {
            for (const [key2, value] of map2) {
                result.set(key1, key2, fn(value, key1, key2));
            }
        }
        return result;
    }

    toMap(): Map<[KEY1, KEY2], VALUE> {
        let result = new Map<[KEY1, KEY2], VALUE>();
        for (const [key1, map2] of this.map1) {
            for (const [key2, value] of map2) {
                result.set([key1, key2], value);
            }
        }
        return result;
    }

    toString(): string {
        const entries: string[] = [];
        for (const [key1, map2] of this.map1) {
            const inner = [...map2].map(([key2, v]) => `${stringify(key2)} => ${stringify(v)}`).join(', ');
            entries.push(`${stringify(key1)} => { ${inner} }`);
        }
        return entries.length === 0 ? `Map(${this.size}){ }` : `Map(${this.size}){ ${entries} }`;
    }
}
