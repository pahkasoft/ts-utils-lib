import * as ObjUtils from ".";

describe("ObjUtils", () => {
    it("hasProperties", () => {
        expect(ObjUtils.hasProperties({ a: 1, b: 2 }, ["a", "b"])).toEqual(true);
        expect(ObjUtils.hasProperties({ a: 1, b: 2 }, ["a"])).toEqual(true);
        expect(ObjUtils.hasProperties({ a: 1, b: 2 }, ["b"])).toEqual(true);
        expect(ObjUtils.hasProperties({ a: 1, b: 2 }, [])).toEqual(true);
        expect(ObjUtils.hasProperties({ a: 1 }, ["a", "b"])).toEqual(false);
        expect(ObjUtils.hasProperties({ a: 1, b: null }, ["a", "b"])).toEqual(true);
        expect(ObjUtils.hasProperties({ a: 1, b: undefined }, ["a", "b"])).toEqual(true); // Has undefined unless deleted..
    });
});
