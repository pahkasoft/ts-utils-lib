import { IndexArray as Arr } from "./index-array";

describe(Arr.name, () => {
    it("should work", () => {
        // size
        let sizeArr = new Arr([[17, "a"], [1, "b"]]);
        sizeArr.set(17, "x");
        expect(sizeArr.size).toEqual(2);
        sizeArr.set(19, "y");
        expect(sizeArr.size).toEqual(3);
        sizeArr.delete(21);
        expect(sizeArr.size).toEqual(3);
        sizeArr.delete(1);
        expect(sizeArr.size).toEqual(2);
        sizeArr = sizeArr.clone();
        expect(sizeArr.size).toEqual(2);
        sizeArr.clear();
        expect(sizeArr.size).toEqual(0);

        // has
        expect(new Arr([[17, "a"], [1, "b"]]).has(17)).toEqual(true);
        expect(new Arr([[17, "a"], [1, "b"]]).has(1)).toEqual(true);
        expect(new Arr([[17, "a"], [1, "b"]]).has(0)).toEqual(false);
        expect(() => new Arr([[17, "a"], [1, "b"]]).has(1.5)).toThrow();

        // get
        expect(new Arr([[19, "a"], [3, "b"]]).get(19)).toEqual("a");
        expect(new Arr([[19, "a"], [3, "b"]]).get(3)).toEqual("b");
        expect(new Arr([[19, "a"], [3, "b"]]).get(0)).toEqual(undefined);

        // getOrDefault
        expect(new Arr([[19, "a"], [3, "b"]]).getOrDefault(19, "x")).toEqual("a");
        expect(new Arr([[19, "a"], [3, "b"]]).getOrDefault(0, "x")).toEqual("x");

        // getOrCreate
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(2, "x")).toEqual("a");
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(1, "x")).toEqual("x");
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(3, () => "x")).toEqual("b");
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(15, () => "x")).toEqual("x");

        // delete
        let del = new Arr([[15, "a"], [17, "b"], [0, "c"], [1, "d"], [3, "g"]]);
        expect(del.delete(17)).toEqual(true);
        expect(del.delete(15)).toEqual(true);
        expect(del.delete(2)).toEqual(false);
        expect(del.entriesArray()).toEqual([[0, "c"], [1, "d"], [3, "g"]]);

        // clear
        let clr = new Arr([[192, "a"], [13, "b"], [18, "c"], [16, "d"], [3, "g"]]);
        clr.clear();
        expect(clr.entriesArray()).toEqual([]);

        // forEach
        let arr = new Arr([[23, 3], [25, 5], [8, 13], [99, 0]]);
        let idStr = " ";
        let elStr = " ";
        arr.forEach((e, i) => { idStr += i + " "; elStr += e + " "; });
        expect(idStr).toEqual(" 8 23 25 99 ");
        expect(elStr).toEqual(" 13 3 5 0 ");

        // indicesArray
        expect(new Arr([[2, "a"], [15, "b"]]).indicesArray()).toEqual([2, 15]);

        // valuesArray
        expect(new Arr([[8, "a"], [6, "b"]]).valuesArray()).toEqual(["b", "a"]);

        // entriesArray
        expect(new Arr([[16, "a"], [7, "b"]]).entriesArray()).toEqual([[7, "b"], [16, "a"]]);


        // clone
        let cln = new Arr([[25, "a"], [2, "b"], [4, "c"], [8, "d"], [11, "g"]]);
        expect(cln).toEqual(cln.clone());


        // merge
        expect(new Arr([[2, "b"]]).merge(new Arr([[2, "a"]]))).toEqual(new Arr([[2, "a"]]));
        expect(new Arr([[2, "b"]]).merge(new Arr([[2, "a"]]), (o, n) => o)).toEqual(new Arr([[2, "b"]]));
        expect(new Arr([[2, "b"]]).merge(new Arr([[2, "a"]]), (o, n) => n)).toEqual(new Arr([[2, "a"]]));
        expect(new Arr([[2, "b"]]).merge(new Arr([[3, "d"]]))).toEqual(new Arr([[2, "b"], [3, "d"]]));

        // some
        expect(new Arr([[2, "a"], [3, "d"]]).some((v) => v === "a")).toEqual(true);
        expect(new Arr([[2, "a"], [3, "d"]]).some((v) => v === "b")).toEqual(false);

        // every
        expect(new Arr([[2, "a"], [3, "d"]]).every((v, id) => id === 3)).toEqual(false);
        expect(new Arr([[2, "a"], [3, "d"]]).every((v, id) => id >= 2)).toEqual(true);

        // filter
        expect(new Arr([[2, "a"], [3, "c"]]).filter((v) => v === "a")).toEqual(new Arr([[2, "a"]]));
        class A { a = 1; }; class B { b = 2; };
        let fltr = new Arr<A | B>([[0, new A()], [1, new B()]]);
        let fltrA = fltr.filter(v => v instanceof A);
        let fltrB = fltr.filter(v => v instanceof B);
        expect(fltrA.size === 1 && fltrA.every(v => v.a === 1)).toEqual(true);
        expect(fltrB.size === 1 && fltrB.every(v => v.b === 2)).toEqual(true);

        // reduce
        expect(new Arr([[2, "a"], [3, "b"]]).reduce((acc, v, id) => (acc + v), "x-")).toEqual("x-ab");
        expect(new Arr([[2, "a"], [3, "b"]]).reduce((acc, v, id) => (acc + v))).toEqual("ab");
        expect(() => new Arr<string>().reduce((acc, v, id) => (acc + v))).toThrow();

        // mapToArray
        expect(new Arr([[19, "a"], [3, "b"]]).mapToArray((v, id) => id + v)).toEqual(["3b", "19a"]);

        // map
        expect(new Arr([[14, "x"], [88, "y"]]).map((v, id) => ("" + id + ": " + v).toUpperCase())).toEqual(new Arr([[14, "14: X"], [88, "88: Y"]]));

        // equals
        expect(new Arr().equals(new Arr())).toEqual(true);
        expect(new Arr([[17, "a"], [2, "b"]]).equals(new Arr([[17, "a"], [2, "b"]]))).toEqual(true);
        expect(new Arr([[17, "a"], [2, "b"]]).equals(new Arr([[17, "a"], [2, "b"]]), (a, b) => false)).toEqual(false);
        expect(new Arr([[17, "a"], [2, "b"]]).equals(new Arr([[17, "a"], [2, "c"]]))).toEqual(false);
        expect(new Arr([[17, "a"], [2, "b"]]).equals(new Arr([[17, "a"], [3, "b"]]))).toEqual(false);
        expect(new Arr([[17, "a"], [2, "b"]]).equals(new Arr([[17, "a"]]))).toEqual(false);

        // toString
        expect(new Arr().toString()).toEqual("IndexArray[ ]");
        expect(new Arr([[17, "a"], [2, "b"]]).toString()).toEqual("IndexArray[ 2: b, 17: a ]");
    });
});
