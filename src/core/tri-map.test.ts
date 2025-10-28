import { TriMap } from "./tri-map";

function mapArr<K, V>(m: Map<K, V>) {
    return [...m.entries()];
}

describe("Map3", () => {
    it("should has()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).has("a", "b", "c")).toEqual(true);
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).has("a", "c", "d")).toEqual(false);
    });

    it("should get()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).get("a", "b", "c")).toEqual(2);
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).get("a", "c", "d")).toEqual(undefined);
    });

    it("should getOrDefault()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrDefault("a", "b", "c", 0)).toEqual(2);
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrDefault("a", "c", "d", 0)).toEqual(0);
    });

    it("should getOrCreate()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "b", "c", 1)).toEqual(2);
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "c", "d", 1)).toEqual(1);
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "b", "c", () => 1)).toEqual(2);
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "c", "d", () => 1)).toEqual(1);
    });

    it("should delete()", () => {
        let del = new TriMap([["a", "b", "c", 2], ["a", "b", "d", 2], ["b", "c", "d", 3], ["b", "c", "e", 3], ["b", "g", "f", 3]]);
        expect(del.delete("a")).toEqual(true);
        expect(del.size).toEqual(3);
        expect(del.delete("b", "c")).toEqual(true);
        expect(del.size).toEqual(1);
        expect(del.delete("b", "g", "x")).toEqual(false);
        expect(del.delete("b", "g", "f")).toEqual(true);
        expect(del.size).toEqual(0);
    });

    it("should clear()", () => {
        let clr = new TriMap([["a", "b", "c", 2], ["a", "b", "d", 2], ["b", "c", "d", 3], ["b", "c", "e", 3], ["b", "g", "f", 3]]);
        clr.clear();
        expect(clr.size).toEqual(0);
    });

    it("should get keysArray()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).keysArray()).toEqual([["a", "b", "c"], ["b", "c", "d"]]);
    });

    it("should get valuesArray()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).valuesArray()).toEqual([2, 3]);
    });

    it("should get entriesArray()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["b", "c", "d", 3]]).entriesArray()).toEqual([["a", "b", "c", 2], ["b", "c", "d", 3]]);
    });

    it("should clone()", () => {
        let cln = new TriMap([["a", "b", "c", 2], ["a", "b", "d", 2], ["b", "c", "d", 3], ["b", "c", "e", 3], ["b", "g", "f", 3]]);
        expect(cln).toEqual(cln.clone());
    });

    it("should merge()", () => {
        expect(new TriMap([["a", "b", "c", 2]]).merge(new TriMap([["a", "b", "c", 3]]))).toEqual(new TriMap([["a", "b", "c", 3]]));
        expect(new TriMap([["a", "b", "c", 2]]).merge(new TriMap([["a", "b", "c", 3]]), (o, n) => o)).toEqual(new TriMap([["a", "b", "c", 2]]));
        expect(new TriMap([["a", "b", "c", 2]]).merge(new TriMap([["a", "b", "c", 3]]), (o, n) => n)).toEqual(new TriMap([["a", "b", "c", 3]]));
        expect(new TriMap([["a", "b", "c", 2]]).merge(new TriMap([["a", "b", "d", 3]]))).toEqual(new TriMap([["a", "b", "c", 2], ["a", "b", "d", 3]]));
    });

    it("should have some()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["a", "b", "d", 3]]).some((v) => v === 2)).toEqual(true);
        expect(new TriMap([["a", "b", "c", 2], ["a", "b", "d", 3]]).some((v) => v === 1)).toEqual(false);
    });

    it("should have every()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["a", "b", "d", 3]]).every((v, k1) => k1 === "a")).toEqual(true);
        expect(new TriMap([["a", "b", "c", 2], ["a", "b", "d", 3]]).every((v, k1, k2, k3) => k3 === "c")).toEqual(false);
    });

    it("should filter()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["a", "b", "d", 3]]).filter((v, k1, k2, k3) => k3 === "c")).toEqual(new TriMap([["a", "b", "c", 2]]));
        class A { a = 1; }; class B { b = 2; };
        let fltr = new TriMap<number, string, boolean, A | B>([[0, "a", true, new A()], [1, "b", false, new B()]]);
        let fltrA = fltr.filter(v => v instanceof A);
        let fltrB = fltr.filter(v => v instanceof B);
        expect(fltrA.size === 1 && fltrA.every(v => v.a === 1)).toEqual(true);
        expect(fltrB.size === 1 && fltrB.every(v => v.b === 2)).toEqual(true);
    });

    it("should reduce()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["a", "b", "d", 3]]).reduce((acc, v, k1, k2, k3) => (acc + v), 10)).toEqual(15);
        expect(new TriMap([["a", "b", "c", 2], ["a", "b", "d", 3]]).reduce((acc, v, k1, k2, k3) => (acc + v))).toEqual(5);
    });

    it("should mapEntries()", () => {
        expect(new TriMap([["a", "b", "c", 2], ["a", "b", "d", 3]]).mapEntries((v, k1, k2, k3) => [k1])).toEqual([["a"], ["a"]]);
    });

    it("should mapValues()", () => {
        expect(new TriMap([["a", "b", "c", "x"], ["a", "b", "d", "y"]]).mapValues((v, k1, k2, k3) => v.toUpperCase())).toEqual(new TriMap([["a", "b", "c", "X"], ["a", "b", "d", "Y"]]));
    });

    it("should toMap()", () => {
        expect(mapArr(new TriMap([["a", "b", "c", 2], ["a", "b", "d", 3]]).toMap())).toEqual(mapArr(new Map([[["a", "b", "c"], 2], [["a", "b", "d"], 3]])));
    });

    it("should toString()", () => {
        expect(new TriMap().toString()).toEqual("Map(0){ }");
        expect(new TriMap([["a", "b", "c", "x"], ["a", "b", "d", "y"]]).toString()).toEqual(`Map(2){ "a" => "b" => { "c" => "x", "d" => "y" } }`);
        expect(new TriMap([["a", "q", "c", "x"], ["a", "b", "d", "y"]]).toString()).toEqual(`Map(2){ "a" => "q" => { "c" => "x" }, "a" => "b" => { "d" => "y" } }`);
    });
});
