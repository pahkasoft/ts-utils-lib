
export type EnumObject = Record<string, string | number>;
export type EnumKey<E extends EnumObject> = keyof E;
export type EnumValue<E extends EnumObject> = E[EnumKey<E>];

export function getEnumKeys<E extends EnumObject>(e: E): EnumKey<E>[] {
    return Object.keys(e).filter(k => isNaN(Number(k))) as EnumKey<E>[];
}

export function getEnumValues<E extends EnumObject>(e: E): EnumValue<E>[] {
    return getEnumKeys(e).map(k => e[k]);
}

export function getEnumEntries<E extends EnumObject>(e: E): [keyof E, EnumValue<E>][] {
    return getEnumKeys(e).map(k => [k, e[k]] as [keyof E, EnumValue<E>]);
}

export function getEnumKey<E extends EnumObject>(e: E, value: EnumValue<E>): keyof E | undefined {
    return getEnumKeys(e).find(k => e[k] === value);
}

export function forEachEnum<E extends EnumObject>(
    e: E,
    callback: (key: keyof E, value: E[keyof E]) => void
): void {
    for (const [k, v] of getEnumEntries(e)) callback(k, v);
}
