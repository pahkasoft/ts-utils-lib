import { stringify } from "../utils/str";
import { BaseContainer, KVComponent } from "./base";

/**
 * Wrapper class of a key-value container that contain array values.
 */
export class MultiContainer<K extends any[], V> extends BaseContainer {
    constructor(private readonly base: KVComponent<K, V[]>) {
        super();

        /*
        this.keys = this.keys.bind(this);
        this.values = this.values.bind(this);
        this.entries = this.entries.bind(this);
        this.iterAll = this.iterAll.bind(this);
        */
    }

    isEmpty(): boolean {
        return this.base.isEmpty();
    }

    clear(): void {
        this.base.clear?.();
    }

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
        yield* this.getAll(...keys);
    }

    *values(): IterableIterator<V> {
        for (const keys of this.keys()) {
            yield* this.getAll(...keys);
        }
    }

    *keys(): IterableIterator<K> {
        for (const keys of this.base.kvKeys()) {
            yield keys;
        }
    }

    *entries(): IterableIterator<[K, V[]]> {
        for (const keys of this.keys()) {
            const arr = this.getAll(...keys);
            if (arr.length > 0) yield [keys, arr];
        }
    }

    [Symbol.iterator](): IterableIterator<[K, V[]]> {
        return this.entries();
    }

    toString(): string {
        const entries: string[] = [];
        for (const keys of this.keys()) {
            const arr = this.getAll(...keys);
            const keyStr = Array.isArray(keys) ? stringify(keys) : '[ ]';
            const valuesStr = Array.isArray(arr) ? stringify(arr) : '[ ]';
            entries.push(`${keyStr} => ${valuesStr}`);
        }
        return entries.length === 0 ? `MultiContainer{ }` : `MultiContainer{ ${entries.join(', ')} }`;
    }
}

/**
 * Create a multi-container.
 * 
 * ```ts
 * // Usage:
 * const multi = asMulti(new Map2<string, string, number[]>());
 * multi.add("a", "b", 5);
 * multi.add("a", "b", 10);
 * multi.add("a", "c", 15);
 * ```
 * @param base 
 * @returns 
 */
export function asMulti<K extends any[], VALUE>(base: KVComponent<K, VALUE[]>): MultiContainer<K, VALUE> {
    return new MultiContainer(base);
}