
export interface KVComponent<K extends any[], EL> {
    get size(): number;
    isEmpty(): boolean;
    has(...keys: K): boolean;
    get(...keys: K): EL | undefined;
    getOrDefault(...keysAndDefault: [...K, EL]): EL;
    getOrCreate(...keysAndCreator: [...K, EL]): EL;
    set(...keysAndValue: [...K, EL]): void;
    delete(...keys: K): boolean;
    clear?(): void;
    toString(): string;

    // Iterators for KVComponent.
    kvValues(): IterableIterator<EL>;
    kvKeys(): IterableIterator<K>;
    kvEntries(): IterableIterator<[K, EL]>;
}
