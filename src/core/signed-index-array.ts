import { isFunction, isInteger } from "../utils/is";
import { KVComponent } from "./kv-container";

/**
 * An array-like structure for signed indexes, including negatives.
 */
export class SignedIndexArray<VALUE> implements KVComponent<[number], VALUE> {
    private static toNegIndex(id: number): number {
        return -id - 1;
    }

    private static validateIndex(id: number): number {
        if (!isInteger(id)) throw new Error(`Invalid index ${id} - must be an integer!`);
        return id;
    }

    // For indexes >= 0
    private posVal: VALUE[];
    private hasPos: boolean[];

    // For indexes < 0
    private negVal: VALUE[];
    private hasNeg: boolean[];

    // Number of values
    private valCount: number;

    constructor();
    constructor(arr: SignedIndexArray<VALUE>)
    constructor(entries: Iterable<[number, VALUE]>)
    constructor(entries?: SignedIndexArray<VALUE> | Iterable<[number, VALUE]>) {
        if (entries instanceof SignedIndexArray) {
            this.negVal = entries.negVal.slice();
            this.hasNeg = entries.hasNeg.slice();
            this.posVal = entries.posVal.slice();
            this.hasPos = entries.hasPos.slice();
            this.valCount = entries.valCount;
        }
        else {
            this.negVal = [];
            this.hasNeg = [];
            this.posVal = [];
            this.hasPos = [];
            this.valCount = 0;

            if (entries) {
                for (const [id, value] of entries) {
                    this.set(id, value);
                }
            }
        }

        /*
        this.indices = this.indices.bind(this);
        this.values = this.values.bind(this);
        this.entries = this.entries.bind(this);
        this.kvKeys = this.kvKeys.bind(this);
        this.kvValues = this.kvValues.bind(this);
        this.kvEntries = this.kvEntries.bind(this);
        */
    }

    get size(): number {
        return this.valCount;
    }

