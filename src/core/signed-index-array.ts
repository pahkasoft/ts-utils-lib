import { isFunction } from "../utils/is";
import { isInteger } from "../utils/math";

/**
 * An array-like structure for signed indexes, including negatives.
 */
export class SignedIndexArray<EL> {
    private static toNegIndex(id: number): number {
        return -id - 1;
    }

    private static validateIndex(id: number): number {
        if (!isInteger(id)) throw new Error(`Invalid index ${id} - must be an integer!`);
        return id;
    }

    // for indexes >= 0
    private posEl: EL[];
    private hasPos: boolean[];
    // for indexes < 0
    private negEl: EL[];
    private hasNeg: boolean[];
    // number of elems
    private elCount: number;

    constructor();
    constructor(arr: SignedIndexArray<EL>)
    constructor(entries: Iterable<[number, EL]>)
    constructor(entries?: SignedIndexArray<EL> | Iterable<[number, EL]>) {
        if (entries instanceof SignedIndexArray) {
            this.negEl = entries.negEl.slice();
            this.hasNeg = entries.hasNeg.slice();
            this.posEl = entries.posEl.slice();
            this.hasPos = entries.hasPos.slice();
            this.elCount = entries.elCount;
        }
        else {
            this.negEl = [];
            this.hasNeg = [];
            this.posEl = [];
            this.hasPos = [];
            this.elCount = 0;

            if (entries) {
                for (const [id, el] of entries) {
                    this.set(id, el);
                }
            }
        }
    }

    get size(): number {
        return this.elCount;
    }

    private get posLen(): number {
        return this.hasPos.length;
    }

    private get negLen(): number {
        return this.hasNeg.length;
    }

    has(id: number): boolean {
        SignedIndexArray.validateIndex(id);

        if (id >= 0) {
            return this.hasPos[id] === true;
        }
        else {
            return this.hasNeg[SignedIndexArray.toNegIndex(id)] === true;
        }
    }

    set(id: number, el: EL): void {
        SignedIndexArray.validateIndex(id);

        if (id >= 0) {
            if (this.hasPos[id] !== true) this.elCount++;
            this.posEl[id] = el;
            this.hasPos[id] = true;
        }
        else {
            let negId = SignedIndexArray.toNegIndex(id);
            if (this.hasNeg[negId] !== true) this.elCount++;
            this.negEl[negId] = el;
            this.hasNeg[negId] = true;
        }
    }

    get(id: number): EL | undefined {
        SignedIndexArray.validateIndex(id);

        if (id >= 0) {
            return this.hasPos[id] ? this.posEl[id] : undefined;
        }
        else {
            let negId = SignedIndexArray.toNegIndex(id);
            return this.hasNeg[negId] ? this.negEl[negId] : undefined;
        }
    }

    getOrDefault(id: number, defaultValue: EL): EL {
        return this.get(id) ?? defaultValue;
    }

    getOrCreate(id: number, value: EL): EL;
    getOrCreate(id: number, creator: () => EL): EL;
    getOrCreate(id: number, creatorOrValue: EL | (() => EL)): EL {
        if (!this.has(id)) {
            const value = isFunction(creatorOrValue)
                ? creatorOrValue()
                : creatorOrValue;
            this.set(id, value);
            return value;
        }
        return this.get(id)!;
    }

    delete(id: number): boolean {
        SignedIndexArray.validateIndex(id);

        const isPos = id >= 0;
        const arr = isPos ? this.posEl : this.negEl;
        const has = isPos ? this.hasPos : this.hasNeg;
        const idx = isPos ? id : SignedIndexArray.toNegIndex(id);

        if (!has[idx]) return false;

        arr[idx] = undefined!;
        has[idx] = false;
        this.elCount--;
        return true;
    }

    clear(): void {
        this.negEl = [];
        this.hasNeg = [];
        this.posEl = [];
        this.hasPos = [];
        this.elCount = 0;
    }

    forEach(callbackfn: (el: EL, id: number, arr: SignedIndexArray<EL>) => void, thisArg?: any): void {
        for (const [id, el] of this.entries()) {
            callbackfn.call(thisArg, el, id, this);
        }
    }

    indices(): IterableIterator<number> {
        function* gen(self: SignedIndexArray<EL>): IterableIterator<number> {
            for (let id = self.negLen - 1; id >= 0; id--) {
                if (self.hasNeg[id]) yield SignedIndexArray.toNegIndex(id);
            }
            for (let id = 0; id < self.posLen; id++) {
                if (self.hasPos[id]) yield id;
            }
        }
        return gen(this);
    }

    indicesArray(): number[] {
        return [...this.indices()];
    }

