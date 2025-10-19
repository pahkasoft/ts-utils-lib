export interface KVComponent<K extends any[], EL> {
    get size(): number;
    has(...keys: K): boolean;
    get(...keys: K): EL | undefined;
    getOrDefault(...keysAndDefault: [...K, EL]): EL;
    getOrCreate(...keysAndCreator: [...K, EL]): EL;
    set(...keysAndValue: [...K, EL]): void;
    delete(...keys: K): boolean;
    clear?(): void;
    toString(): string;
}