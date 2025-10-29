import { stringify } from "../utils/str";
import { isDeepEqual, isFunction } from "../guard";
import { BaseContainer, KVComponent, EqualityFn, DefaultEqualityFn } from "./base";

/**
 * An implementation of a Set data structure.
 */
export class ValueSet<VALUE> extends BaseContainer implements KVComponent<[VALUE], VALUE> {
    private data: Set<VALUE>;
    private equals: EqualityFn<VALUE>;

    constructor();
    constructor(equals: EqualityFn<VALUE>);
    constructor(set: ValueSet<VALUE>);
    constructor(set: ValueSet<VALUE>, equals: EqualityFn<VALUE>);
    constructor(entries: Iterable<VALUE>);
    constructor(entries: Iterable<VALUE>, equals: EqualityFn<VALUE>);
    constructor(...args: unknown[]) {
        super();

        this.equals = isFunction(args[args.length - 1])
            ? args.pop() as EqualityFn<VALUE>
            : DefaultEqualityFn;

        const entries = args[0] as ValueSet<VALUE> | Iterable<VALUE> | undefined;

        this.data = new Set(entries);

        /*
        this.keys = this.keys.bind(this);
        this.values = this.values.bind(this);
        this.entries = this.entries.bind(this);
        this.kvKeys = this.kvKeys.bind(this);
        this.kvValues = this.kvValues.bind(this);
        this.kvEntries = this.kvEntries.bind(this);
        */
    }

    static createDeep<VALUE>(): ValueSet<VALUE>;
    static createDeep<VALUE>(set: ValueSet<VALUE>): ValueSet<VALUE>;
    static createDeep<VALUE>(entries: Iterable<VALUE>): ValueSet<VALUE>;
    static createDeep<VALUE>(arg?: ValueSet<VALUE> | Iterable<VALUE>) {
        return arg ? new ValueSet<VALUE>(arg, isDeepEqual) : new ValueSet<VALUE>(isDeepEqual);
    }

    has(value: VALUE): boolean {
        if (this.equals === DefaultEqualityFn)
            return this.data.has(value);
        return this.some(v => this.equals(v, value));
    }

    add(value: VALUE): VALUE {
        if (!this.has(value))
            this.data.add(value);
        return value;
    }

    /** @internal - This method exists only for interface `KVComponent` compatibility.*/
    set(key: VALUE, value: VALUE): void {
        if (!this.equals(key, value))
            throw new TypeError("ValueSet.set() requires key === value.");
        this.add(value);
    }

    /** @internal - This method exists only for interface `KVComponent` compatibility.*/
    get(key: VALUE): VALUE | undefined {
        return this.has(key) ? key : undefined;
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
        if (this.equals === DefaultEqualityFn || this.data.has(value))
            return this.data.delete(value);
        for (const v of this.values()) {
            if (this.equals(v, value)) {
                this.data.delete(v);
                return true;
            }
        }
        return false;
    }

    clear(): void {
        this.data.clear();
    }

    get size(): number {
        return this.data.size;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }

    forEach(callbackfn: (value: VALUE, set: ValueSet<VALUE>) => void, thisArg?: any): void {
        this.data.forEach(value => callbackfn.call(thisArg, value, this));
    }

    *keys(): IterableIterator<VALUE> {
        yield* this.data.keys();
    }

    *values(): IterableIterator<VALUE> {
        yield* this.data.values();
    }

    *entries(): IterableIterator<[VALUE, VALUE]> {
        yield* this.data.entries();
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

    clone(): ValueSet<VALUE> {
        const result = new ValueSet<VALUE>();
        for (const v of this.values()) result.add(v);
        return result;
    }

    merge(other: ValueSet<VALUE>): this {
        for (const value of other.values()) {
            this.add(value);
        }
        return this;
    }

    some(fn: (value: VALUE) => boolean): boolean {
        for (const value of this.data) {
            if (fn(value)) return true;
        }
        return false;
    }

    every(fn: (value: VALUE) => boolean): boolean {
        for (const value of this.data) {
            if (!fn(value)) return false;
        }
        return true;
    }

    filter<R extends VALUE>(predicate: (value: VALUE, set: ValueSet<VALUE>) => value is R): ValueSet<R>;
    filter(predicate: (value: VALUE, set1: ValueSet<VALUE>) => unknown): ValueSet<VALUE>;
    filter(predicate: (value: VALUE, set1: ValueSet<VALUE>) => unknown) {
        const result = new ValueSet<VALUE>();
        for (const value of this.data)
            if (predicate(value, this)) result.add(value);
        return result;
    }

    reduce(fn: (acc: VALUE, value: VALUE) => VALUE): VALUE;
    reduce<R = VALUE>(fn: (acc: R, value: VALUE) => R, init: R): R;
    reduce<R = VALUE>(fn: (acc: R, value: VALUE) => R, init?: R): R {
        let iterator = this.values();
        let first = iterator.next();

        if (first.done) {
            if (arguments.length < 2) {
                throw new TypeError("Reduce of empty ValueSet with no initial value!");
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

    mapValues<R = VALUE>(fn: (value: VALUE) => R): ValueSet<R> {
        let result = new ValueSet<R>();
        for (const value of this.data) {
            result.add(fn(value));
        }
        return result;
    }

    mapToArray<R = VALUE>(fn: (value: VALUE) => R): R[] {
        let result: R[] = [];
        for (const value of this.values()) {
            result.push(fn(value));
        }
        return result;
    }

    map<R = VALUE>(fn: (value: VALUE) => R): ValueSet<R> {
        let result = new ValueSet<R>();
        for (const value of this.values()) {
            result.add(fn(value));
        }
        return result;
    }

    toSet(): Set<VALUE> {
        return new Set(this.data);
    }

    toArray(): VALUE[] {
        return [...this.values()];
    }

    toString(): string {
        return stringify(this.data);
    }
}
