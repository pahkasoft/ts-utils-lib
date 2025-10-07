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

    it("cmp", () => {
        expect(MathUtils.cmp(0, 0)).toEqual(0);
        expect(MathUtils.cmp(2, 2)).toEqual(0);
        expect(MathUtils.cmp(-2, -2)).toEqual(0);
        expect(MathUtils.cmp(0, 2)).toEqual(-1);
        expect(MathUtils.cmp(2, 0)).toEqual(1);
        expect(MathUtils.cmp(Infinity, Infinity)).toEqual(0);
        expect(MathUtils.cmp(-Infinity, Infinity)).toEqual(-1);
        expect(MathUtils.cmp(Infinity, -Infinity)).toEqual(1);
        expect(MathUtils.cmp(NaN, 1)).toEqual(0);
        expect(MathUtils.cmp(1, NaN)).toEqual(0);
        expect(MathUtils.cmp(NaN, NaN)).toEqual(0);
    });
});