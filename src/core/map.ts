import { isFunction } from "../utils/is";
import { KVComponent } from "./kv-container";

export class Map1<KEY1, VALUE> implements KVComponent<[KEY1], VALUE> {
    private map1: Map<KEY1, VALUE>;

    constructor();
    constructor(map1: Map1<KEY1, VALUE>)
    constructor(entries: Iterable<[KEY1, VALUE]>)
    constructor(entries?: Map1<KEY1, VALUE> | Iterable<[KEY1, VALUE]>) {
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

    *[Symbol.iterator]() {
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
        const entries = [...this.map1].map(([k, v]) => `${k} => ${v}`).join(', ');
        return `Map1(${this.map1.size}) { ${entries} }`;
    }
}

export class Map2<KEY1, KEY2, VALUE> implements KVComponent<[KEY1, KEY2], VALUE> {
    private map1 = new Map<KEY1, Map<KEY2, VALUE>>();

    constructor();
    constructor(map2: Map2<KEY1, KEY2, VALUE>)
    constructor(entries: Iterable<[KEY1, KEY2, VALUE]>)
    constructor(entries?: Map2<KEY1, KEY2, VALUE> | Iterable<[KEY1, KEY2, VALUE]>) {
        if (entries instanceof Map2) {
            for (const [key1, inner] of entries.map1) {
                this.map1.set(key1, new Map(inner));
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
        let map2 = this.map1.get(key1) ?? this.map1.set(key1, new Map()).get(key1)!;
        map2.set(key2, value);
        return value;
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

    forEach(callbackfn: (value: VALUE, key1: KEY1, key2: KEY2, map2: Map2<KEY1, KEY2, VALUE>) => void, thisArg?: any): void {
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

    *[Symbol.iterator]() {
        yield* this.entries();
    }

    clone(): Map2<KEY1, KEY2, VALUE> {
        return new Map2(this);
    }

    merge(other: Map2<KEY1, KEY2, VALUE>, conflictResolver?: (oldValue: VALUE, newValue: VALUE, key1: KEY1, key2: KEY2) => VALUE): this {
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

    filter<S extends VALUE>(predicate: (value: VALUE, key1: KEY1, key2: KEY2, array: Map2<KEY1, KEY2, VALUE>) => value is S): Map2<KEY1, KEY2, S>;
    filter(predicate: (value: VALUE, key1: KEY1, key2: KEY2, array: Map2<KEY1, KEY2, VALUE>) => unknown): Map2<KEY1, KEY2, VALUE>;
    filter(predicate: (value: VALUE, key1: KEY1, key2: KEY2, array: Map2<KEY1, KEY2, VALUE>) => unknown) {
        // Preserve subclass type using the constructor
        const result = new (this.constructor as { new(): Map2<KEY1, KEY2, VALUE> })();
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

    mapValues<R = VALUE>(fn: (value: VALUE, key1: KEY1, key2: KEY2) => R): Map2<KEY1, KEY2, R> {
        let result = new Map2<KEY1, KEY2, R>();
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
            const inner = [...map2].map(([key2, v]) => `${key2} => ${v}`).join(', ');
            entries.push(`${key1} => { ${inner} }`);
        }
        return `Map2(${this.size}) { ${entries.join(', ')} }`;
    }
}

export class Map3<KEY1, KEY2, KEY3, VALUE> implements KVComponent<[KEY1, KEY2, KEY3], VALUE> {
    private map1 = new Map<KEY1, Map<KEY2, Map<KEY3, VALUE>>>();

    constructor();
    constructor(entries: Iterable<[KEY1, KEY2, KEY3, VALUE]>);
    constructor(map3: Map3<KEY1, KEY2, KEY3, VALUE>);
    constructor(entries?: Iterable<[KEY1, KEY2, KEY3, VALUE]> | Map3<KEY1, KEY2, KEY3, VALUE>) {
        if (entries instanceof Map3) {
            for (const [key1, map2] of entries.map1) {
                const newMap2 = new Map<KEY2, Map<KEY3, VALUE>>();
                for (const [key2, map3] of map2) {
                    newMap2.set(key2, new Map(map3));
                }
                this.map1.set(key1, newMap2);
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
        let map2 = this.map1.get(key1);
        if (!map2) this.map1.set(key1, (map2 = new Map()));
        let map3 = map2.get(key2);
        if (!map3) map2.set(key2, (map3 = new Map()));
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

    forEach(callbackfn: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3, map2: Map3<KEY1, KEY2, KEY3, VALUE>) => void, thisArg?: any): void {
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

    *[Symbol.iterator]() {
        yield* this.entries();
    }

    clone(): Map3<KEY1, KEY2, KEY3, VALUE> {
        return new Map3(this);
    }

    merge(other: Map3<KEY1, KEY2, KEY3, VALUE>, conflictResolver?: (oldValue: VALUE, newValue: VALUE, key1: KEY1, key2: KEY2, key3: KEY3) => VALUE): this {
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

    filter<S extends VALUE>(predicate: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3, array: Map3<KEY1, KEY2, KEY3, VALUE>) => value is S): Map3<KEY1, KEY2, KEY3, S>;
    filter(predicate: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3, array: Map3<KEY1, KEY2, KEY3, VALUE>) => unknown): Map3<KEY1, KEY2, KEY3, VALUE>;
    filter(predicate: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3, array: Map3<KEY1, KEY2, KEY3, VALUE>) => unknown) {
        // Preserve subclass type using the constructor
        const result = new (this.constructor as { new(): Map3<KEY1, KEY2, KEY3, VALUE> })();
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

    mapValues<R = VALUE>(fn: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3) => R): Map3<KEY1, KEY2, KEY3, R> {
        let result = new Map3<KEY1, KEY2, KEY3, R>();
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
                const inner = [...map3].map(([key3, v]) => `${key3} => ${v}`).join(', ');
                entries.push(`${key1} => ${key2} => { ${inner} }`);
            }
        }
        return `Map3(${this.size}) { ${entries.join(', ')} }`;
    }
}
