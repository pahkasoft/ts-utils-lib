import { Assert } from "./assert";

describe("Assert namespace", () => {

    describe("setErrorClass()", () => {
        class CustomError extends Error {}
        it("should change error class used by assertions", () => {
            Assert.setErrorClass(CustomError);
            expect(() => Assert.assert(false)).toThrowError(CustomError);
            Assert.setErrorClass(); // reset to default
        });
    });

    describe("assert()", () => {
        it("should not throw when truthy", () => {
            expect(() => Assert.assert(true)).not.toThrow();
        });
        it("should throw when falsy", () => {
            expect(() => Assert.assert(0, "fail")).toThrowError(/fail/);
        });
    });

    describe("assertEnum()", () => {
        enum MyEnum { A = "a", B = "b" }
        it("should accept valid enum value", () => {
            expect(() => Assert.assertEnum("a", MyEnum)).not.toThrow();
        });
        it("should throw for invalid enum", () => {
            expect(() => Assert.assertEnum("x", MyEnum)).toThrowError(TypeError);
        });
    });

    describe("interrupt()", () => {
        it("should always throw", () => {
            expect(() => Assert.interrupt()).toThrowError(/Interrupted!/);
        });
    });

    describe("int()", () => {
        it("should return integer", () => {
            expect(Assert.int(5)).toBe(5);
        });
        it("should throw for non-integer", () => {
            expect(() => Assert.int(5.1)).toThrowError(/integer/);
        });
    });

    describe("eq()", () => {
        it("should pass when equal", () => {
            expect(Assert.eq(3, 3)).toBe(3);
        });
        it("should throw when not equal", () => {
            expect(() => Assert.eq(1, 2)).toThrowError(/equal/);
        });
    });

    describe("integer comparison assertions", () => {
        it("should validate int_eq correctly", () => {
            expect(Assert.int_eq(5, 5)).toBe(5);
            expect(() => Assert.int_eq(5, 6)).toThrowError(/integer equal/);
        });
        it("should validate lt/lte", () => {
            expect(Assert.int_lt(2, 3)).toBe(2);
            expect(Assert.int_lte(2, 2)).toBe(2);
            expect(() => Assert.int_lt(3, 2)).toThrowError(/less/);
        });
        it("should validate gt/gte", () => {
            expect(Assert.int_gt(3, 2)).toBe(3);
            expect(Assert.int_gte(2, 2)).toBe(2);
            expect(() => Assert.int_gt(2, 3)).toThrowError(/greater/);
        });
        it("should validate between", () => {
            expect(Assert.int_between(5, 1, 10)).toBe(5);
            expect(() => Assert.int_between(11, 1, 10)).toThrowError(/between/);
        });
    });

    describe("odd/even", () => {
        it("should pass for correct parity", () => {
            expect(Assert.odd(3)).toBe(3);
            expect(Assert.even(4)).toBe(4);
        });
        it("should throw otherwise", () => {
            expect(() => Assert.odd(4)).toThrowError(/odd/);
            expect(() => Assert.even(3)).toThrowError(/even/);
        });
    });

    describe("in_group()", () => {
        const arr = [1, 2, 3];
        it("should pass for member", () => {
            expect(Assert.in_group(2, arr)).toBe(2);
        });
        it("should throw for non-member", () => {
            expect(() => Assert.in_group(4, arr)).toThrowError(/group/);
        });
    });

    describe("finite()", () => {
        it("should pass for finite", () => {
            expect(Assert.finite(5)).toBe(5);
        });
        it("should throw for Infinity", () => {
            expect(() => Assert.finite(Infinity)).toThrowError(/finite/);
        });
    });

    describe("array_id() and array_elem()", () => {
        const nums = [10, 20, 30];
        it("should validate index and return id", () => {
            expect(Assert.array_id(nums, 1)).toBe(1);
            expect(Assert.array_elem(nums, 2)).toBe(30);
        });
        it("should throw for out of bounds", () => {
            expect(() => Assert.array_id(nums, 3)).toThrowError(/array index/);
        });
    });

    describe("require()", () => {
        it("should pass when defined", () => {
            expect(Assert.require("val")).toBe("val");
        });
        it("should throw when undefined", () => {
            expect(() => Assert.require(undefined)).toThrowError(/Required/);
        });
    });
});
