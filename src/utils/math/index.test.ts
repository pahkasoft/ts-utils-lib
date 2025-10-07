import * as MathUtils from ".";

describe("MathUtil", () => {

    it("isInteger", () => {
        expect(MathUtils.isInteger(0)).toEqual(true);
        expect(MathUtils.isInteger(999)).toEqual(true);
        expect(MathUtils.isInteger(-999)).toEqual(true);

        expect(MathUtils.isInteger(0.5)).toEqual(false);
        expect(MathUtils.isInteger(-0.5)).toEqual(false);
        expect(MathUtils.isInteger(NaN)).toEqual(false);
        expect(MathUtils.isInteger(Infinity)).toEqual(false);
        expect(MathUtils.isInteger(-Infinity)).toEqual(false);

        expect(MathUtils.isInteger("0")).toEqual(false);
    });
});