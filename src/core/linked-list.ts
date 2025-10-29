import { EqualityFn } from "./base";

export class LinkedListNode<V> {
    public value: V;
    public next: LinkedListNode<V> | null = null;
    public prev: LinkedListNode<V> | null = null;

    constructor(value: V) {
        this.value = value;
    }
}

export class LinkedList<V> implements Iterable<V> {
    private _head: LinkedListNode<V> | null = null;
    private _tail: LinkedListNode<V> | null = null;
    private _size = 0;
    private readonly equals: EqualityFn<V>;

    constructor(equals?: EqualityFn<V>) {
        // Default: strict equality
        this.equals = equals ?? ((a, b) => a === b);
    }

    get length(): number {
        return this._size;
    }

    get first(): V | undefined {
        return this._head?.value;
    }

    get last(): V | undefined {
        return this._tail?.value;
    }

    /** Add item to the end of the list */
    push(value: V): void {
        const node = new LinkedListNode(value);
        if (!this._tail) {
            this._head = this._tail = node;
        } else {
            node.prev = this._tail;
            this._tail.next = node;
            this._tail = node;
        }
        this._size++;
    }

    /** Remove item from the end of the list */
    pop(): V | undefined {
        if (!this._tail) return undefined;
        const value = this._tail.value;
        this._tail = this._tail.prev;
        if (this._tail) this._tail.next = null;
        else this._head = null;
        this._size--;
        return value;
    }

    /** Add item to the beginning of the list */
    unshift(value: V): void {
        const node = new LinkedListNode(value);
        if (!this._head) {
            this._head = this._tail = node;
        } else {
            node.next = this._head;
            this._head.prev = node;
            this._head = node;
        }
        this._size++;
    }

    /** Remove item from the beginning of the list */
    shift(): V | undefined {
        if (!this._head) return undefined;
        const value = this._head.value;
        this._head = this._head.next;
        if (this._head) this._head.prev = null;
        else this._tail = null;
        this._size--;
        return value;
    }

    /** Check if value exists in the list */
    has(value: V): boolean {
        for (let node = this._head; node; node = node.next) {
            if (this.equals(node.value, value)) return true;
        }
        return false;
    }

    /** Get value at index (O(n/2)) */
    get(index: number): V | undefined {
        return this.nodeAt(index)?.value;
    }

    /** Set value at index (O(n/2)) */
    set(index: number, value: V): boolean {
        const node = this.nodeAt(index);
        if (!node) return false;
        node.value = value;
        return true;
    }

    /** Insert value at index (O(n/2)) */
    insertAt(index: number, value: V): boolean {
        if (index < 0 || index > this._size) return false;
        if (index === 0) { this.unshift(value); return true; }
        if (index === this._size) { this.push(value); return true; }

        const nextNode = this.nodeAt(index);
        if (!nextNode) return false;
        const prevNode = nextNode.prev;

        const newNode = new LinkedListNode(value);
        newNode.next = nextNode;
        newNode.prev = prevNode;
        if (prevNode) prevNode.next = newNode;
        nextNode.prev = newNode;
        this._size++;
        return true;
    }

    /** Remove value at index (O(n/2)) */
    removeAt(index: number): V | undefined {
        const node = this.nodeAt(index);
        if (!node) return undefined;

        if (node.prev) node.prev.next = node.next;
        else this._head = node.next;

        if (node.next) node.next.prev = node.prev;
        else this._tail = node.prev;

        this._size--;
        return node.value;
    }

    /** Remove first matching value (O(n)) */
    remove(value: V): boolean {
        for (let node = this._head; node; node = node.next) {
            if (this.equals(node.value, value)) {
                if (node.prev) node.prev.next = node.next;
                else this._head = node.next;

                if (node.next) node.next.prev = node.prev;
                else this._tail = node.prev;

                this._size--;
                return true;
            }
        }
        return false;
    }

    /** Convert to array */
    toArray(): V[] {
        const result: V[] = [];
        for (const v of this) result.push(v);
        return result;
    }

    /** Replace contents from array */
    fromArray(values: Iterable<V>): void {
        this.clear();
        for (const v of values) this.push(v);
    }

    /** Clear all nodes */
    clear(): void {
        this._head = this._tail = null;
        this._size = 0;
    }

    /** Iterator support */
    *[Symbol.iterator](): Iterator<V> {
        let node = this._head;
        while (node) {
            yield node.value;
            node = node.next;
        }
    }

    toString(): string {
        return this._size === 0
            ? `LinkedList(0)[ ]`
            : `LinkedList(${this._size})[ ${this.toArray().join(", ")} ]`;
    }

    // ---- Private helpers ----
    private nodeAt(index: number): LinkedListNode<V> | null {
        if (index < 0 || index >= this._size) return null;
        let node: LinkedListNode<V> | null;
        if (index < this._size / 2) {
            node = this._head;
            for (let i = 0; i < index; i++) node = node!.next;
        } else {
            node = this._tail;
            for (let i = this._size - 1; i > index; i--) node = node!.prev;
        }
        return node;
    }
}
