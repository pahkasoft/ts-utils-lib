import { isFunction } from "../utils/is";
import { isInteger } from "../utils/math";

const negId = (id: number) => -id - 1;

/**
 * An array-like structure for signed indexes, including negatives.
 */
export class SignedIndexArray<EL> {
    private pos: EL[]; // for indexes >= 0
    private hasPos: boolean[]; // for indexes >= 0
    private neg: EL[]; // for indexes < 0
    private hasNeg: boolean[]; // for indexes < 0

    constructor();
    constructor(arr: SignedIndexArray<EL>)
    constructor(entries: Iterable<[number, EL]>)
    constructor(entries?: SignedIndexArray<EL> | Iterable<[number, EL]>) {
        if (entries instanceof SignedIndexArray) {
            this.neg = entries.neg.slice();
            this.hasNeg = entries.hasNeg.slice();
            this.pos = entries.pos.slice();
            this.hasPos = entries.hasPos.slice();
        }
        else {
            this.neg = [];
            this.hasNeg = [];
            this.pos = [];
            this.hasPos = [];
            if (entries) {
                for (const [id, el] of entries) {
                    this.set(id, el);
                }
            }
        }
    }

    has(id: number): boolean {
        if (!isInteger(id)) {
            return false;
        }
        else if (id >= 0) {
            return this.hasPos[id] === true;
        }
        else {
            return this.hasNeg[negId(id)] === true;
        }
    }

    set(id: number, el: EL): void {
        if (!isInteger(id)) {
            throw new Error("Index must be an integer");
        }
        else if (id >= 0) {
            this.pos[id] = el;
            this.hasPos[id] = true;
        }
        else {
            this.neg[negId(id)] = el;
            this.hasNeg[negId(id)] = true;
        }
    }

    get(id: number): EL | undefined {
        if (!isInteger(id)) {
            throw new Error("Index must be an integer");
        }
        else if (id >= 0) {
            return this.hasPos[id] ? this.pos[id] : undefined;
        }
        else {
            return this.hasNeg[negId(id)] ? this.neg[negId(id)] : undefined;
        }
    }

    getOrDefault(id: number, defaultValue: EL): EL {
        return this.get(id) ?? defaultValue;
    }

    getOrCreate(id: number, value: EL): EL;
    getOrCreate(id: number, creator: () => EL): EL;
    getOrCreate(id: number, creatorOrValue: EL | (() => EL)): EL {
        let value = this.get(id);
        if (!value) {
            if (isFunction(creatorOrValue)) {
                this.set(id, value = creatorOrValue());
            }
            else {
                this.set(id, value = creatorOrValue);
            }
        }
        return value;
    }

    delete(id: number): boolean {
        if (!isInteger(id)) {
            return false;
        }
        else if (id >= 0) {
            if (this.hasPos[id]) {
                this.pos[id] = undefined!;
                this.hasPos[id] = false;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (this.hasNeg[negId(id)]) {
                this.neg[negId(id)] = undefined!;
                this.hasNeg[negId(id)] = false;
                return true;
            }
            else {
                return false;
            }
        }
    }

    clear(): void {
        this.neg = [];
        this.hasNeg = [];
        this.pos = [];
        this.hasPos = [];
    }

    forEach(callbackfn: (el: EL, id: number, arr: SignedIndexArray<EL>) => void, thisArg?: any): void {
        for (const [id, el] of this.entries()) {
            callbackfn.call(thisArg, el, id, this);
        }
    }

    indices(): IterableIterator<number> {
        function* gen(self: SignedIndexArray<EL>): IterableIterator<number> {
            for (let id = self.neg.length - 1; id >= 0; id--) {
                if (self.hasNeg[id]) yield negId(id);
            }
            for (let id = 0; id < self.pos.length; id++) {
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
            for (let id = self.neg.length - 1; id >= 0; id--) {
                if (self.hasNeg[id]) yield self.neg[id];
            }
            for (let id = 0; id < self.pos.length; id++) {
                if (self.hasPos[id]) yield self.pos[id];
            }
        }
        return gen(this);
    }

    valuesArray(): EL[] {
        return [...this.values()];
    }

    *entries(): IterableIterator<[number, EL]> {
        for (let id = this.neg.length - 1; id >= 0; id--) {
            if (this.hasNeg[id]) yield [negId(id), this.neg[id]];
        }
        for (let id = 0; id < this.pos.length; id++) {
            if (this.hasPos[id]) yield [id, this.pos[id]];
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

    reduce<R>(fn: (acc: R, el: EL, id: number) => R, init: R): R {
        let acc = init;
        for (const [id, el] of this.entries()) {
            acc = fn(acc, el, id);
        }
        return acc;
    }

    mapEntries<R>(fn: (value: EL, key1: number) => R): R[] {
        let result: R[] = [];
        for (const [id, el] of this.entries()) {
            result.push(fn(el, id));
        }
        return result;
    }

    mapValues<R = EL>(fn: (value: EL, key1: number) => R): SignedIndexArray<R> {
        let result = new SignedIndexArray<R>();
        for (const [id, el] of this.entries()) {
            result.set(id, fn(el, id));
        }
        return result;
    }

    toString(): string {
        const entries = this.entriesArray().map(([id, el]) => `${id}: ${el}`).join(', ');
        return `SignedIndexArray[ ${entries} ]`;
    }
}