    values(): IterableIterator<EL> {
        function* gen(self: SignedIndexArray<EL>): IterableIterator<EL> {
            for (let id = self.negLen - 1; id >= 0; id--) {
                if (self.hasNeg[id]) yield self.negEl[id];
            }
            for (let id = 0; id < self.posLen; id++) {
                if (self.hasPos[id]) yield self.posEl[id];
            }
        }
        return gen(this);
    }

    valuesArray(): EL[] {
        return [...this.values()];
    }

    *entries(): IterableIterator<[number, EL]> {
        for (let id = this.negLen - 1; id >= 0; id--) {
            if (this.hasNeg[id]) yield [SignedIndexArray.toNegIndex(id), this.negEl[id]];
        }
        for (let id = 0; id < this.posLen; id++) {
            if (this.hasPos[id]) yield [id, this.posEl[id]];
        }
    }

    entriesArray(): [number, EL][] {
        return [...this.entries()];
    }

    *[Symbol.iterator]() {
        yield* this.entries();
    }

    clone(): SignedIndexArray<EL> {
        return new SignedIndexArray(this);
    }

    merge(other: SignedIndexArray<EL>, conflictResolver?: (oldValue: EL, newValue: EL, id: number) => EL): this {
        for (const [id, value] of other.entries()) {
            if (this.has(id) && conflictResolver) {
                this.set(id, conflictResolver(this.get(id)!, value, id));
            }
            else {
                this.set(id, value);
            }
        }
        return this;
    }

    some(fn: (el: EL, id: number) => boolean): boolean {
        for (const [id, el] of this.entries()) {
            if (fn(el, id)) return true;
        }
        return false;
    }

    every(fn: (value: EL, key1: number) => boolean): boolean {
        for (const [id, el] of this.entries()) {
            if (!fn(el, id)) return false;
        }
        return true;
    }

    filter(fn: (value: EL, key1: number) => boolean): SignedIndexArray<EL> {
        let result = new SignedIndexArray<EL>();
        for (const [id, el] of this.entries()) {
            if (fn(el, id)) result.set(id, el);
        }
        return result;
    }

    reduce(fn: (acc: EL, el: EL, id: number) => EL): EL;
    reduce<R>(fn: (acc: R, el: EL, id: number) => R, init: R): R;
    reduce<R>(fn: (acc: R, el: EL, id: number) => R, init?: R): R {
        let iterator = this.entries();
        let first = iterator.next();

        if (first.done) {
            if (arguments.length < 2) {
                throw new TypeError("Reduce of empty SignedIndexArray with no initial value!");
            }
            return init!;
        }

        let acc: any;
        let start: IteratorResult<[number, EL]>;

        if (arguments.length < 2) {
            // no init → use first entry as accumulator
            acc = first.value[1];
            start = iterator.next();
        } else {
            acc = init;
            start = first;
        }

        for (let current = start; !current.done; current = iterator.next()) {
            const [id, el] = current.value;
            acc = fn(acc, el, id);
        }

        return acc;
    }

    mapToArray<R>(fn: (value: EL, key1: number) => R): R[] {
        let result: R[] = [];
        for (const [id, el] of this.entries()) {
            result.push(fn(el, id));
        }
        return result;
    }

    map<R = EL>(fn: (value: EL, key1: number) => R): SignedIndexArray<R> {
        let result = new SignedIndexArray<R>();
        for (const [id, el] of this.entries()) {
            result.set(id, fn(el, id));
        }
        return result;
    }

    equals(other: SignedIndexArray<EL>): boolean;
    equals(other: SignedIndexArray<EL>, eq: (a: EL, b: EL) => boolean): boolean;
    equals(other: SignedIndexArray<EL>, eq?: (a: EL, b: EL) => boolean): boolean {
        if (this.size !== other.size) return false;

        eq ??= (a, b) => a === b;

        const posLen = Math.max(this.posLen, other.posLen);
        for (let i = 0; i < posLen; ++i) {
            const hasA = this.hasPos[i];
            const hasB = other.hasPos[i];
            if (hasA !== hasB) return false;
            if (hasA && !eq(this.posEl[i], other.posEl[i])) return false;
        }

        const negLen = Math.max(this.negLen, other.negLen);
        for (let i = 0; i < negLen; ++i) {
            const hasA = this.hasNeg[i];
            const hasB = other.hasNeg[i];
            if (hasA !== hasB) return false;
            if (hasA && !eq(this.negEl[i], other.negEl[i])) return false;
        }

        return true;
    }

    toString(): string {
        const entries = this.entriesArray().map(([id, el]) => `${id}: ${el}`).join(', ');
        return `SignedIndexArray[ ${entries} ]`;
    }
}