    isEmpty(): boolean {
        return this.size === 0;
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

    set(id: number, value: VALUE): void {
        SignedIndexArray.validateIndex(id);

        if (id >= 0) {
            if (this.hasPos[id] !== true) this.valCount++;
            this.posVal[id] = value;
            this.hasPos[id] = true;
        }
        else {
            let negId = SignedIndexArray.toNegIndex(id);
            if (this.hasNeg[negId] !== true) this.valCount++;
            this.negVal[negId] = value;
            this.hasNeg[negId] = true;
        }
    }

    get(id: number): VALUE | undefined {
        SignedIndexArray.validateIndex(id);

        if (id >= 0) {
            return this.hasPos[id] ? this.posVal[id] : undefined;
        }
        else {
            let negId = SignedIndexArray.toNegIndex(id);
            return this.hasNeg[negId] ? this.negVal[negId] : undefined;
        }
    }

    getOrDefault(id: number, defaultValue: VALUE): VALUE {
        return this.get(id) ?? defaultValue;
    }

    getOrCreate(id: number, value: VALUE): VALUE;
    getOrCreate(id: number, creator: () => VALUE): VALUE;
    getOrCreate(id: number, creatorOrValue: VALUE | (() => VALUE)): VALUE {
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
        const arr = isPos ? this.posVal : this.negVal;
        const has = isPos ? this.hasPos : this.hasNeg;
        const idx = isPos ? id : SignedIndexArray.toNegIndex(id);

        if (!has[idx]) return false;

        arr[idx] = undefined!;
        has[idx] = false;
        this.valCount--;
        return true;
    }

    clear(): void {
        this.negVal = [];
        this.hasNeg = [];
        this.posVal = [];
        this.hasPos = [];
        this.valCount = 0;
    }

    forEach(callbackfn: (value: VALUE, id: number, arr: SignedIndexArray<VALUE>) => void, thisArg?: any): void {
        for (const [id, value] of this.entries()) {
            callbackfn.call(thisArg, value, id, this);
        }
    }

    *indices(): IterableIterator<number> {
        for (let id = this.negLen - 1; id >= 0; id--) {
            if (this.hasNeg[id]) yield SignedIndexArray.toNegIndex(id);
        }
        for (let id = 0; id < this.posLen; id++) {
            if (this.hasPos[id]) yield id;
        }
    }

    *values(): IterableIterator<VALUE> {
        for (let id = this.negLen - 1; id >= 0; id--) {
            if (this.hasNeg[id]) yield this.negVal[id];
        }
        for (let id = 0; id < this.posLen; id++) {
            if (this.hasPos[id]) yield this.posVal[id];
        }
    }

    *entries(): IterableIterator<[number, VALUE]> {
        for (let id = this.negLen - 1; id >= 0; id--) {
            if (this.hasNeg[id]) yield [SignedIndexArray.toNegIndex(id), this.negVal[id]];
        }
        for (let id = 0; id < this.posLen; id++) {
            if (this.hasPos[id]) yield [id, this.posVal[id]];
        }
    }

    indicesArray(): number[] {
        return [...this.indices()];
    }

    valuesArray(): VALUE[] {
        return [...this.values()];
    }

    entriesArray(): [number, VALUE][] {
        return [...this.entries()];
    }

    *kvKeys(): IterableIterator<[number]> {
        for (const id of this.indices()) {
            yield [id];
        }
    }

    *kvValues(): IterableIterator<VALUE> {
        for (const value of this.values()) {
            yield value;
        }
    }

    *kvEntries(): IterableIterator<[[number], VALUE]> {
        for (const [id, value] of this.entries()) {
            yield [[id], value];
        }
    }

    *[Symbol.iterator]() {
        yield* this.entries();
    }

    clone(): SignedIndexArray<VALUE> {
        return new SignedIndexArray(this);
    }

    merge(other: SignedIndexArray<VALUE>, conflictResolver?: (oldValue: VALUE, newValue: VALUE, id: number) => VALUE): this {
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

    some(fn: (value: VALUE, id: number) => boolean): boolean {
        for (const [id, value] of this.entries()) {
            if (fn(value, id)) return true;
        }
        return false;
    }

    every(fn: (value: VALUE, key1: number) => boolean): boolean {
        for (const [id, value] of this.entries()) {
            if (!fn(value, id)) return false;
        }
        return true;
    }

    filter(fn: (value: VALUE, key1: number) => boolean): SignedIndexArray<VALUE> {
        let result = new SignedIndexArray<VALUE>();
        for (const [id, value] of this.entries()) {
            if (fn(value, id)) result.set(id, value);
        }
        return result;
    }

    reduce(fn: (acc: VALUE, value: VALUE, id: number) => VALUE): VALUE;
    reduce<R>(fn: (acc: R, value: VALUE, id: number) => R, init: R): R;
    reduce<R>(fn: (acc: R, value: VALUE, id: number) => R, init?: R): R {
        let iterator = this.entries();
        let first = iterator.next();

        if (first.done) {
            if (arguments.length < 2) {
                throw new TypeError("Reduce of empty SignedIndexArray with no initial value!");
            }
            return init!;
        }

        let acc: any;
        let start: IteratorResult<[number, VALUE]>;

        if (arguments.length < 2) {
            // no init → use first entry as accumulator
            acc = first.value[1];
            start = iterator.next();
        } else {
            acc = init;
            start = first;
        }

        for (let current = start; !current.done; current = iterator.next()) {
            const [id, value] = current.value;
            acc = fn(acc, value, id);
        }

        return acc;
    }

    mapToArray<R>(fn: (value: VALUE, key1: number) => R): R[] {
        let result: R[] = [];
        for (const [id, value] of this.entries()) {
            result.push(fn(value, id));
        }
        return result;
    }

    map<R = VALUE>(fn: (value: VALUE, key1: number) => R): SignedIndexArray<R> {
        let result = new SignedIndexArray<R>();
        for (const [id, value] of this.entries()) {
            result.set(id, fn(value, id));
        }
        return result;
    }

    equals(other: SignedIndexArray<VALUE>): boolean;
    equals(other: SignedIndexArray<VALUE>, eq: (a: VALUE, b: VALUE) => boolean): boolean;
    equals(other: SignedIndexArray<VALUE>, eq?: (a: VALUE, b: VALUE) => boolean): boolean {
        if (this.size !== other.size) return false;

        eq ??= (a, b) => a === b;

        const posLen = Math.max(this.posLen, other.posLen);
        for (let i = 0; i < posLen; ++i) {
            const hasA = this.hasPos[i];
            const hasB = other.hasPos[i];
            if (hasA !== hasB) return false;
            if (hasA && !eq(this.posVal[i], other.posVal[i])) return false;
        }

        const negLen = Math.max(this.negLen, other.negLen);
        for (let i = 0; i < negLen; ++i) {
            const hasA = this.hasNeg[i];
            const hasB = other.hasNeg[i];
            if (hasA !== hasB) return false;
            if (hasA && !eq(this.negVal[i], other.negVal[i])) return false;
        }

        return true;
    }

    toString(): string {
        if (this.size === 0) return `SignedIndexArray[ ]`;
        const entries = this.entriesArray().map(([id, value]) => `${id}: ${value}`).join(', ');
        return `SignedIndexArray[ ${entries} ]`;
    }
}
