import { isFunction } from "../guard";
import { Assert } from "..";
import { formatValue } from "./format-value";

export class Stack<T> {
    private readonly data: T[] = [];

    private assertId(id: number): number {
        Assert.isIntegerBetween(id, 0, this.length - 1, `Stack index ${id} out of range.`);
        return id;
    }

    get length() {
        return this.data.length;
    }

    push(el: T) {
        this.data.push(el);
        return el;
    }

    pop(): T {
        this.assertId(this.length - 1);
        return this.data.pop()!;
    }

    popOrUndef(): T | undefined {
        return this.data.pop();
    }

    popOr(defaultValueOrCreator: T | (() => T)): T {
        return this.isEmpty()
            ? (isFunction(defaultValueOrCreator) ? defaultValueOrCreator() : defaultValueOrCreator)
            : this.data.pop()!;
    }

    top() {
        return this.data[this.assertId(this.length - 1)];
    }

    topOrUndef(): T | undefined {
        return this.data[this.length - 1];
    }

    topOr(defaultValueOrCreator: T | (() => T)): T {
        return this.isEmpty()
            ? (isFunction(defaultValueOrCreator) ? defaultValueOrCreator() : defaultValueOrCreator)
            : this.data[this.length - 1];
    }

    peek(depth = 0): T {
        return this.data[this.assertId(this.data.length - 1 - depth)];
    }

    peekOrUndef(depth = 0): T | undefined {
        return this.data[this.data.length - 1 - depth];

    }

    peekOr(depth = 0, defaultValueOrCreator: T | (() => T)): T {
        const id = this.data.length - 1 - depth;
        const value = id < 0 ? undefined : this.data[id];
        return value === undefined
            ? (isFunction(defaultValueOrCreator) ? defaultValueOrCreator() : defaultValueOrCreator)
            : value;
    }

    *values(): IterableIterator<T> {
        for (let id = this.data.length - 1; id >= 0; id--)
            yield this.data[id];
    }

    *[Symbol.iterator](): IterableIterator<T> {
        yield* this.values();
    }

    toArray(): T[] {
        return [...this.data];
    }

    isEmpty(): boolean {
        return this.length === 0;
    }

    clear() {
        this.data.length = 0;
    }

    toString() {
        return `Stack(${this.length})${formatValue(this.data)}`;
    }
}
