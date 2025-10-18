import { Map1, Map2, Map3 } from "./map";

function mapArr<K, V>(m: Map<K, V>) {
    return [...m.entries()];
}

describe(Map1.name, () => {
    it("should work", () => {
        // has
        expect(new Map1([["a", 2], ["b", 3]]).has("a")).toEqual(true);
        expect(new Map1([["a", 2], ["b", 3]]).has("c")).toEqual(false);

        // get
        expect(new Map1([["a", 2], ["b", 3]]).get("a")).toEqual(2);
        expect(new Map1([["a", 2], ["b", 3]]).get("c")).toEqual(undefined);

        // getOrDefault
        expect(new Map1([["a", 2], ["b", 3]]).getOrDefault("a", 0)).toEqual(2);
        expect(new Map1([["a", 2], ["b", 3]]).getOrDefault("c", 0)).toEqual(0);

        // getOrCreate
        expect(new Map1([["a", 2], ["b", 3]]).getOrCreate("a", 1)).toEqual(2);
        expect(new Map1([["a", 2], ["b", 3]]).getOrCreate("c", 1)).toEqual(1);
        expect(new Map1([["a", 2], ["b", 3]]).getOrCreate("a", () => 1)).toEqual(2);
        expect(new Map1([["a", 2], ["b", 3]]).getOrCreate("c", () => 1)).toEqual(1);

        // delete
        let del = new Map1([["a", 2], ["b", 2], ["c", 3], ["d", 3], ["g", 3]]);
        expect(del.delete("a")).toEqual(true);
        expect(del.size).toEqual(4);
        expect(del.delete("x")).toEqual(false);
        expect(del.size).toEqual(4);

        // clear
        let clr = new Map1([["a", 2], ["b", 2], ["c", 3], ["d", 3], ["g", 3]]);
        clr.clear();
        expect(clr.size).toEqual(0);

        // keysArray
        expect(new Map1([["a", 2], ["b", 3]]).keysArray()).toEqual(["a", "b"]);

        // valuesArray
        expect(new Map1([["a", 2], ["b", 3]]).valuesArray()).toEqual([2, 3]);

        // entriesArray
        expect(new Map1([["a", 2], ["b", 3]]).entriesArray()).toEqual([["a", 2], ["b", 3]]);

        // clone
        let cln = new Map1([["a", 2], ["b", 2], ["c", 3], ["d", 3], ["g", 3]]);
        expect(cln).toEqual(cln.clone());

        // merge
        expect(new Map1([["a", 2]]).merge(new Map1([["a", 3]]))).toEqual(new Map1([["a", 3]]));
        expect(new Map1([["a", 2]]).merge(new Map1([["a", 3]]), (o, n) => o)).toEqual(new Map1([["a", 2]]));
        expect(new Map1([["a", 2]]).merge(new Map1([["a", 3]]), (o, n) => n)).toEqual(new Map1([["a", 3]]));
        expect(new Map1([["a", 2]]).merge(new Map1([["d", 3]]))).toEqual(new Map1([["a", 2], ["d", 3]]));

        // some
        expect(new Map1([["a", 2], ["d", 3]]).some((v) => v === 2)).toEqual(true);
        expect(new Map1([["a", 2], ["d", 3]]).some((v) => v === 1)).toEqual(false);

        // every
        expect(new Map1([["a", 2], ["d", 3]]).every((v, k1) => k1 === "a")).toEqual(false);

        // filter
        expect(new Map1([["a", 2], ["c", 3]]).filter((v) => v === 2)).toEqual(new Map1([["a", 2]]));

        // reduce
        expect(new Map1([["a", 2], ["b", 3]]).reduce((acc, v, k1) => (acc + k1), "")).toEqual("ab");

        // mapEntries
        expect(new Map1([["a", 2], ["b", 3]]).mapEntries((v, k1) => k1 + v)).toEqual(["a2", "b3"]);

        // mapValues
        expect(new Map1([["a", "x"], ["b", "y"]]).mapValues((v, k1) => (k1 + v).toUpperCase())).toEqual(new Map1([["a", "AX"], ["b", "BY"]]));

        // toMap
        expect(mapArr(new Map1([["a", 2], ["d", 3]]).toMap())).toEqual(mapArr(new Map([["a", 2], ["d", 3]])));

        // toString
        expect(new Map1([["a", 1], ["b", 2]]).toString()).toEqual("Map1(2) { a => 1, b => 2 }");
    });
});

