import * as MathUtils from ".";

describe("MathUtil", () => {

    it("isInteger", () => {
        expect(MathUtils.isInteger(0)).toBeTrue();
        expect(MathUtils.isInteger(999)).toBeTrue();
        expect(MathUtils.isInteger(-999)).toBeTrue();

        expect(MathUtils.isInteger(0.5)).toBeFalse();
        expect(MathUtils.isInteger(-0.5)).toBeFalse();
        expect(MathUtils.isInteger(NaN)).toBeFalse();
        expect(MathUtils.isInteger(Infinity)).toBeFalse();
        expect(MathUtils.isInteger(-Infinity)).toBeFalse();

        expect(MathUtils.isInteger("0")).toBeFalse();
    });
});