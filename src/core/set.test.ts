import { ValueSet } from "./set";

describe("ValueSet", () => {
    let set: ValueSet<string>;
    let deep: ValueSet<string[]>;

    beforeEach(() => {
        set = new ValueSet();
        deep = ValueSet.createDeep();
    });

    it("adds to ValueSet and checks values", () => {
        expect(set.size).toBe(0);
        set.add("a");
        expect(set.size).toBe(1);
        expect(set.has("a")).toBeTrue();
    });

    it("adds to deep ValueSet and checks values", () => {
        expect(deep.size).toBe(0);
        deep.add(["a"]);
        expect(deep.size).toBe(1);
        expect(deep.has([])).toBeFalse();
        expect(deep.has(["a"])).toBeTrue();
        expect(deep.has(["a", "b"])).toBeFalse();
    });

    it("ValueSet does not add duplicate values", () => {
        set.add("x");
        set.add("x");
        expect(set.size).toBe(1);
    });

    it("deep ValueSet does not add duplicate values", () => {
        deep.add(["x", "y"]);
        deep.add(["x", "y"]);
        expect(deep.size).toBe(1);
    });

    it("ValueSet deletes values", () => {
        set.add("a");
        set.add("b");
        expect(set.delete("a")).toBeTrue();
        expect(set.has("a")).toBeFalse();
        expect(set.size).toBe(1);
    });

    it("deep ValueSet deletes values", () => {
        deep.add(["a"]);
        deep.add(["b"]);
        expect(deep.delete(["a"])).toBeTrue();
        expect(deep.has(["a"])).toBeFalse();
        expect(deep.size).toBe(1);
    });

    it("clears all values", () => {
        set.add("a");
        set.add("b");
        set.clear();
        expect(set.size).toBe(0);
        expect(set.toArray()).toEqual([]);
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

    it("ValueSet maps values", () => {
        set.add("1");
        set.add("2");
        const mapped = set.map(v => v + v);
        expect([...mapped]).toEqual(["11", "22"]);
    });

    it("deep ValueSet maps values", () => {
        deep.add(["1a"]);
        deep.add(["2b"]);
        const mapped = deep.map(v => "" + v + v);
        expect([...mapped]).toEqual(["1a1a", "2b2b"]);
    });

    it("mapToArray() transforms values into an array", () => {
        set.add("a");
        set.add("b");
        const arr = set.mapToArray(v => v + "!");
        expect(arr).toEqual(["a!", "b!"]);
        expect(Array.isArray(arr)).toBeTrue();
    });

    it("map() transforms values into a new ValueSet", () => {
        set.add("1");
        set.add("2");
        const mapped = set.map(v => parseInt(v) * 2);
        expect(mapped instanceof ValueSet).toBeTrue();
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

    it("ValueSet filters values", () => {
        set.add("a");
        set.add("b");
        const filtered = set.filter(v => v === "a");
        expect([...filtered]).toEqual(["a"]);
    });

    it("deep ValueSet filters values", () => {
        deep.add(["a"]);
        deep.add(["BB"]);
        const filtered = deep.filter(v => v.length === 1 && v[0] === "a");
        expect([...filtered]).toEqual([["a"]]);
    });

    it("reduces values", () => {
        set.add("x");
        set.add("y");
        const result = set.reduce((acc, v) => acc + v, "");
        expect(result).toContain("x");
        expect(result).toContain("y");
    });

    it("reduce throws if empty and no initial value", () => {
        expect(() => deep.reduce(() => [""])).toThrowError(TypeError);
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

    it("ValueSet returns correct string", () => {
        expect(set.toString()).toBe(`Set(0){ }`);
        set.add("a");
        set.add("b");
        set.add("c");
        expect(set.toString()).toBe(`Set(3){ "a", "b", "c" }`);
    });

    it("deep ValueSet returns correct string", () => {
        expect(deep.toString()).toBe(`Set(0){ }`);
        deep.add(["a"]);
        deep.add(["bb"]);
        deep.add(["c", "c"]);
        expect(deep.toString()).toBe(`Set(3){ [ "a" ], [ "bb" ], [ "c", "c" ] }`);
    });
});
