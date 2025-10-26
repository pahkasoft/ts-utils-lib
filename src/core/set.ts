import { isDeepEqual, isFunction } from "../guard";
import { formatValue } from "./format-value";
import { KVComponent } from "./kv-container";

/**
 * A Set-like structure that conforms to the KVComponent interface.
 * Methods like get(), set(), and getOrCreate() exist only for interface compatibility.
 * Use add(), has(), delete(), etc., for normal Set behavior.
 */
export abstract class SetBase<VALUE, CLS extends SetBase<VALUE, CLS> = any> implements KVComponent<[VALUE], VALUE> {
    protected data: Set<VALUE>;

    constructor(entries?: Iterable<VALUE>) {
        this.data = new Set(entries ?? []);

        /*
        this.keys = this.keys.bind(this);
        this.values = this.values.bind(this);
        this.entries = this.entries.bind(this);
        this.kvKeys = this.kvKeys.bind(this);
        this.kvValues = this.kvValues.bind(this);
        this.kvEntries = this.kvEntries.bind(this);
        */
    }

    protected abstract valueEquals(a: VALUE, b: VALUE): boolean;
    protected abstract createEmpty<R = VALUE>(): SetBase<R, any>;
    protected abstract getName(): string;

    has(value: VALUE): boolean {
        return this.some(v => this.valueEquals(v, value));
    }

    add(value: VALUE): VALUE {
        if (!this.has(value))
            this.data.add(value);
        return value;
    }

    /** @internal - This method exists only for interface `KVComponent` compatibility.*/
    set(key: VALUE, value: VALUE): void {
        if (!this.valueEquals(key, value))
            throw new TypeError("SetBase.set() requires key === value.");
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
        if (!this.has(value)) return false;
        for (const v of this.values()) {
            if (this.valueEquals(v, value)) {
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

    forEach(callbackfn: (value: VALUE, set1: SetBase<VALUE>) => void, thisArg?: any): void {
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

    clone(): SetBase<VALUE> {
        const result = this.createEmpty();
        for (const v of this.values()) result.add(v);
        return result;
    }

    merge(other: SetBase<VALUE>): this {
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

    filter<R extends VALUE>(predicate: (value: VALUE, set1: SetBase<VALUE, any>) => value is R): SetBase<R, any>;
    filter(predicate: (value: VALUE, set1: SetBase<VALUE>) => unknown): SetBase<VALUE, any>;
    filter(predicate: (value: VALUE, set1: SetBase<VALUE>) => unknown) {
        const result = this.createEmpty();
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
                throw new TypeError("Reduce of empty SetBase with no initial value!");
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

    mapValues<R = VALUE>(fn: (value: VALUE) => R): SetBase<R, any> {
        let result = this.createEmpty<R>();
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

    map<R = VALUE>(fn: (value: VALUE) => R): SetBase<R, any> {
        let result = this.createEmpty<R>();
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
        return `${this.getName()}(${this.size})${formatValue([...this.data])}`.replaceAll("  ", " ");
    }
}

export class Set1<VALUE> extends SetBase<VALUE, Set1<VALUE>> {
    constructor();
    constructor(set: SetBase<VALUE>)
    constructor(entries: Iterable<VALUE>)
    constructor(entries?: SetBase<VALUE> | Iterable<VALUE>) {
        super(entries);
    }

    protected createEmpty<R = VALUE>(): Set1<R> {
        return new Set1<R>();
    }

    protected valueEquals(a: VALUE, b: VALUE): boolean {
        return a === b;
    }

    protected getName(): string {
        return "Set1";
    }
}

export class DeepSet<VALUE> extends SetBase<VALUE, DeepSet<VALUE>> {
    constructor();
    constructor(set: SetBase<VALUE>)
    constructor(entries: Iterable<VALUE>)
    constructor(entries?: SetBase<VALUE> | Iterable<VALUE>) {
        super(entries);
    }

    protected createEmpty<R = VALUE>(): DeepSet<R> {
        return new DeepSet<R>();
    }

    protected valueEquals(a: VALUE, b: VALUE): boolean {
        return isDeepEqual(a, b);
    }

    protected getName(): string {
        return "DeepSet";
    }
}
