import { SignedIndexArray as Arr } from "./signed-index-array";

describe("SignedIndexArray", () => {
    it("shoule have size", () => {
        let sizeArr = new Arr([[-1, "a"], [1, "b"]]);
        sizeArr.set(-1, "x");
        expect(sizeArr.size).toBe(2);
        sizeArr.set(-2, "y");
        expect(sizeArr.size).toBe(3);
        sizeArr.delete(-3);
        expect(sizeArr.size).toBe(3);
        sizeArr.delete(1);
        expect(sizeArr.size).toBe(2);
        sizeArr = sizeArr.clone();
        expect(sizeArr.size).toBe(2);
        sizeArr.clear();
        expect(sizeArr.size).toBe(0);
    });

    it("should has()", () => {
        expect(new Arr([[-1, "a"], [1, "b"]]).has(-1)).toBeTrue();
        expect(new Arr([[-1, "a"], [1, "b"]]).has(1)).toBeTrue();
        expect(new Arr([[-1, "a"], [1, "b"]]).has(0)).toBeFalse();
        expect(() => new Arr([[-1, "a"], [1, "b"]]).has(1.5)).toThrow();
    });

    it("should get()", () => {
        expect(new Arr([[-2, "a"], [3, "b"]]).get(-2)).toBe("a");
        expect(new Arr([[-2, "a"], [3, "b"]]).get(3)).toBe("b");
        expect(new Arr([[-2, "a"], [3, "b"]]).get(0)).toBeUndefined();
    });

    it("should getOrDefault()", () => {
        expect(new Arr([[-2, "a"], [3, "b"]]).getOrDefault(-2, "x")).toBe("a");
        expect(new Arr([[-2, "a"], [3, "b"]]).getOrDefault(0, "x")).toBe("x");
    });

    it("should getOrCreate()", () => {
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(2, "x")).toBe("a");
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(1, "x")).toBe("x");
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(3, () => "x")).toBe("b");
        expect(new Arr([[2, "a"], [3, "b"]]).getOrCreate(-5, () => "x")).toBe("x");
    });

    it("should delete()", () => {
        let del = new Arr([[-5, "a"], [-1, "b"], [0, "c"], [1, "d"], [3, "g"]]);
        expect(del.delete(-1)).toBeTrue();
        expect(del.delete(-5)).toBeTrue();
        expect(del.delete(2)).toBeFalse();
        expect(del.entriesArray()).toEqual([[0, "c"], [1, "d"], [3, "g"]]);
    });

    it("should clear()", () => {
        let clr = new Arr([[-22, "a"], [13, "b"], [-8, "c"], [16, "d"], [3, "g"]]);
        clr.clear();
        expect(clr.entriesArray()).toEqual([]);
    });

    it("should forEach()", () => {
        let arr = new Arr([[-9, 3], [-7, 5], [8, 13], [99, 0]]);
        let idStr = " ";
        let elStr = " ";
        arr.forEach((e, i) => { idStr += i + " "; elStr += e + " "; });
        expect(idStr).toBe(" -9 -7 8 99 ");
        expect(elStr).toBe(" 3 5 13 0 ");
    });

    it("should get indicesArray()", () => {
        expect(new Arr([[2, "a"], [-5, "b"]]).indicesArray()).toEqual([-5, 2]);
    });

    it("should get valuesArray()", () => {
        expect(new Arr([[8, "a"], [-6, "b"]]).valuesArray()).toEqual(["b", "a"]);
    });

    it("should get entriesArray()", () => {
        expect(new Arr([[16, "a"], [-99, "b"]]).entriesArray()).toEqual([[-99, "b"], [16, "a"]]);
    });

    it("should clone()", () => {
        let cln = new Arr([[-7, "a"], [2, "b"], [-4, "c"], [8, "d"], [11, "g"]]);
        expect(cln).toEqual(cln.clone());
    });

    it("should merge()", () => {
        expect(new Arr([[2, "b"]]).merge(new Arr([[2, "a"]]))).toEqual(new Arr([[2, "a"]]));
        expect(new Arr([[2, "b"]]).merge(new Arr([[2, "a"]]), (o, n) => o)).toEqual(new Arr([[2, "b"]]));
        expect(new Arr([[2, "b"]]).merge(new Arr([[2, "a"]]), (o, n) => n)).toEqual(new Arr([[2, "a"]]));
        expect(new Arr([[2, "b"]]).merge(new Arr([[3, "d"]]))).toEqual(new Arr([[2, "b"], [3, "d"]]));
    });

    it("should have some()", () => {
        expect(new Arr([[2, "a"], [3, "d"]]).some((v) => v === "a")).toBeTrue();
        expect(new Arr([[2, "a"], [3, "d"]]).some((v) => v === "b")).toBeFalse();
    });

    it("should have every()", () => {
        expect(new Arr([[2, "a"], [3, "d"]]).every((v, id) => id === 3)).toBeFalse();
        expect(new Arr([[2, "a"], [3, "d"]]).every((v, id) => id >= 2)).toBeTrue();
    });

    it("should filter()", () => {
        expect(new Arr([[2, "a"], [3, "c"]]).filter((v) => v === "a")).toEqual(new Arr([[2, "a"]]));
        class A { a = 1; }; class B { b = 2; };
        let fltr = new Arr<A | B>([[-1, new A()], [1, new B()]]);
        let fltrA = fltr.filter(v => v instanceof A);
        let fltrB = fltr.filter(v => v instanceof B);
        expect(fltrA.size === 1 && fltrA.every(v => v.a === 1)).toBeTrue();
        expect(fltrB.size === 1 && fltrB.every(v => v.b === 2)).toBeTrue();
    });

    it("should reduce()", () => {
        expect(new Arr([[2, "a"], [3, "b"]]).reduce((acc, v, id) => (acc + v), "x-")).toBe("x-ab");
        expect(new Arr([[2, "a"], [3, "b"]]).reduce((acc, v, id) => (acc + v))).toBe("ab");
        expect(() => new Arr<string>().reduce((acc, v, id) => (acc + v))).toThrow();
    });

    it("should mapToArray()", () => {
        expect(new Arr([[-2, "a"], [3, "b"]]).mapToArray((v, id) => id + v)).toEqual(["-2a", "3b"]);
    });

    it("should map()", () => {
        expect(new Arr([[14, "x"], [88, "y"]]).map((v, id) => ("" + id + ": " + v).toUpperCase())).toEqual(new Arr([[14, "14: X"], [88, "88: Y"]]));
    });

    it("should equals()", () => {
        expect(new Arr().equals(new Arr())).toBeTrue();
        expect(new Arr([[-1, "a"], [2, "b"]]).equals(new Arr([[-1, "a"], [2, "b"]]))).toBeTrue();
        expect(new Arr([[-1, "a"], [2, "b"]]).equals(new Arr([[-1, "a"], [2, "b"]]), (a, b) => false)).toBeFalse();
        expect(new Arr([[-1, "a"], [2, "b"]]).equals(new Arr([[-1, "a"], [2, "c"]]))).toBeFalse();
        expect(new Arr([[-1, "a"], [2, "b"]]).equals(new Arr([[-1, "a"], [3, "b"]]))).toBeFalse();
        expect(new Arr([[-1, "a"], [2, "b"]]).equals(new Arr([[-1, "a"]]))).toBeFalse();
    });

    it("should toString()", () => {
        expect(new Arr().toString()).toEqual(`[ ]`);
        expect(new Arr([[0, 0], [1, 1]]).toString()).toEqual(`[ 0, 1 ]`);
        expect(new Arr([[0, 0], [2, 2]]).toString()).toEqual(`[ 0: 0, 2: 2 ]`);
        expect(new Arr([[-1, "a"], [2, "b"]]).toString()).toEqual(`[ -1: "a", 2: "b" ]`);
    });
});
