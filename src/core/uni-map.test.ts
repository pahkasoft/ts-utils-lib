import { UniMap } from "./uni-map";

function mapArr<K, V>(m: Map<K, V>) {
    return [...m.entries()];
}

describe("Map1", () => {
    it("should has()", () => {
        expect(new UniMap([["a", 2], ["b", 3]]).has("a")).toBeTrue();
        expect(new UniMap([["a", 2], ["b", 3]]).has("c")).toBeFalse();
    });

    it("should deep has()", () => {
        expect(new UniMap([[["a"], 2], [["b"], 3]]).has(["a"])).toBeFalse();
        expect(UniMap.createDeep([[["a"], 2], [["b"], 3]]).has(["a"])).toBeTrue();
        expect(UniMap.createDeep([[["a"], 2], [["b"], 3]]).has(["c"])).toBeFalse();
    });

    it("should get()", () => {
        expect(new UniMap([["a", 2], ["b", 3]]).get("a")).toEqual(2);
        expect(new UniMap([["a", 2], ["b", 3]]).get("c")).toBeUndefined();
    });

    it("should deep get()", () => {
        expect(new UniMap([[["a"], 2], [["b"], 3]]).get(["a"])).toBeUndefined();
        expect(UniMap.createDeep([[["a"], 2], [["b"], 3]]).get(["a"])).toEqual(2);
        expect(UniMap.createDeep([[["a"], 2], [["b"], 3]]).get(["c"])).toBeUndefined();
    });

    it("should getOrDefault()", () => {
        expect(new UniMap([["a", 2], ["b", 3]]).getOrDefault("a", 0)).toEqual(2);
        expect(new UniMap([["a", 2], ["b", 3]]).getOrDefault("c", 0)).toEqual(0);
    });

    it("should getOrCreate()", () => {
        expect(new UniMap([["a", 2], ["b", 3]]).getOrCreate("a", 1)).toEqual(2);
        expect(new UniMap([["a", 2], ["b", 3]]).getOrCreate("c", 1)).toEqual(1);
        expect(new UniMap([["a", 2], ["b", 3]]).getOrCreate("a", () => 1)).toEqual(2);
        expect(new UniMap([["a", 2], ["b", 3]]).getOrCreate("c", () => 1)).toEqual(1);
    });

    it("should delete()", () => {
        let del = new UniMap([["a", 2], ["b", 2], ["c", 3], ["d", 3], ["g", 3]]);
        expect(del.delete("a")).toBeTrue();
        expect(del.size).toEqual(4);
        expect(del.delete("x")).toBeFalse();
        expect(del.size).toEqual(4);
    });

    it("should deep delete()", () => {
        let del = UniMap.createDeep([[["a"], 2], [["b"], 2], [["c"], 3], [["d"], 3], [["g"], 3]]);
        expect(del.delete(["a"])).toBeTrue();
        expect(del.size).toEqual(4);
        expect(del.delete(["x"])).toBeFalse();
        expect(del.size).toEqual(4);
    });

    it("should clear()", () => {
        let clr = new UniMap([["a", 2], ["b", 2], ["c", 3], ["d", 3], ["g", 3]]);
        clr.clear();
        expect(clr.size).toEqual(0);
    });

    it("should get keysArray()", () => {
        expect(new UniMap([["a", 2], ["b", 3]]).keysArray()).toEqual(["a", "b"]);
    });

    it("should get valuesArray()", () => {
        expect(new UniMap([["a", 2], ["b", 3]]).valuesArray()).toEqual([2, 3]);
    });

    it("should get entriesArray()", () => {
        expect(new UniMap([["a", 2], ["b", 3]]).entriesArray()).toEqual([["a", 2], ["b", 3]]);
    });

    it("should clone()", () => {
        let map1 = new UniMap([["a", 2], ["b", 2], ["c", 3], ["d", 3], ["g", 3]]);
        let map2 = new UniMap([[["a"], 2], [["b"], 2]]);
        let map3 = UniMap.createDeep([[["a"], 2], [["b"], 2]]);
        expect(map1).toEqual(map1.clone());
        expect(map2).toEqual(map2.clone());
        expect(map3).toEqual(map3.clone());
    });

    it("should merge()", () => {
        expect(new UniMap([["a", 2]]).merge(new UniMap([["a", 3]]))).toEqual(new UniMap([["a", 3]]));
        expect(new UniMap([["a", 2]]).merge(new UniMap([["a", 3]]), (o, n) => o)).toEqual(new UniMap([["a", 2]]));
        expect(new UniMap([["a", 2]]).merge(new UniMap([["a", 3]]), (o, n) => n)).toEqual(new UniMap([["a", 3]]));
        expect(new UniMap([["a", 2]]).merge(new UniMap([["d", 3]]))).toEqual(new UniMap([["a", 2], ["d", 3]]));
    });

    it("should have some()", () => {
        expect(new UniMap([["a", 2], ["d", 3]]).some((v) => v === 2)).toBeTrue();
        expect(new UniMap([["a", 2], ["d", 3]]).some((v) => v === 1)).toBeFalse();
    });

    it("should have every()", () => {
        expect(new UniMap([["a", 2], ["d", 3]]).every((v, k1) => k1 === "a")).toBeFalse();
    });

    it("should filter()", () => {
        expect(new UniMap([["a", 2], ["c", 3]]).filter((v) => v === 2)).toEqual(new UniMap([["a", 2]]));
        class A { a = 1; }; class B { b = 2; };
        let fltr = new UniMap<number, A | B>([[0, new A()], [1, new B()]]);
        let fltrA = fltr.filter(v => v instanceof A);
        let fltrB = fltr.filter(v => v instanceof B);
        expect(fltrA.size === 1 && fltrA.every(v => v.a === 1)).toBeTrue();
        expect(fltrB.size === 1 && fltrB.every(v => v.b === 2)).toBeTrue();
    });

    it("should reduce()", () => {
        expect(new UniMap([["a", 2], ["b", 3]]).reduce((acc, v, k1) => (acc + k1), "x-")).toEqual("x-ab");
        expect(new UniMap([["a", 2], ["b", 3]]).reduce((acc, v, k1) => (acc + v))).toEqual(5);
    });

    it("should mapEntries()", () => {
        expect(new UniMap([["a", 2], ["b", 3]]).mapEntries((v, k1) => k1 + v)).toEqual(["a2", "b3"]);
    });

    it("should mapValues()", () => {
        expect(new UniMap([["a", "x"], ["b", "y"]]).mapValues((v, k1) => (k1 + v).toUpperCase())).toEqual(new UniMap([["a", "AX"], ["b", "BY"]]));
    });

    it("should toMap()", () => {
        expect(mapArr(new UniMap([["a", 2], ["d", 3]]).toMap())).toEqual(mapArr(new Map([["a", 2], ["d", 3]])));
    });

    it("should toString()", () => {
        expect(new UniMap().toString()).toEqual(`Map(0){ }`);
        expect(new UniMap([["a", 1], ["b", 2]]).toString()).toEqual(`Map(2){ "a" => 1, "b" => 2 }`);
    });
});
