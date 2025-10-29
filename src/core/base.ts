export type EqualityFn<V> = (a: V, b: V) => boolean;
export const DefaultEqualityFn: EqualityFn<any> = (a: any, b: any) => a === b;

export interface KVComponent<K extends any[], VALUE> {
    get size(): number;
    isEmpty(): boolean;
    has(...keys: K): boolean;
    get(...keys: K): VALUE | undefined;
    getOrDefault(...keysAndDefault: [...K, VALUE]): VALUE;
    getOrCreate(...keysAndCreator: [...K, VALUE]): VALUE;
    set(...keysAndValue: [...K, VALUE]): void;
    delete(...keys: K): boolean;
    clear?(): void;
    toString(): string;

    // Iterators for KVComponent.
    kvValues(): IterableIterator<VALUE>;
    kvKeys(): IterableIterator<K>;
    kvEntries(): IterableIterator<[K, VALUE]>;
}

export abstract class BaseContainer {
    abstract toString(): string;
}
