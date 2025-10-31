import { stringify } from "../utils/str";
import { isFunction, isDeepEqual } from "../guard";
import { BaseContainer, KVComponent, EqualityFn, DefaultEqualityFn } from "./base";

/**
 * A Map implementation mapping a single key to a value.
 */
export class UniMap<KEY, VALUE> extends BaseContainer implements KVComponent<[KEY], VALUE> {
    private map: Map<KEY, VALUE>;
    private keyEquals: EqualityFn<KEY>;

    constructor();
    constructor(equals?: EqualityFn<KEY>);
    constructor(list: UniMap<KEY, VALUE> | Iterable<[KEY, VALUE]>, equals?: EqualityFn<KEY>);
    constructor(...args: unknown[]) {
        super();

        // Detect equality function if last argument is a function
        const maybeEquals = args.at(-1);
        this.keyEquals = isFunction(maybeEquals)
            ? (args.pop() as EqualityFn<KEY>)
            : DefaultEqualityFn;

        // Extract optional list or iterable
        const entries = args[0] as Iterable<[KEY, VALUE]> | UniMap<KEY, VALUE> | undefined;

        this.map = new Map(entries);

        /*
        this.keys = this.keys.bind(this);
        this.values = this.values.bind(this);
        this.entries = this.entries.bind(this);
        this.kvKeys = this.kvKeys.bind(this);
        this.kvValues = this.kvValues.bind(this);
        this.kvEntries = this.kvEntries.bind(this);
        */
    }

    static createDeep<KEY1, VALUE>(): UniMap<KEY1, VALUE>;
    static createDeep<KEY1, VALUE>(set: UniMap<KEY1, VALUE>): UniMap<KEY1, VALUE>;
    static createDeep<KEY1, VALUE>(entries: Iterable<[KEY1, VALUE]>): UniMap<KEY1, VALUE>;
    static createDeep<KEY1, VALUE>(arg?: UniMap<KEY1, VALUE> | Iterable<[KEY1, VALUE]>) {
        return arg ? new UniMap<KEY1, VALUE>(arg, isDeepEqual) : new UniMap<KEY1, VALUE>(isDeepEqual);
    }

    has(key: KEY): boolean {
        if (this.keyEquals === DefaultEqualityFn || this.map.has(key))
            return this.map.has(key);
        for (const [k, v] of this.map)
            if (this.keyEquals(k, key))
                return true;
        return false;
    }

    set(key: KEY, value: VALUE): VALUE {
        if (this.keyEquals === DefaultEqualityFn || this.map.has(key)) {
            this.map.set(key, value);
            return value;
        }
        for (const key2 of this.map.keys())
            if (this.keyEquals(key2, key)) {
                this.map.set(key2, value);
                return value;
            }
        this.map.set(key, value);
        return value;
    }

    get(key: KEY): VALUE | undefined {
        if (this.keyEquals === DefaultEqualityFn || this.map.has(key))
            return this.map.get(key);

        for (const [k, v] of this.map)
            if (this.keyEquals(k, key))
                return v;

        return undefined;
    }

    delete(key: KEY): boolean {
        if (this.keyEquals === DefaultEqualityFn || this.map.has(key))
            return this.map.delete(key);
        for (const k of this.map.keys())
            if (this.keyEquals(k, key))
                return this.map.delete(k);
        return this.map.delete(key);
    }

    getOrDefault(key: KEY, defaultValue: VALUE): VALUE {
        return this.get(key) ?? defaultValue;
    }

    getOrCreate(key: KEY, value: VALUE): VALUE;
    getOrCreate(key: KEY, creator: () => VALUE): VALUE;
    getOrCreate(key: KEY, creatorOrValue: VALUE | (() => VALUE)): VALUE {
        if (!this.has(key)) {
            const value = isFunction(creatorOrValue)
                ? creatorOrValue()
                : creatorOrValue;
            return this.set(key, value)
        }
        return this.get(key)!;
    }

    clear(): void {
        this.map.clear();
    }

