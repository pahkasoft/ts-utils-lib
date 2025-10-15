
export class Map1<KEY1, VALUE> {
    private map1 = new Map<KEY1, VALUE>();

    constructor() { }

    set(key1: KEY1, value: VALUE): VALUE {
        this.map1.set(key1, value);
        return value;
    }

    get(key1: KEY1): VALUE | undefined {
        return this.map1.get(key1);
    }

    has(key1: KEY1): boolean {
        return this.map1.has(key1);
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

    forEach(callbackfn: (value: VALUE, key1: KEY1, map1: Map1<KEY1, VALUE>) => void, thisArg?: any): void {
        this.map1.forEach((value, key1) => callbackfn.call(thisArg, value, key1, this));
    }

    keys(): IterableIterator<KEY1> {
        return this.map1.keys();
    }

    values(): IterableIterator<VALUE> {
        return this.map1.values();
    }

    *entries(): IterableIterator<[KEY1, VALUE]> {
        for (const [key1, value] of this.map1)
            yield [key1, value];
    }

    *[Symbol.iterator]() {
        yield* this.entries();
    }
}

export class Map2<KEY1, KEY2, VALUE> {
    private map1 = new Map<KEY1, Map<KEY2, VALUE>>();

    constructor() { }

    set(key1: KEY1, key2: KEY2, value: VALUE): VALUE {
        let map2 = this.map1.get(key1) ?? this.map1.set(key1, new Map()).get(key1)!;
        map2.set(key2, value);
        return value;
    }

    get(key1: KEY1, key2: KEY2): VALUE | undefined {
        return this.map1.get(key1)?.get(key2);
    }

    has(key1: KEY1, key2: KEY2): boolean {
        return this.map1.get(key1)?.has(key2) ?? false;
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

    forEach(callbackfn: (value: VALUE, key1: KEY1, key2: KEY2, map2: Map2<KEY1, KEY2, VALUE>) => void, thisArg?: any): void {
        this.map1.forEach((map2, key1) => map2.forEach((value, key2) => callbackfn.call(thisArg, value, key1, key2, this)));
    }

    keys(): IterableIterator<[KEY1, KEY2]> {
        function* gen(map1: Map<KEY1, Map<KEY2, VALUE>>): IterableIterator<[KEY1, KEY2]> {
            for (const [k1, map2] of map1)
                for (const k2 of map2.keys())
                    yield [k1, k2];
        }
        return gen(this.map1);
    }

    values(): IterableIterator<VALUE> {
        function* gen(map1: Map<KEY1, Map<KEY2, VALUE>>): IterableIterator<VALUE> {
            for (const map2 of map1.values())
                for (const value of map2.values())
                    yield value;
        }
        return gen(this.map1);
    }
    *entries(): IterableIterator<[KEY1, KEY2, VALUE]> {
        for (const [key1, map2] of this.map1)
            for (const [key2, value] of map2)
                yield [key1, key2, value];
    }

    *[Symbol.iterator]() {
        yield* this.entries();
    }
}

export class Map3<KEY1, KEY2, KEY3, VALUE> {
    private map1 = new Map<KEY1, Map<KEY2, Map<KEY3, VALUE>>>();

    constructor() { }

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

    has(key1: KEY1, key2: KEY2, key3: KEY3): boolean {
        return this.map1.get(key1)?.get(key2)?.has(key3) ?? false;
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

    forEach(callbackfn: (value: VALUE, key1: KEY1, key2: KEY2, key3: KEY3, map2: Map3<KEY1, KEY2, KEY3, VALUE>) => void, thisArg?: any): void {
        this.map1.forEach((map2, key1) => map2.forEach((map3, key2) => map3.forEach((value, key3) => callbackfn.call(thisArg, value, key1, key2, key3, this))));
    }

    keys(): IterableIterator<[KEY1, KEY2, KEY3]> {
        function* gen(map1: Map<KEY1, Map<KEY2, Map<KEY3, VALUE>>>): IterableIterator<[KEY1, KEY2, KEY3]> {
            for (const [k1, map2] of map1)
                for (const [k2, map3] of map2)
                    for (const k3 of map3.keys())
                        yield [k1, k2, k3];
        }
        return gen(this.map1);
    }

    values(): IterableIterator<VALUE> {
        function* gen(map1: Map<KEY1, Map<KEY2, Map<KEY3, VALUE>>>): IterableIterator<VALUE> {
            for (const map2 of map1.values())
                for (const map3 of map2.values())
                    for (const value of map3.values())
                        yield value;
        }
        return gen(this.map1);
    }

    *entries(): IterableIterator<[KEY1, KEY2, KEY3, VALUE]> {
        for (const [key1, map2] of this.map1)
            for (const [key2, map3] of map2)
                for (const [key3, value] of map3)
                    yield [key1, key2, key3, value];
    }

    *[Symbol.iterator]() {
        yield* this.entries();
    }
}
