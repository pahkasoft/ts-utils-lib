import { DefaultArray } from "./default-array";

describe("DefaultArray", () => {
    it("initializes with array of values", () => {
        const arr = new DefaultArray<number>([1, 2, 3], 2);
        expect(arr.size).toBe(3);
        expect(arr.toArray()).toEqual([1, 2, 3]);
        expect(arr.isDefault(0)).toBe(false);
        expect(arr.isDefault(1)).toBe(true);
    });

    it("initializes with default values", () => {
        const arr = new DefaultArray<number>(3, 0);
        expect(arr.size).toBe(3);
        expect(arr.toArray()).toEqual([0, 0, 0]);
        expect(arr.isDefault(0)).toBe(true);
    });

    it("set() and get() work", () => {
        const arr = new DefaultArray<string>(2, "");
        arr.set(1, "hi");
        expect(arr.get(1)).toBe("hi");
        expect(arr.isSet(1)).toBe(true);
        expect(arr.isDefault(0)).toBe(true);
    });

    it("get() throws on invalid index", () => {
        const arr = new DefaultArray<number>(1, 0);
        expect(() => arr.get(-1)).toThrow();
        expect(() => arr.get(1)).toThrow();
    });

    it("getOrDefault() returns alternate default", () => {
        const arr = new DefaultArray<number>(2, 0);
        expect(arr.getOrDefault(0, 99)).toBe(99);
        arr.set(0, 5);
        expect(arr.getOrDefault(0, 99)).toBe(5);
    });

    it("getOrCreate() with direct value", () => {
        const arr = new DefaultArray<number>(2, 0);
        const val1 = arr.getOrCreate(1, 42);
        const val2 = arr.getOrCreate(1, 99);
        expect(val1).toBe(42);
        expect(val2).toBe(42); // should not overwrite
    });

    it("getOrCreate() with function", () => {
        const arr = new DefaultArray<number>(2, 0);
        const created = arr.getOrCreate(1, () => 123);
        expect(created).toBe(123);
        expect(arr.get(1)).toBe(123);
    });

    it("delete() resets to default", () => {
        const arr = new DefaultArray<number>(2, 0);
        arr.set(0, 99);
        expect(arr.delete(0)).toBe(true);
        expect(arr.get(0)).toBe(0);
        expect(arr.delete(0)).toBe(false);
    });

    it("clear() fills with default or empties", () => {
        const arr = new DefaultArray<number>(3, 0);
        arr.set(1, 2);
        arr.clear();
        expect(arr.toArray()).toEqual([0, 0, 0]);
        arr.clear(true);
        expect(arr.length).toBe(0);
    });

    it("forEach() iterates correctly", () => {
        const arr = new DefaultArray<number>(3, 0);
        arr.set(1, 2);
        const result: [number, number][] = [];
        arr.forEach((v, i) => result.push([i, v]));
        expect(result).toEqual([[0, 0], [1, 2], [2, 0]]);
    });

    it("entries(), values(), indices() yield expected", () => {
        const arr = new DefaultArray<number>(2, 0);
        arr.set(1, 5);
        expect([...arr.entries()]).toEqual([[0, 0], [1, 5]]);
        expect([...arr.values()]).toEqual([0, 5]);
        expect([...arr.indices()]).toEqual([0, 1]);
    });

    it("clone() creates deep copy", () => {
        const arr = new DefaultArray<number>(2, 0);
        arr.set(1, 99);
        const clone = arr.clone();
        expect(clone).not.toBe(arr);
        expect(clone.toArray()).toEqual([0, 99]);
        clone.set(1, 100);
        expect(arr.get(1)).toBe(99); // original unaffected
    });

    it("merge() copies values and respects defaultValue", () => {
        const a = new DefaultArray<number>(3, 0);
        const b = new DefaultArray<number>(3, 0);
        b.set(1, 5);
        a.merge(b);
        expect(a.toArray()).toEqual([0, 5, 0]);
    });

    it("merge() throws on different defaultValue", () => {
        const a = new DefaultArray<number>(2, 0);
        const b = new DefaultArray<number>(2, -1);
        expect(() => a.merge(b)).toThrow();
    });

    it("merge() uses conflictResolver", () => {
        const a = new DefaultArray<number>(2, 0);
        const b = new DefaultArray<number>(2, 0);
        a.set(1, 10);
        b.set(1, 20);
        a.merge(b, (oldV, newV) => oldV + newV);
        expect(a.get(1)).toBe(30);
    });

    it("filter() keeps matching entries", () => {
        const arr = new DefaultArray<number>(3, 0);
        arr.set(0, 1);
        arr.set(2, 3);
        const filtered = arr.filter(v => v > 1);
        expect(filtered.toArray()).toEqual([0, 0, 3]);
    });

    it("map() transforms values", () => {
        const arr = new DefaultArray<number>(3, 0);
        arr.set(1, 2);
        const mapped = arr.map(v => v * 2, 0);
        expect(mapped.toArray()).toEqual([0, 4, 0]);
    });

    it("reduce() without init uses first element", () => {
        const arr = new DefaultArray<number>(3, 0);
        arr.set(0, 1);
        arr.set(1, 2);
        arr.set(2, 3);
        const sum = arr.reduce((acc, v) => acc + v);
        expect(sum).toBe(6);
    });

    it("reduce() with init", () => {
        const arr = new DefaultArray<number>(3, 0);
        arr.set(1, 2);
        arr.set(2, 3);
        const sum = arr.reduce((acc, v) => acc + v, 10);
        expect(sum).toBe(15);
    });

    it("some() and every() behave correctly", () => {
        const arr = new DefaultArray<number>(3, 0);
        arr.set(1, 5);
        expect(arr.some(v => v > 0)).toBe(true);
        expect(arr.every(v => v >= 0)).toBe(true);
        expect(arr.every(v => v > 0)).toBe(false);
    });

    it("equals() compares arrays", () => {
        const a = new DefaultArray<number>(2, 0);
        const b = new DefaultArray<number>(2, 0);
        expect(a.equals(b)).toBe(true);
        b.set(1, 1);
        expect(a.equals(b)).toBe(false);
    });

    it("toString() produces readable format", () => {
        const arr = new DefaultArray<number>(4, 5);
        arr.set(1, 42);
        expect(arr.toString()).toBe("[ 5, 42, 5, 5 ]");
    });

});

