import { BiMap } from "./bi-map";

function mapArr<K, V>(m: Map<K, V>) {
    return [...m.entries()];
}

describe("Map2", () => {
    it("should has()", () => {
        expect(new BiMap([["a", "b", 2], ["b", "c", 3]]).has("a", "b")).toBeTrue();
        expect(new BiMap([["a", "b", 2], ["b", "c", 3]]).has("a", "c")).toBeFalse();
    });

    it("should deep has()", () => {
        expect(new BiMap([[{ a: "a" }, ["b"], 2], [{ b: "b" }, ["c"], 3]]).has({ a: "a" }, ["b"])).toBeFalse();
        expect(BiMap.createDeep([[{ a: "a" }, ["b"], 2], [{ b: "b" }, ["c"], 3]]).has({ a: "a" }, ["b"])).toBeTrue();
        expect(BiMap.createDeep([[{ a: "a" }, ["b"], 2], [{ b: "b" }, ["c"], 3]]).has({ a: "a" }, ["c"])).toBeFalse();
    });

    it("should get()", () => {
        expect(new BiMap([["a", "b", 2], ["b", "c", 3]]).get("a", "b")).toBe(2);
        expect(new BiMap([["a", "b", 2], ["b", "c", 3]]).get("a", "c")).toBeUndefined();
    });

    it("should deep get()", () => {
        expect(new BiMap([["a", ["b"], 2], ["b", ["c"], 3]]).get("a", ["b"])).toBeUndefined();
        expect(BiMap.createDeep([["a", ["b"], 2], ["b", ["c"], 3]]).get("a", ["b"])).toBe(2);
        expect(BiMap.createDeep([["a", ["b"], 2], ["b", ["c"], 3]]).get("a", ["c"])).toBeUndefined();
    });

    it("should getOrDefault()", () => {
        expect(new BiMap([["a", "b", 2], ["b", "c", 3]]).getOrDefault("a", "b", 0)).toBe(2);
        expect(new BiMap([["a", "b", 2], ["b", "c", 3]]).getOrDefault("a", "c", 0)).toBe(0);
    });

    it("should getOrCreate()", () => {
        expect(new BiMap([["a", "b", 2], ["b", "c", 3]]).getOrCreate("a", "b", 1)).toBe(2);
        expect(new BiMap([["a", "b", 2], ["b", "c", 3]]).getOrCreate("a", "c", 1)).toBe(1);
        expect(new BiMap([["a", "b", 2], ["b", "c", 3]]).getOrCreate("a", "b", () => 1)).toBe(2);
        expect(new BiMap([["a", "b", 2], ["b", "c", 3]]).getOrCreate("a", "c", () => 1)).toBe(1);
    });

    it("should delete()", () => {
        let del = new BiMap([["a", "b", 2], ["a", "c", 2], ["b", "c", 3], ["b", "d", 3], ["g", "f", 3]]);
        expect(del.delete("a")).toBeTrue();
        expect(del.size).toBe(3);
        expect(del.delete("b", "g")).toBeFalse();
        expect(del.delete("b", "c")).toBeTrue();
        expect(del.size).toBe(2);
    });

    it("should deep delete()", () => {
        let del = BiMap.createDeep([[["a"], ["b"], 2], [["a"], ["c"], 2], [["b"], ["c"], 3], [["b"], ["d"], 3], [["g"], ["f"], 3]]);
        expect(del.delete(["a"])).toBeTrue();
        expect(del.size).toBe(3);
        expect(del.delete(["b"], ["g"])).toBeFalse();
        expect(del.delete(["b"], ["c"])).toBeTrue();
        expect(del.size).toBe(2);
    });

    it("should clear()", () => {
        let clr = new BiMap([["a", "b", 2], ["a", "c", 2], ["b", "c", 3], ["b", "d", 3], ["g", "f", 3]]);
        clr.clear();
        expect(clr.size).toBe(0);
    });

    it("should get keysArray()", () => {
        expect(new BiMap([["a", "b", 2], ["b", "d", 3]]).keysArray()).toEqual([["a", "b"], ["b", "d"]]);
    });

    it("should get valuesArray()", () => {
        expect(new BiMap([["a", "b", 2], ["b", "d", 3]]).valuesArray()).toEqual([2, 3]);
    });

    it("should get entriesArray()", () => {
        expect(new BiMap([["a", "b", 2], ["b", "d", 3]]).entriesArray()).toEqual([["a", "b", 2], ["b", "d", 3]]);
    });

    it("should clone()", () => {
        let map1 = new BiMap([["a", "b", 2], ["a", "c", 2], ["a", "c", 3]]);
        expect(map1).toEqual(map1.clone());
    });

    it("should deep clone()", () => {
        let map1 = new BiMap([[["a", "x"], "b", 2], [["a", "y"], "c", 2], [["a", "x"], "c", 3]]);
        let map2 = BiMap.createDeep([[["a", "x"], "b", 2], [["a", "y"], "c", 2], [["a", "x"], "c", 3]]);
        expect(map1).toEqual(map1.clone());
        expect(map2).toEqual(map2.clone());
    });

    it("should merge()", () => {
        expect(new BiMap([["a", "b", 2]]).merge(new BiMap([["a", "b", 3]]))).toEqual(new BiMap([["a", "b", 3]]));
        expect(new BiMap([["a", "b", 2]]).merge(new BiMap([["a", "b", 3]]), (o, n) => o)).toEqual(new BiMap([["a", "b", 2]]));
        expect(new BiMap([["a", "b", 2]]).merge(new BiMap([["a", "b", 3]]), (o, n) => n)).toEqual(new BiMap([["a", "b", 3]]));
        expect(new BiMap([["a", "b", 2]]).merge(new BiMap([["a", "d", 3]]))).toEqual(new BiMap([["a", "b", 2], ["a", "d", 3]]));
    });

    it("should have some()", () => {
        expect(new BiMap([["a", "b", 2], ["a", "d", 3]]).some((v) => v === 2)).toBeTrue();
        expect(new BiMap([["a", "b", 2], ["a", "d", 3]]).some((v) => v === 1)).toBeFalse();
    });

    it("should have every()", () => {
        expect(new BiMap([["a", "b", 2], ["a", "d", 3]]).every((v, k1) => k1 === "a")).toBeTrue();
        expect(new BiMap([["a", "b", 2], ["a", "c", 3]]).every((v, k1, k2) => k2 === "b")).toBeFalse();
    });

    it("should filter()", () => {
        expect(new BiMap([["a", "c", 2], ["a", "d", 3]]).filter((v, k1, k2) => k2 === "c")).toEqual(new BiMap([["a", "c", 2]]));
        class A { a = 1; }; class B { b = 2; };
        let fltr = new BiMap<number, string, A | B>([[0, "a", new A()], [1, "b", new B()]]);
        let fltrA = fltr.filter(v => v instanceof A);
        let fltrB = fltr.filter(v => v instanceof B);
        expect(fltrA.size === 1 && fltrA.every(v => v.a === 1)).toBeTrue();
        expect(fltrB.size === 1 && fltrB.every(v => v.b === 2)).toBeTrue();
    });

    it("should reduce()", () => {
        expect(new BiMap([["a", "b", "Y"], ["a", "c", "Z"]]).reduce((acc, v, k1, k2) => (acc + v), "X")).toEqual("XYZ");
        expect(new BiMap([["a", "b", "Y"], ["a", "c", "Z"]]).reduce((acc, v, k1, k2) => (acc + v))).toEqual("YZ");
    });

    it("should mapEntries()", () => {
        expect(new BiMap([["a", "b", 2], ["a", "c", 3]]).mapEntries((v, k1, k2) => [k1])).toEqual([["a"], ["a"]]);
    });

    it("should mapValues()", () => {
        expect(new BiMap([["a", "b", "x"], ["a", "c", "y"]]).mapValues((v, k1, k2) => k1.toUpperCase())).toEqual(new BiMap([["a", "b", "A"], ["a", "c", "A"]]));
    });

    it("should toMap()", () => {
        expect(mapArr(new BiMap([["a", "b", 2], ["a", "d", 3]]).toMap())).toEqual(mapArr(new Map([[["a", "b"], 2], [["a", "d"], 3]])));
    });

    it("should toString()", () => {
        expect(new BiMap().toString()).toEqual(`Map(0){ }`);
        expect(new BiMap([["a", "b", "x"], ["a", "c", "y"]]).toString()).toEqual(`Map(2){ "a" => { "b" => "x", "c" => "y" } }`);
    });
});
