import { stringify } from "../utils/str";
import { isFunction } from "../guard";
import { BaseContainer, KVComponent, EqualityFn, DefaultEqualityFn } from "./base";
import { UniMap } from "./uni-map";

/**
 * A Map implementation mapping a triple key to a value.
 */
export class TriMap<KEY1, KEY2, KEY3, VALUE> extends BaseContainer implements KVComponent<[KEY1, KEY2, KEY3], VALUE> {
    private map1: UniMap<KEY1, UniMap<KEY2, UniMap<KEY3, VALUE>>>;
    private key1Equals: EqualityFn<KEY1> = DefaultEqualityFn;
    private key2Equals: EqualityFn<KEY2> = DefaultEqualityFn;
    private key3Equals: EqualityFn<KEY3> = DefaultEqualityFn;

    constructor();
    constructor(entries: Iterable<[KEY1, KEY2, KEY3, VALUE]>);
    constructor(triMap: TriMap<KEY1, KEY2, KEY3, VALUE>);
    constructor(entries?: Iterable<[KEY1, KEY2, KEY3, VALUE]> | TriMap<KEY1, KEY2, KEY3, VALUE>) {
        super();

        this.map1 = new UniMap(this.key1Equals);

        if (entries instanceof TriMap) {
            for (const [key1, map2] of entries.map1) {
                const newMap2 = this.map1.set(key1, new UniMap(this.key2Equals));
                for (const [key2, map3] of map2) {
                    newMap2.set(key2, new UniMap(map3, this.key3Equals));
                }
            }
        }
        else if (entries) {
            for (const [key1, key2, key3, value] of entries) {
                this.set(key1, key2, key3, value);
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

    has(key1: KEY1, key2: KEY2, key3: KEY3): boolean {
        return this.map1.get(key1)?.get(key2)?.has(key3) ?? false;
    }

    set(key1: KEY1, key2: KEY2, key3: KEY3, value: VALUE): VALUE {
        let map2 = this.map1.getOrCreate(key1, () => new UniMap<KEY2, UniMap<KEY3, VALUE>>(this.key2Equals));
        let map3 = map2.getOrCreate(key2, () => new UniMap<KEY3, VALUE>(this.key3Equals));
        map3.set(key3, value);
        return value;
    }

    get(key1: KEY1, key2: KEY2, key3: KEY3): VALUE | undefined {
        return this.map1.get(key1)?.get(key2)?.get(key3);
    }

    getOrDefault(key1: KEY1, key2: KEY2, key3: KEY3, defaultValue: VALUE): VALUE {
        return this.get(key1, key2, key3) ?? defaultValue;
    }

    getOrCreate(key1: KEY1, key2: KEY2, key3: KEY3, value: VALUE): VALUE;
    getOrCreate(key1: KEY1, key2: KEY2, key3: KEY3, creator: () => VALUE): VALUE;
    getOrCreate(key1: KEY1, key2: KEY2, key3: KEY3, creatorOrValue: VALUE | (() => VALUE)): VALUE {
        if (!this.has(key1, key2, key3)) {
            const value = isFunction(creatorOrValue)
                ? creatorOrValue()
                : creatorOrValue;
            this.set(key1, key2, key3, value);
            return value;
        }
        return this.get(key1, key2, key3)!;
    }

    delete(key1: KEY1): boolean;
    delete(key1: KEY1, key2: KEY2): boolean;
    delete(key1: KEY1, key2: KEY2, key3: KEY3): boolean;
    delete(key1: KEY1, key2?: KEY2, key3?: KEY3): boolean {
        if (key3 === undefined) {
            if (key2 === undefined) return this.map1.delete(key1);
            const map2 = this.map1.get(key1);
            if (!map2) return false;
            return map2.delete(key2);
        }
        else {
            if (key2 === undefined) return this.map1.delete(key1);
            const map3 = this.map1.get(key1)?.get(key2);
            if (!map3) return false;
            return map3.delete(key3);
        }
    }

    clear(): void {
        this.map1.clear();
    }

    get size(): number {
        let count = 0;
        for (const map2 of this.map1.values()) {
            for (const map3 of map2.values()) {
                count += map3.size;
            }
        }
        return count;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    forEach(callbackfn: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3, map2: TriMap<KEY1, KEY2, KEY3, VALUE>) => void, thisArg?: any): void {
        this.map1.forEach((map2, key1) => map2.forEach((map3, key2) => map3.forEach((value, key3) => callbackfn.call(thisArg, value, key1, key2, key3, this))));
    }

    *keys(): IterableIterator<[KEY1, KEY2, KEY3]> {
        for (const [key1, map2] of this.map1)
            for (const [key2, map3] of map2)
                for (const key3 of map3.keys())
                    yield [key1, key2, key3];
    }

    *values(): IterableIterator<VALUE> {
        for (const map2 of this.map1.values())
            for (const map3 of map2.values())
                for (const value of map3.values())
                    yield value;
    }

    *entries(): IterableIterator<[KEY1, KEY2, KEY3, VALUE]> {
        for (const [key1, map2] of this.map1)
            for (const [key2, map3] of map2)
                for (const [key3, value] of map3)
                    yield [key1, key2, key3, value];
    }

    keysArray(): [KEY1, KEY2, KEY3][] {
        return [...this.keys()];
    }

    valuesArray(): VALUE[] {
        return [...this.values()];
    }

    entriesArray(): [KEY1, KEY2, KEY3, VALUE][] {
        return [...this.entries()];
    }

    *kvKeys(): IterableIterator<[KEY1, KEY2, KEY3]> {
        for (const [key1, key2, key3] of this.keys())
            yield [key1, key2, key3];
    }

    *kvValues(): IterableIterator<VALUE> {
        for (const el of this.values())
            yield el;
    }

    *kvEntries(): IterableIterator<[[KEY1, KEY2, KEY3], VALUE]> {
        for (const [key1, key2, key3, el] of this.entries())
            yield [[key1, key2, key3], el];
    }

    *[Symbol.iterator](): IterableIterator<[KEY1, KEY2, KEY3, VALUE]> {
        yield* this.entries();
    }

    clone(): TriMap<KEY1, KEY2, KEY3, VALUE> {
        return new TriMap(this);
    }

    merge(other: TriMap<KEY1, KEY2, KEY3, VALUE>, conflictResolver?: (oldValue: VALUE, newValue: VALUE, key1: KEY1, key2: KEY2, key3: KEY3) => VALUE): this {
        for (const [key1, key2, key3, value] of other.entries()) {
            if (this.has(key1, key2, key3) && conflictResolver) {
                this.set(key1, key2, key3, conflictResolver(this.get(key1, key2, key3)!, value, key1, key2, key3));
            }
            else {
                this.set(key1, key2, key3, value);
            }
        }
        return this;
    }

    some(fn: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3) => boolean): boolean {
        for (const [key1, map2] of this.map1) {
            for (const [key2, map3] of map2) {
                for (const [key3, value] of map3) {
                    if (fn(value, key1, key2, key3)) return true;
                }
            }
        }
        return false;
    }

    every(fn: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3) => boolean): boolean {
        for (const [key1, map2] of this.map1) {
            for (const [key2, map3] of map2) {
                for (const [key3, value] of map3) {
                    if (!fn(value, key1, key2, key3)) return false;
                }
            }
        }
        return true;
    }

    filter<S extends VALUE>(predicate: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3, array: TriMap<KEY1, KEY2, KEY3, VALUE>) => value is S): TriMap<KEY1, KEY2, KEY3, S>;
    filter(predicate: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3, array: TriMap<KEY1, KEY2, KEY3, VALUE>) => unknown): TriMap<KEY1, KEY2, KEY3, VALUE>;
    filter(predicate: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3, array: TriMap<KEY1, KEY2, KEY3, VALUE>) => unknown) {
        // Preserve subclass type using the constructor
        const result = new (this.constructor as { new(): TriMap<KEY1, KEY2, KEY3, VALUE> })();
        for (const [key1, map2] of this.map1) {
            for (const [key2, map3] of map2) {
                for (const [key3, value] of map3) {
                    if (predicate(value, key1, key2, key3, this)) result.set(key1, key2, key3, value);
                }
            }
        }
        return result;
    }

    reduce(fn: (acc: VALUE, value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3) => VALUE): VALUE;
    reduce<R>(fn: (acc: R, value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3) => R, init: R): R;
    reduce<R>(fn: (acc: R, value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3) => R, init?: R): R {
        let iterator = this.entries();
        let first = iterator.next();

        if (first.done) {
            if (arguments.length < 2) {
                throw new TypeError("Reduce of empty Map3 with no initial value!");
            }
            return init!;
        }

        let acc: any;
        let start: IteratorResult<[KEY1, KEY2, KEY3, VALUE]>;

        if (arguments.length < 2) {
            // no init → use first entry as accumulator
            acc = first.value[3]; // [key1, key2, key3, value]
            start = iterator.next();
        } else {
            acc = init;
            start = first;
        }

        for (let current = start; !current.done; current = iterator.next()) {
            const [key1, key2, key3, value] = current.value;
            acc = fn(acc, value, key1, key2, key3);
        }

        return acc;
    }

    mapEntries<R>(fn: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3) => R): R[] {
        let result: R[] = [];
        for (const [key1, map2] of this.map1) {
            for (const [key2, map3] of map2) {
                for (const [key3, value] of map3) {
                    result.push(fn(value, key1, key2, key3));
                }
            }
        }
        return result;
    }

    mapValues<R = VALUE>(fn: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3) => R): TriMap<KEY1, KEY2, KEY3, R> {
        let result = new TriMap<KEY1, KEY2, KEY3, R>();
        for (const [key1, map2] of this.map1) {
            for (const [key2, map3] of map2) {
                for (const [key3, value] of map3) {
                    result.set(key1, key2, key3, fn(value, key1, key2, key3));
                }
            }
        }
        return result;
    }

    toMap(): Map<[KEY1, KEY2, KEY3], VALUE> {
        let result = new Map<[KEY1, KEY2, KEY3], VALUE>();
        for (const [key1, map2] of this.map1) {
            for (const [key2, map3] of map2) {
                for (const [key3, value] of map3) {
                    result.set([key1, key2, key3], value);
                }
            }
        }
        return result;
    }

    toString(): string {
        const entries: string[] = [];
        for (const [key1, map2] of this.map1) {
            for (const [key2, map3] of map2) {
                const inner = [...map3].map(([key3, v]) => `${stringify(key3)} => ${stringify(v)}`).join(', ');
                entries.push(`${stringify(key1)} => ${stringify(key2)} => { ${inner} }`);
            }
        }
        return entries.length === 0 ? `Map(${this.size}){ }` : `Map(${this.size}){ ${entries.join(", ")} }`;
    }
}
