import { isInteger } from "../../utils/is";

/**
 * A cache-like structure optimized for small-range integer keys, including negatives.
 *
 * Internally implemented using two sparse arrays: one for non-negative keys,
 * and one for negative keys (stored by index `-key - 1`).
 *
 * @remarks
 * - Fast access for small integer keys.
 * - Not suitable for large or sparse key ranges — memory usage may grow significantly.
 * - Supports `get`, `set`, `delete`, `has` and `clear`
 *
 * @example
 * ```ts
 * const cache = new SmallIntCache<string>();
 * cache.set(-2, 'A');
 * cache.set(3, 'B');
 * console.log(cache.get(-2)); // 'A'
 * ```
 * 
 * @deprecated - Same functionality an more is available now in SignedIndexArray<VALUE> and IndexArray<VALUE> containers.
 */
export class SmallIntCache<VALUE> {
    private pos: VALUE[]; // for keys >= 0
    private neg: VALUE[]; // for keys < 0

    constructor() {
        this.pos = [];
        this.neg = [];
    }

    set(key: number, value: VALUE): void {
        if (!isInteger(key)) {
            throw new Error("Key must be an integer");
        }
        else if (key >= 0) {
            this.pos[key] = value;
        }
        else {
            this.neg[-key - 1] = value; // e.g., key = -1 => index = 0
        }
    }

    get(key: number): VALUE | undefined {
        if (!isInteger(key)) {
            throw new Error("Key must be an integer");
        }
        else if (key >= 0) {
            return this.pos[key];
        }
        else {
            return this.neg[-key - 1];
        }
    }

    has(key: number): boolean {
        if (!isInteger(key)) {
            return false;
        }
        else if (key >= 0) {
            return key in this.pos;
        }
        else {
            return (-key - 1) in this.neg;
        }
    }

    delete(key: number): void {
        if (!isInteger(key)) {
            return;
        }
        else if (key >= 0) {
            delete this.pos[key];
        }
        else {
            delete this.neg[-key - 1];
        }
    }

    clear(): void {
        this.pos = [];
        this.neg = [];
    }
}
