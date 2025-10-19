
export interface KVComponent<K extends any[], V> {
    get size(): number;
    has(...keys: K): boolean;
    get(...keys: K): V | undefined;
    getOrDefault(...keysAndDefault: [...K, V]): V;
    getOrCreate(...keysAndCreator: [...K, V]): V;
    set(...keysAndValue: [...K, V]): void;
    delete(...keys: K): boolean;
    clear(): void;
    toString(): string;
}
