import { Assert } from "../modules/assert";

export class Stack<T> {
    private readonly list: T[] = [];

    push(e: T) {
        this.list.push(e);
        return e;
    }

    pop(): T {
        Assert.int_gt(this.list.length, 0);
        return this.list.pop()!;
    }

    top() {
        return Assert.array_elem(this.list, this.list.length - 1, "Stack is empty!");
    }

    toArray() {
        return this.list;
    }

    get length() {
        return this.list.length;
    }

    clear() {
        this.list.length = 0;
    }
}
