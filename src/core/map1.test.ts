import { Map1 } from "./map1";

function mapArr<K, V>(m: Map<K, V>) {
    return [...m.entries()];
}

describe("Map1", () => {
    it("should has()", () => {
        expect(new Map1([["a", 2], ["b", 3]]).has("a")).toEqual(true);
        expect(new Map1([["a", 2], ["b", 3]]).has("c")).toEqual(false);
    });

    it("should get()", () => {
        expect(new Map1([["a", 2], ["b", 3]]).get("a")).toEqual(2);
        expect(new Map1([["a", 2], ["b", 3]]).get("c")).toEqual(undefined);
    });

    it("should getOrDefault()", () => {
        expect(new Map1([["a", 2], ["b", 3]]).getOrDefault("a", 0)).toEqual(2);
        expect(new Map1([["a", 2], ["b", 3]]).getOrDefault("c", 0)).toEqual(0);
    });

    it("should getOrCreate()", () => {
        expect(new Map1([["a", 2], ["b", 3]]).getOrCreate("a", 1)).toEqual(2);
        expect(new Map1([["a", 2], ["b", 3]]).getOrCreate("c", 1)).toEqual(1);
        expect(new Map1([["a", 2], ["b", 3]]).getOrCreate("a", () => 1)).toEqual(2);
        expect(new Map1([["a", 2], ["b", 3]]).getOrCreate("c", () => 1)).toEqual(1);
    });

    it("should delete()", () => {
        let del = new Map1([["a", 2], ["b", 2], ["c", 3], ["d", 3], ["g", 3]]);
        expect(del.delete("a")).toEqual(true);
        expect(del.size).toEqual(4);
        expect(del.delete("x")).toEqual(false);
        expect(del.size).toEqual(4);
    });

    it("should clear()", () => {
        let clr = new Map1([["a", 2], ["b", 2], ["c", 3], ["d", 3], ["g", 3]]);
        clr.clear();
        expect(clr.size).toEqual(0);
    });

    it("should get keysArray()", () => {
        expect(new Map1([["a", 2], ["b", 3]]).keysArray()).toEqual(["a", "b"]);
    });

    it("should get valuesArray()", () => {
        expect(new Map1([["a", 2], ["b", 3]]).valuesArray()).toEqual([2, 3]);
    });

    it("should get entriesArray()", () => {
        expect(new Map1([["a", 2], ["b", 3]]).entriesArray()).toEqual([["a", 2], ["b", 3]]);
    });

    it("should clone()", () => {
        let cln = new Map1([["a", 2], ["b", 2], ["c", 3], ["d", 3], ["g", 3]]);
        expect(cln).toEqual(cln.clone());
    });

    it("should merge()", () => {
        expect(new Map1([["a", 2]]).merge(new Map1([["a", 3]]))).toEqual(new Map1([["a", 3]]));
        expect(new Map1([["a", 2]]).merge(new Map1([["a", 3]]), (o, n) => o)).toEqual(new Map1([["a", 2]]));
        expect(new Map1([["a", 2]]).merge(new Map1([["a", 3]]), (o, n) => n)).toEqual(new Map1([["a", 3]]));
        expect(new Map1([["a", 2]]).merge(new Map1([["d", 3]]))).toEqual(new Map1([["a", 2], ["d", 3]]));
    });

    it("should have some()", () => {
        expect(new Map1([["a", 2], ["d", 3]]).some((v) => v === 2)).toEqual(true);
        expect(new Map1([["a", 2], ["d", 3]]).some((v) => v === 1)).toEqual(false);
    });

    it("should have every()", () => {
        expect(new Map1([["a", 2], ["d", 3]]).every((v, k1) => k1 === "a")).toEqual(false);
    });

    it("should filter()", () => {
        expect(new Map1([["a", 2], ["c", 3]]).filter((v) => v === 2)).toEqual(new Map1([["a", 2]]));
        class A { a = 1; }; class B { b = 2; };
        let fltr = new Map1<number, A | B>([[0, new A()], [1, new B()]]);
        let fltrA = fltr.filter(v => v instanceof A);
        let fltrB = fltr.filter(v => v instanceof B);
        expect(fltrA.size === 1 && fltrA.every(v => v.a === 1)).toEqual(true);
        expect(fltrB.size === 1 && fltrB.every(v => v.b === 2)).toEqual(true);
    });

    it("should reduce()", () => {
        expect(new Map1([["a", 2], ["b", 3]]).reduce((acc, v, k1) => (acc + k1), "x-")).toEqual("x-ab");
        expect(new Map1([["a", 2], ["b", 3]]).reduce((acc, v, k1) => (acc + v))).toEqual(5);
    });

    it("should mapEntries()", () => {
        expect(new Map1([["a", 2], ["b", 3]]).mapEntries((v, k1) => k1 + v)).toEqual(["a2", "b3"]);
    });

    it("should mapValues()", () => {
        expect(new Map1([["a", "x"], ["b", "y"]]).mapValues((v, k1) => (k1 + v).toUpperCase())).toEqual(new Map1([["a", "AX"], ["b", "BY"]]));
    });

    it("should toMap()", () => {
        expect(mapArr(new Map1([["a", 2], ["d", 3]]).toMap())).toEqual(mapArr(new Map([["a", 2], ["d", 3]])));
    });

    it("should toString()", () => {
        expect(new Map1().toString()).toEqual(`Map1(0){ }`);
        expect(new Map1([["a", 1], ["b", 2]]).toString()).toEqual(`Map1(2){ "a" => 1, "b" => 2 }`);
    });
});
