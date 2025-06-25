
export type EnumObject = { [key: string]: string | number; }
export type EnumValue<E extends EnumObject> = E extends { [key: string]: string | infer V; } ? V : never;

export function getEnumValues<E extends EnumObject>(e: E): Array<EnumValue<E>> {
    return Object.keys(e).filter(key => Number.isNaN(Number(key))).map(key => e[key] as EnumValue<E>);
}
