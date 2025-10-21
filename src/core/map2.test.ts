import { Map2 } from "./map2";

function mapArr<K, V>(m: Map<K, V>) {
    return [...m.entries()];
}

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
        class A { a = 1; }; class B { b = 2; };
        let fltr = new Map2<number, string,  A | B>([[0, "a", new A()], [1, "b", new B()]]);
        let fltrA = fltr.filter(v => v instanceof A);
        let fltrB = fltr.filter(v => v instanceof B);
        expect(fltrA.size === 1 && fltrA.every(v => v.a === 1)).toEqual(true);
        expect(fltrB.size === 1 && fltrB.every(v => v.b === 2)).toEqual(true);

        // reduce
        expect(new Map2([["a", "b", "Y"], ["a", "c", "Z"]]).reduce((acc, v, k1, k2) => (acc + v), "X")).toEqual("XYZ");
        expect(new Map2([["a", "b", "Y"], ["a", "c", "Z"]]).reduce((acc, v, k1, k2) => (acc + v))).toEqual("YZ");

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