describe(Map2.name, () => {
    it("should work", () => {
        // has
        expect(new Map2([["a", "b", 2], ["b", "c", 3]]).has("a", "b")).toEqual(true);
        expect(new Map2([["a", "b", 2], ["b", "c", 3]]).has("a", "c")).toEqual(false);

        // get
        expect(new Map2([["a", "b", 2], ["b", "c", 3]]).get("a", "b")).toEqual(2);
        expect(new Map2([["a", "b", 2], ["b", "c", 3]]).get("a", "c")).toEqual(undefined);

        // getOrDefault
        expect(new Map2([["a", "b", 2], ["b", "c", 3]]).getOrDefault("a", "b", 0)).toEqual(2);
        expect(new Map2([["a", "b", 2], ["b", "c", 3]]).getOrDefault("a", "c", 0)).toEqual(0);

        // getOrCreate
        expect(new Map2([["a", "b", 2], ["b", "c", 3]]).getOrCreate("a", "b", 1)).toEqual(2);
        expect(new Map2([["a", "b", 2], ["b", "c", 3]]).getOrCreate("a", "c", 1)).toEqual(1);
        expect(new Map2([["a", "b", 2], ["b", "c", 3]]).getOrCreate("a", "b", () => 1)).toEqual(2);
        expect(new Map2([["a", "b", 2], ["b", "c", 3]]).getOrCreate("a", "c", () => 1)).toEqual(1);

        // delete
        let del = new Map2([["a", "b", 2], ["a", "c", 2], ["b", "c", 3], ["b", "d", 3], ["g", "f", 3]]);
        expect(del.delete("a")).toEqual(true);
        expect(del.size).toEqual(3);
        expect(del.delete("b", "g")).toEqual(false);
        expect(del.delete("b", "c")).toEqual(true);
        expect(del.size).toEqual(2);

        // clear
        let clr = new Map2([["a", "b", 2], ["a", "c", 2], ["b", "c", 3], ["b", "d", 3], ["g", "f", 3]]);
        clr.clear();
        expect(clr.size).toEqual(0);

        // keysArray
        expect(new Map2([["a", "b", 2], ["b", "d", 3]]).keysArray()).toEqual([["a", "b"], ["b", "d"]]);

        // valuesArray
        expect(new Map2([["a", "b", 2], ["b", "d", 3]]).valuesArray()).toEqual([2, 3]);

        // entriesArray
        expect(new Map2([["a", "b", 2], ["b", "d", 3]]).entriesArray()).toEqual([["a", "b", 2], ["b", "d", 3]]);

        // clone
        let cln = new Map2([["a", "b", 2], ["a", "c", 2], ["b", "c", 3], ["b", "d", 3], ["g", "f", 3]]);
        expect(cln).toEqual(cln.clone());

        // merge
        expect(new Map2([["a", "b", 2]]).merge(new Map2([["a", "b", 3]]))).toEqual(new Map2([["a", "b", 3]]));
        expect(new Map2([["a", "b", 2]]).merge(new Map2([["a", "b", 3]]), (o, n) => o)).toEqual(new Map2([["a", "b", 2]]));
        expect(new Map2([["a", "b", 2]]).merge(new Map2([["a", "b", 3]]), (o, n) => n)).toEqual(new Map2([["a", "b", 3]]));
        expect(new Map2([["a", "b", 2]]).merge(new Map2([["a", "d", 3]]))).toEqual(new Map2([["a", "b", 2], ["a", "d", 3]]));

        // some
        expect(new Map2([["a", "b", 2], ["a", "d", 3]]).some((v) => v === 2)).toEqual(true);
        expect(new Map2([["a", "b", 2], ["a", "d", 3]]).some((v) => v === 1)).toEqual(false);

        // every
        expect(new Map2([["a", "b", 2], ["a", "d", 3]]).every((v, k1) => k1 === "a")).toEqual(true);
        expect(new Map2([["a", "b", 2], ["a", "c", 3]]).every((v, k1, k2) => k2 === "b")).toEqual(false);

        // filter
        expect(new Map2([["a", "c", 2], ["a", "d", 3]]).filter((v, k1, k2) => k2 === "c")).toEqual(new Map2([["a", "c", 2]]));

        // reduce
        expect(new Map2([["a", "b", "Y"], ["a", "c", "Z"]]).reduce((acc, v, k1, k2) => (acc + v), "X")).toEqual("XYZ");

        // mapEntries
        expect(new Map2([["a", "b", 2], ["a", "c", 3]]).mapEntries((v, k1, k2) => [k1])).toEqual([["a"], ["a"]]);

        // mapValues
        expect(new Map2([["a", "b", "x"], ["a", "c", "y"]]).mapValues((v, k1, k2) => k1.toUpperCase())).toEqual(new Map2([["a", "b", "A"], ["a", "c", "A"]]));

        // toMap
        expect(mapArr(new Map2([["a", "b", 2], ["a", "d", 3]]).toMap())).toEqual(mapArr(new Map([[["a", "b"], 2], [["a", "d"], 3]])));

        // toString
        expect(new Map2([["a", "b", "x"], ["a", "c", "y"]]).toString()).toEqual("Map2(2) { a => { b => x, c => y } }");
    });
});