    get size(): number {
        return this.map.size;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    forEach(callbackfn: (value: VALUE, key: KEY, map1: UniMap<KEY, VALUE>) => void, thisArg?: any): void {
        this.map.forEach((value, key) => callbackfn.call(thisArg, value, key, this));
    }

    *keys(): IterableIterator<KEY> {
        yield* this.map.keys();
    }

    *values(): IterableIterator<VALUE> {
        yield* this.map.values();
    }

    *entries(): IterableIterator<[KEY, VALUE]> {
        for (const [key, value] of this.map)
            yield [key, value];
    }

    keysArray(): KEY[] {
        return [...this.keys()];
    }

    valuesArray(): VALUE[] {
        return [...this.values()];
    }

    entriesArray(): [KEY, VALUE][] {
        return [...this.entries()];
    }

    *kvKeys(): IterableIterator<[KEY]> {
        for (const key of this.keys()) {
            yield [key];
        }
    }

    *kvValues(): IterableIterator<VALUE> {
        for (const el of this.values()) {
            yield el;
        }
    }

    *kvEntries(): IterableIterator<[[KEY], VALUE]> {
        for (const [key, el] of this.entries()) {
            yield [[key], el];
        }
    }

    *[Symbol.iterator](): IterableIterator<[KEY, VALUE]> {
        yield* this.entries();
    }

    clone(): UniMap<KEY, VALUE> {
        return new UniMap(this, this.keyEquals);
    }

    merge(other: UniMap<KEY, VALUE>, conflictResolver?: (oldValue: VALUE, newValue: VALUE, key: KEY) => VALUE): this {
        for (const [key, value] of other.entries()) {
            if (this.has(key) && conflictResolver) {
                this.set(key, conflictResolver(this.get(key)!, value, key));
            }
            else {
                this.set(key, value);
            }
        }
        return this;
    }

    some(fn: (value: VALUE, key: KEY) => boolean): boolean {
        for (const [key, value] of this.map) {
            if (fn(value, key)) return true;
        }
        return false;
    }

    every(fn: (value: VALUE, key: KEY) => boolean): boolean {
        for (const [key, value] of this.map) {
            if (!fn(value, key)) return false;
        }
        return true;
    }

    filter<S extends VALUE>(predicate: (value: VALUE, key: KEY, array: UniMap<KEY, VALUE>) => value is S): UniMap<KEY, S>;
    filter(predicate: (value: VALUE, key: KEY, array: UniMap<KEY, VALUE>) => unknown): UniMap<KEY, VALUE>;
    filter(predicate: (value: VALUE, key: KEY, array: UniMap<KEY, VALUE>) => unknown) {
        // Preserve subclass type using the constructor
        const result = new (this.constructor as { new(): UniMap<KEY, VALUE> })();
        for (const [key, value] of this.map) {
            if (predicate(value, key, this)) result.set(key, value);
        }
        return result;
    }

    reduce(fn: (acc: VALUE, value: VALUE, key: KEY) => VALUE): VALUE;
    reduce<R>(fn: (acc: R, value: VALUE, key: KEY) => R, init: R): R;
    reduce<R>(fn: (acc: R, value: VALUE, key: KEY) => R, init?: R): R {
        let iterator = this.entries();
        let first = iterator.next();

        if (first.done) {
            if (arguments.length < 2) {
                throw new TypeError("Reduce of empty UniMap with no initial value!");
            }
            return init!;
        }

        let acc: any;
        let start: IteratorResult<[KEY, VALUE]>;

        if (arguments.length < 2) {
            // no init → use first entry as accumulator
            acc = first.value[1]; // [key, value]
            start = iterator.next();
        } else {
            acc = init;
            start = first;
        }

        for (let current = start; !current.done; current = iterator.next()) {
            const [key, value] = current.value;
            acc = fn(acc, value, key);
        }

        return acc;
    }

    mapEntries<R>(fn: (value: VALUE, key: KEY) => R): R[] {
        let result: R[] = [];
        for (const [key, value] of this.map) {
            result.push(fn(value, key));
        }
        return result;
    }

    mapValues<R = VALUE>(fn: (value: VALUE, key: KEY) => R): UniMap<KEY, R> {
        let result = new UniMap<KEY, R>();
        for (const [key, value] of this.map) {
            result.set(key, fn(value, key));
        }
        return result;
    }

    toMap(): Map<KEY, VALUE> {
        return new Map(this.map);
    }

    toString(): string {
        const entries = [...this.map].map(([k, v]) => `${stringify(k)} => ${stringify(v)}`).join(', ');
        return entries.length === 0 ? `Map(${this.size}){ }` : `Map(${this.size}){ ${entries} }`;
    }
}
