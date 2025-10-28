import * as ObjUtils from ".";

describe("ObjUtils", () => {
    it("hasProperties", () => {
        expect(ObjUtils.hasProperties({ a: 1, b: 2 }, ["a", "b"])).toBeTrue();
        expect(ObjUtils.hasProperties({ a: 1, b: 2 }, ["a"])).toBeTrue();
        expect(ObjUtils.hasProperties({ a: 1, b: 2 }, ["b"])).toBeTrue();
        expect(ObjUtils.hasProperties({ a: 1, b: 2 }, [])).toBeTrue();
        expect(ObjUtils.hasProperties({ a: 1 }, ["a", "b"])).toBeFalse();
        expect(ObjUtils.hasProperties({ a: 1, b: null }, ["a", "b"])).toBeTrue();
        expect(ObjUtils.hasProperties({ a: 1, b: undefined }, ["a", "b"])).toBeTrue(); // Has undefined unless deleted..
    });
});
