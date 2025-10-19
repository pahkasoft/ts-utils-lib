import { SignedIndexArray as Arr } from "./signed-index-array";

describe(Arr.name, () => {
    it("should work", () => {
        // size
        let sizeArr = new Arr([[-1, "a"], [1, "b"]]);
        sizeArr.set(-1, "x");
        expect(sizeArr.size).toEqual(2);
        sizeArr.set(-2, "y");
        expect(sizeArr.size).toEqual(3);
        sizeArr.delete(-3);
        expect(sizeArr.size).toEqual(3);
        sizeArr.delete(1);
        expect(sizeArr.size).toEqual(2);
        sizeArr = sizeArr.clone();
        expect(sizeArr.size).toEqual(2);
        sizeArr.clear();
        expect(sizeArr.size).toEqual(0);

        // has
        expect(new Arr([[-1, "a"], [1, "b"]]).has(-1)).toEqual(true);
        expect(new Arr([[-1, "a"], [1, "b"]]).has(1)).toEqual(true);
        expect(new Arr([[-1, "a"], [1, "b"]]).has(0)).toEqual(false);
        expect(() => new Arr([[-1, "a"], [1, "b"]]).has(1.5)).toThrow();

        // get
        expect(new Arr([[-2, "a"], [3, "b"]]).get(-2)).toEqual("a");
        expect(new Arr([[-2, "a"], [3, "b"]]).get(3)).toEqual("b");
        expect(new Arr([[-2, "a"], [3, "b"]]).get(0)).toEqual(undefined);

        // getOrDefault
        expect(new Arr([[-2, "a"], [3, "b"]]).getOrDefault(-2, "x")).toEqual("a");
        expect(new Arr([[-2, "a"], [3, "b"]]).getOrDefault(0, "x")).toEqual("x");

        // getOrCreate
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(2, "x")).toEqual("a");
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(1, "x")).toEqual("x");
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(3, () => "x")).toEqual("b");
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(-5, () => "x")).toEqual("x");

        // delete
        let del = new Arr([[-5, "a"], [-1, "b"], [0, "c"], [1, "d"], [3, "g"]]);
        expect(del.delete(-1)).toEqual(true);
        expect(del.delete(-5)).toEqual(true);
        expect(del.delete(2)).toEqual(false);
        expect(del.entriesArray()).toEqual([[0, "c"], [1, "d"], [3, "g"]]);

        // clear
        let clr = new Arr([[-22, "a"], [13, "b"], [-8, "c"], [16, "d"], [3, "g"]]);
        clr.clear();
        expect(clr.entriesArray()).toEqual([]);

        // forEach
        let arr = new Arr([[-9, 3], [-7, 5], [8, 13], [99, 0]]);
        let idStr = " ";
        let elStr = " ";
        arr.forEach((e, i) => { idStr += i + " "; elStr += e + " "; });
        expect(idStr).toEqual(" -9 -7 8 99 ");
        expect(elStr).toEqual(" 3 5 13 0 ");

        // indicesArray
        expect(new Arr([[2, "a"], [-5, "b"]]).indicesArray()).toEqual([-5, 2]);

        // valuesArray
        expect(new Arr([[8, "a"], [-6, "b"]]).valuesArray()).toEqual(["b", "a"]);

        // entriesArray
        expect(new Arr([[16, "a"], [-99, "b"]]).entriesArray()).toEqual([[-99, "b"], [16, "a"]]);


        // clone
        let cln = new Arr([[-7, "a"], [2, "b"], [-4, "c"], [8, "d"], [11, "g"]]);
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

        // reduce
        expect(new Arr([[2, "a"], [3, "b"]]).reduce((acc, v, id) => (acc + v), "x-")).toEqual("x-ab");
        expect(new Arr([[2, "a"], [3, "b"]]).reduce((acc, v, id) => (acc + v))).toEqual("ab");
        expect(() => new Arr<string>().reduce((acc, v, id) => (acc + v))).toThrow();

        // mapToArray
        expect(new Arr([[-2, "a"], [3, "b"]]).mapToArray((v, id) => id + v)).toEqual(["-2a", "3b"]);

        // map
        expect(new Arr([[14, "x"], [88, "y"]]).map((v, id) => ("" + id + ": " + v).toUpperCase())).toEqual(new Arr([[14, "14: X"], [88, "88: Y"]]));

        // equals
        expect(new Arr().equals(new Arr())).toEqual(true);
        expect(new Arr([[-1, "a"], [2, "b"]]).equals(new Arr([[-1, "a"], [2, "b"]]))).toEqual(true);
        expect(new Arr([[-1, "a"], [2, "b"]]).equals(new Arr([[-1, "a"], [2, "b"]]), (a, b) => false)).toEqual(false);
        expect(new Arr([[-1, "a"], [2, "b"]]).equals(new Arr([[-1, "a"], [2, "c"]]))).toEqual(false);
        expect(new Arr([[-1, "a"], [2, "b"]]).equals(new Arr([[-1, "a"], [3, "b"]]))).toEqual(false);
        expect(new Arr([[-1, "a"], [2, "b"]]).equals(new Arr([[-1, "a"]]))).toEqual(false);

        // toString
        expect(new Arr([[-1, "a"], [2, "b"]]).toString()).toEqual("SignedIndexArray[ -1: a, 2: b ]");
    });
});
