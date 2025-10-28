import { Map3 } from "./map3";

function mapArr<K, V>(m: Map<K, V>) {
    return [...m.entries()];
}

describe("Map3", () => {
    it("should has()", () => {
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).has("a", "b", "c")).toBeTrue();
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).has("a", "c", "d")).toBeFalse();
    });

    it("should get()", () => {
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).get("a", "b", "c")).toBe(2);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).get("a", "c", "d")).toBeUndefined();
    });

    it("should getOrDefault()", () => {
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrDefault("a", "b", "c", 0)).toBe(2);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrDefault("a", "c", "d", 0)).toBe(0);
    });

    it("should getOrCreate()", () => {
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "b", "c", 1)).toBe(2);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "c", "d", 1)).toBe(1);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "b", "c", () => 1)).toBe(2);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "c", "d", () => 1)).toBe(1);
    });

    it("should delete()", () => {
        let del = new Map3([["a", "b", "c", 2], ["a", "b", "d", 2], ["b", "c", "d", 3], ["b", "c", "e", 3], ["b", "g", "f", 3]]);
        expect(del.delete("a")).toBeTrue();
        expect(del.size).toBe(3);
        expect(del.delete("b", "c")).toBeTrue();
        expect(del.size).toBe(1);
        expect(del.delete("b", "g", "x")).toBeFalse();
        expect(del.delete("b", "g", "f")).toBeTrue();
        expect(del.size).toBe(0);
    });

    it("should clear()", () => {
        let clr = new Map3([["a", "b", "c", 2], ["a", "b", "d", 2], ["b", "c", "d", 3], ["b", "c", "e", 3], ["b", "g", "f", 3]]);
        clr.clear();
        expect(clr.size).toBe(0);
    });

    it("should get keysArray()", () => {
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).keysArray()).toEqual([["a", "b", "c"], ["b", "c", "d"]]);
    });

    it("should get valuesArray()", () => {
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).valuesArray()).toEqual([2, 3]);
    });

    it("should get entriesArray()", () => {
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).entriesArray()).toEqual([["a", "b", "c", 2], ["b", "c", "d", 3]]);
    });

    it("should clone()", () => {
        let cln = new Map3([["a", "b", "c", 2], ["a", "b", "d", 2], ["b", "c", "d", 3], ["b", "c", "e", 3], ["b", "g", "f", 3]]);
        expect(cln).toEqual(cln.clone());
    });

    it("should merge()", () => {
        expect(new Map3([["a", "b", "c", 2]]).merge(new Map3([["a", "b", "c", 3]]))).toEqual(new Map3([["a", "b", "c", 3]]));
        expect(new Map3([["a", "b", "c", 2]]).merge(new Map3([["a", "b", "c", 3]]), (o, n) => o)).toEqual(new Map3([["a", "b", "c", 2]]));
        expect(new Map3([["a", "b", "c", 2]]).merge(new Map3([["a", "b", "c", 3]]), (o, n) => n)).toEqual(new Map3([["a", "b", "c", 3]]));
        expect(new Map3([["a", "b", "c", 2]]).merge(new Map3([["a", "b", "d", 3]]))).toEqual(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]));
    });

    it("should have some()", () => {
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).some((v) => v === 2)).toBeTrue();
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).some((v) => v === 1)).toBeFalse();
    });

    it("should have every()", () => {
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).every((v, k1) => k1 === "a")).toBeTrue();
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).every((v, k1, k2, k3) => k3 === "c")).toBeFalse();
    });

    it("should filter()", () => {
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).filter((v, k1, k2, k3) => k3 === "c")).toEqual(new Map3([["a", "b", "c", 2]]));
        class A { a = 1; }; class B { b = 2; };
        let fltr = new Map3<number, string, boolean, A | B>([[0, "a", true, new A()], [1, "b", false, new B()]]);
        let fltrA = fltr.filter(v => v instanceof A);
        let fltrB = fltr.filter(v => v instanceof B);
        expect(fltrA.size === 1 && fltrA.every(v => v.a === 1)).toBeTrue();
        expect(fltrB.size === 1 && fltrB.every(v => v.b === 2)).toBeTrue();
    });

    it("should reduce()", () => {
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).reduce((acc, v, k1, k2, k3) => (acc + v), 10)).toEqual(15);
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).reduce((acc, v, k1, k2, k3) => (acc + v))).toBe(5);
    });

    it("should mapEntries()", () => {
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).mapEntries((v, k1, k2, k3) => [k1])).toEqual([["a"], ["a"]]);
    });

    it("should mapValues()", () => {
        expect(new Map3([["a", "b", "c", "x"], ["a", "b", "d", "y"]]).mapValues((v, k1, k2, k3) => v.toUpperCase())).toEqual(new Map3([["a", "b", "c", "X"], ["a", "b", "d", "Y"]]));
    });

    it("should toMap()", () => {
        expect(mapArr(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).toMap())).toEqual(mapArr(new Map([[["a", "b", "c"], 2], [["a", "b", "d"], 3]])));
    });

    it("should toString()", () => {
        expect(new Map3().toString()).toBe("Map(0){ }");
        expect(new Map3([["a", "b", "c", "x"], ["a", "b", "d", "y"]]).toString()).toEqual(`Map(2){ "a" => "b" => { "c" => "x", "d" => "y" } }`);
        expect(new Map3([["a", "q", "c", "x"], ["a", "b", "d", "y"]]).toString()).toEqual(`Map(2){ "a" => "q" => { "c" => "x" }, "a" => "b" => { "d" => "y" } }`);
    });
});
