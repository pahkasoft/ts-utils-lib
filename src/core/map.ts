
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
}

export class Map2<KEY1, KEY2, VALUE> {
    private map1 = new Map<KEY1, Map<KEY2, VALUE>>();

    constructor() { }

    set(key1: KEY1, key2: KEY2, value: VALUE): VALUE {
        let map2 = this.map1.get(key1);
        if (!map2) {
            this.map1.set(key1, map2 = new Map());
        }
        map2.set(key2, value);
        return value;
    }

    get(key1: KEY1, key2: KEY2): VALUE | undefined {
        let map2 = this.map1.get(key1);
        if (!map2) {
            return undefined;
        }
        return map2.get(key2);
    }

    has(key1: KEY1, key2: KEY2): boolean {
        let map2 = this.map1.get(key1);
        if (!map2) {
            return false;
        }
        return map2.has(key2);
    }

    delete(key1: KEY1, key2: KEY2): boolean {
        let map2 = this.map1.get(key1);
        if (!map2) {
            return false;
        }
        return map2.delete(key2);
    }
}

export class Map3<KEY1, KEY2, KEY3, VALUE> {
    private map1 = new Map<KEY1, Map<KEY2, Map<KEY3, VALUE>>>();

    constructor() { }

    set(key1: KEY1, key2: KEY2, key3: KEY3, value: VALUE): VALUE {
        let map2 = this.map1.get(key1);
        if (!map2) {
            this.map1.set(key1, map2 = new Map());
        }
        let map3 = map2.get(key2);
        if (!map3) {
            map2.set(key2, map3 = new Map());
        }
        map3.set(key3, value);
        return value;
    }

    get(key1: KEY1, key2: KEY2, key3: KEY3): VALUE | undefined {
        let map2 = this.map1.get(key1);
        if (!map2) {
            return undefined;
        }
        let map3 = map2.get(key2);
        if (!map3) {
            return undefined;
        }
        return map3.get(key3);
    }

    has(key1: KEY1, key2: KEY2, key3: KEY3): boolean {
        let map2 = this.map1.get(key1);
        if (!map2) {
            return false;
        }
        let map3 = map2.get(key2);
        if (!map3) {
            return false;
        }
        return map3.has(key3);
    }

    delete(key1: KEY1, key2: KEY2, key3: KEY3): boolean {
        let map2 = this.map1.get(key1);
        if (!map2) {
            return false;
        }
        let map3 = map2.get(key2);
        if (!map3) {
            return false;
        }
        return map3.delete(key3);
    }
}
