
export function getMapKeys<K, V>(map: Map<K, V>): K[] {
    let keys: K[] = [];
    map.forEach((value: V, key: K) => keys.push(key));
    return keys;
}
