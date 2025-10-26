import { Set1 } from "./set1";

describe("Set1", () => {
    let set: Set1<string>;

    beforeEach(() => {
        set = new Set1<string>();
    });

    it("adds and checks values", () => {
        expect(set.size).toBe(0);
        set.add("a");
        expect(set.size).toBe(1);
        expect(set.has("a")).toBeTrue();
    });

    it("does not add duplicate values", () => {
        set.add("x");
        set.add("x");
        expect(set.size).toBe(1);
    });

    it("deletes values", () => {
        set.add("a");
        set.add("b");
        expect(set.delete("a")).toBeTrue();
        expect(set.has("a")).toBeFalse();
        expect(set.size).toBe(1);
    });

    it("clears all values", () => {
        set.add("a");
        set.add("b");
        set.clear();
        expect(set.size).toBe(0);
        expect([...set.values()]).toEqual([]);
    });

    it("iterates over values", () => {
        set.add("x");
        set.add("y");
        const values = [...set];
        expect(values).toContain("x");
        expect(values).toContain("y");
    });

    it("entries() yields [value, value] pairs", () => {
        set.add("foo");
        set.add("bar");
        const entries = [...set.entries()];
        expect(entries).toEqual([
            ["foo", "foo"],
            ["bar", "bar"],
        ]);
    });

    it("keys() equals values()", () => {
        set.add("k");
        expect([...set.keys()]).toEqual([...set.values()]);
    });

    it("forEach() iterates values", () => {
        const seen: string[] = [];
        set.add("a");
        set.add("b");
        set.forEach(v => seen.push(v));
        expect(seen).toContain("a");
        expect(seen).toContain("b");
    });

    it("maps values", () => {
        set.add("1");
        set.add("2");
        const mapped = set.map(v => v + v);
        expect([...mapped]).toEqual(["11", "22"]);
    });

    it("mapToArray() transforms values into an array", () => {
        set.add("a");
        set.add("b");
        const arr = set.mapToArray(v => v + "!");
        expect(arr).toEqual(["a!", "b!"]);
        expect(Array.isArray(arr)).toBeTrue();
    });

    it("map() transforms values into a new Set1", () => {
        set.add("1");
        set.add("2");
        const mapped = set.map(v => parseInt(v) * 2);
        expect(mapped instanceof Set1).toBeTrue();
        expect(mapped.has(2)).toBeTrue();
        expect(mapped.has(4)).toBeTrue();
    });

    it("map() removes duplicates in result", () => {
        set.add("a");
        set.add("b");
        const mapped = set.map(() => "same");
        expect(mapped.size).toBe(1);
        expect(mapped.has("same")).toBeTrue();
    });

    it("filters values", () => {
        set.add("a");
        set.add("b");
        const filtered = set.filter(v => v === "a");
        expect([...filtered]).toEqual(["a"]);
    });

    it("reduces values", () => {
        set.add("x");
        set.add("y");
        const result = set.reduce((acc, v) => acc + v, "");
        expect(result).toContain("x");
        expect(result).toContain("y");
    });

    it("reduce throws if empty and no initial value", () => {
        expect(() => set.reduce(() => 0 as any)).toThrowError(TypeError);
    });

    it("toArray() returns an array copy", () => {
        set.add("a");
        set.add("b");
        const arr = set.toArray();
        expect(Array.isArray(arr)).toBeTrue();
        expect(arr).toContain("a");
        expect(arr).toContain("b");
    });

    // --- KVComponent compatibility methods ---
    it("get() returns value if present, undefined otherwise", () => {
        set.add("x");
        expect(set.get("x")).toBe("x");
        expect(set.get("y")).toBeUndefined();
    });

    it("set() adds value when key === value", () => {
        set.set("x", "x");
        expect(set.has("x")).toBeTrue();
    });

    it("set() throws if key !== value", () => {
        expect(() => set.set("a", "b")).toThrowError(TypeError);
    });

    it("getOrDefault() returns existing or default", () => {
        expect(set.getOrDefault("a", "b")).toBe("b");
        set.add("a");
        expect(set.getOrDefault("a", "b")).toBe("a");
    });

    it("getOrCreate() returns existing or creates new", () => {
        const created = set.getOrCreate("new", () => "new");
        expect(created).toBe("new");
        expect(set.has("new")).toBeTrue();
    });
});