describe(Map3.name, () => {
    it("should work", () => {
        // has
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).has("a", "b", "c")).toEqual(true);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).has("a", "c", "d")).toEqual(false);

        // get
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).get("a", "b", "c")).toEqual(2);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).get("a", "c", "d")).toEqual(undefined);

        // getOrDefault
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrDefault("a", "b", "c", 0)).toEqual(2);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrDefault("a", "c", "d", 0)).toEqual(0);

        // getOrCreate
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "b", "c", 1)).toEqual(2);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "c", "d", 1)).toEqual(1);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "b", "c", () => 1)).toEqual(2);
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).getOrCreate("a", "c", "d", () => 1)).toEqual(1);

        // delete
        let del = new Map3([["a", "b", "c", 2], ["a", "b", "d", 2], ["b", "c", "d", 3], ["b", "c", "e", 3], ["b", "g", "f", 3]]);
        expect(del.delete("a")).toEqual(true);
        expect(del.size).toEqual(3);
        expect(del.delete("b", "c")).toEqual(true);
        expect(del.size).toEqual(1);
        expect(del.delete("b", "g", "x")).toEqual(false);
        expect(del.delete("b", "g", "f")).toEqual(true);
        expect(del.size).toEqual(0);

        // clear
        let clr = new Map3([["a", "b", "c", 2], ["a", "b", "d", 2], ["b", "c", "d", 3], ["b", "c", "e", 3], ["b", "g", "f", 3]]);
        clr.clear();
        expect(clr.size).toEqual(0);

        // keysArray
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).keysArray()).toEqual([["a", "b", "c"], ["b", "c", "d"]]);

        // keysArray
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).valuesArray()).toEqual([2, 3]);

        // entriesArray
        expect(new Map3([["a", "b", "c", 2], ["b", "c", "d", 3]]).entriesArray()).toEqual([["a", "b", "c", 2], ["b", "c", "d", 3]]);

        // clone
        let cln = new Map3([["a", "b", "c", 2], ["a", "b", "d", 2], ["b", "c", "d", 3], ["b", "c", "e", 3], ["b", "g", "f", 3]]);
        expect(cln).toEqual(cln.clone());

        // merge
        expect(new Map3([["a", "b", "c", 2]]).merge(new Map3([["a", "b", "c", 3]]))).toEqual(new Map3([["a", "b", "c", 3]]));
        expect(new Map3([["a", "b", "c", 2]]).merge(new Map3([["a", "b", "c", 3]]), (o, n) => o)).toEqual(new Map3([["a", "b", "c", 2]]));
        expect(new Map3([["a", "b", "c", 2]]).merge(new Map3([["a", "b", "c", 3]]), (o, n) => n)).toEqual(new Map3([["a", "b", "c", 3]]));
        expect(new Map3([["a", "b", "c", 2]]).merge(new Map3([["a", "b", "d", 3]]))).toEqual(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]));

        // some
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).some((v) => v === 2)).toEqual(true);
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).some((v) => v === 1)).toEqual(false);

        // every
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).every((v, k1) => k1 === "a")).toEqual(true);
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).every((v, k1, k2, k3) => k3 === "c")).toEqual(false);

        // filter
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).filter((v, k1, k2, k3) => k3 === "c")).toEqual(new Map3([["a", "b", "c", 2]]));

        // reduce
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).reduce((acc, v, k1, k2, k3) => (acc + v), 0)).toEqual(5);

        // mapEntries
        expect(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).mapEntries((v, k1, k2, k3) => [k1])).toEqual([["a"], ["a"]]);

        // mapValues
        expect(new Map3([["a", "b", "c", "x"], ["a", "b", "d", "y"]]).mapValues((v, k1, k2, k3) => v.toUpperCase())).toEqual(new Map3([["a", "b", "c", "X"], ["a", "b", "d", "Y"]]));

        // toMap
        expect(mapArr(new Map3([["a", "b", "c", 2], ["a", "b", "d", 3]]).toMap())).toEqual(mapArr(new Map([[["a", "b", "c"], 2], [["a", "b", "d"], 3]])));

        // toString
        expect(new Map3([["a", "b", "c", "x"], ["a", "b", "d", "y"]]).toString()).toEqual("Map3(2) { a => b => { c => x, d => y } }");
        expect(new Map3([["a", "q", "c", "x"], ["a", "b", "d", "y"]]).toString()).toEqual("Map3(2) { a => q => { c => x }, a => b => { d => y } }");
    });
});
