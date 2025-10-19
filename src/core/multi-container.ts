import { KVComponent } from "./kv-container";

export class MultiContainer<K extends any[], V> {
    constructor(private readonly base: KVComponent<K, V[]>) { }

    add(...keysAndValue: [...K, V]): V {
        const keys = keysAndValue.slice(0, -1) as K;
        const value = keysAndValue[keysAndValue.length - 1] as V;
        const arr = this.base.get(...keys);
        this.base.set(...([...keys, arr ? [...arr, value] : [value]] as [...K, V[]]));
        return value;
    }

    remove(...keysAndValue: [...K, V]): boolean {
        const keys = keysAndValue.slice(0, -1) as K;
        const value = keysAndValue[keysAndValue.length - 1] as V;
        const arr = this.base.get(...keys);
        if (!arr) return false;
        const i = arr.indexOf(value);
        if (i === -1) return false;
        arr.splice(i, 1);
        if (arr.length === 0) this.base.delete(...keys);
        return true;
    }

    getAll(...keys: K): V[] {
        return this.base.get(...keys) ?? [];
    }

    *iterAll(...keys: K): IterableIterator<V> {
        const arr = this.getAll(...keys);
        for (const v of arr) {
            yield v;
        }
    }

    clear(): void {
        this.base.clear?.();
    }
}

/**
 * ```ts
 * // Usage:
 * const multi = asMulti(new Map2<string, string, number[]>());
 * multi.add("A", "B", 5);
 * ```
 * @param base 
 * @returns 
 */
export function asMulti<K extends any[], EL>(base: KVComponent<K, EL[]>): MultiContainer<K, EL> {
    return new MultiContainer(base);
}