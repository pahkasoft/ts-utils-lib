import { Assert } from "..";

describe("Assert", () => {

    // Helper to catch thrown errors
    function expectThrow(fn: () => any, msgPart?: string) {
        try {
            fn();
            fail("Expected function to throw");
        }
        catch (e: any) {
            if (msgPart) {
                expect(e.message).toContain(msgPart);
            }
            else {
                expect(e).toBeInstanceOf(Error);
            }
        }
    }

    describe("Basic", () => {
        it("assert() should not throw on truthy", () => {
            expect(() => Assert.assert(true)).not.toThrow();
        });

        it("assert() should throw on falsy", () => {
            expectThrow(() => Assert.assert(false), "Assertion Failed!");
        });

        it("require() should return value if defined", () => {
            const val = Assert.require("abc");
            expect(val).toBe("abc");
        });

        it("require() should throw on null or undefined", () => {
            expectThrow(() => Assert.require(null), "not to be nullish");
            expectThrow(() => Assert.require(undefined), "not to be nullish");
        });

        it("requireDefined() should throw only on undefined", () => {
            expect(() => Assert.requireDefined("a")).not.toThrow();
            expectThrow(() => Assert.requireDefined(undefined), "not to be undefined");
        });

        it("fail() always throws", () => {
            expectThrow(() => Assert.fail("oops"), "oops");
        });
    });

    describe("Equality", () => {
        it("isEqual() passes for same value", () => {
            expect(() => Assert.isEqual(5, 5)).not.toThrow();
        });
        it("isEqual() fails for different", () => {
            expectThrow(() => Assert.isEqual(5, 6), "equal");
        });

        it("isDeepEqual() passes for same object", () => {
            const a = { x: 1, y: [2] };
            const b = { x: 1, y: [2] };
            expect(() => Assert.isDeepEqual(a, b)).not.toThrow();
        });
        it("isDeepEqual() fails for different", () => {
            expectThrow(() => Assert.isDeepEqual({ a: 1 }, { a: 2 }), "deep equal");
        });
    });

    describe("Type checks", () => {
        it("isUndefined / isNull / isNullish", () => {
            expect(() => Assert.isUndefined(undefined)).not.toThrow();
            expect(() => Assert.isNull(null)).not.toThrow();
            expect(() => Assert.isNullish(undefined)).not.toThrow();
            expectThrow(() => Assert.isUndefined("x"));
            expectThrow(() => Assert.isNull(1));
            expectThrow(() => Assert.isNullish("y"));
        });

        it("isObject and isArray", () => {
            expect(() => Assert.isObject({ a: 1 })).not.toThrow();
            expectThrow(() => Assert.isObject(null));
            expect(() => Assert.isArray([])).not.toThrow();
            expectThrow(() => Assert.isArray("x"));
        });

        it("isTypedObject", () => {
            expect(() => Assert.isTypedObject({ a: 1, b: "x" }, ["a", "b"])).not.toThrow();
            expectThrow(() => Assert.isTypedObject({ a: 1 }, ["c"]));
        });

        it("isString variations", () => {
            expect(() => Assert.isString("abc")).not.toThrow();
            expectThrow(() => Assert.isString(1));

            expect(() => Assert.isEmptyString("")).not.toThrow();
            expectThrow(() => Assert.isEmptyString("x"));

            expect(() => Assert.isNonEmptyString("hi")).not.toThrow();
            expectThrow(() => Assert.isNonEmptyString(""));
        });

        it("isBoolean", () => {
            expect(() => Assert.isBoolean(false)).not.toThrow();
            expectThrow(() => Assert.isBoolean(0));
        });

        it("isFunction", () => {
            expect(() => Assert.isFunction(() => { })).not.toThrow();
            expectThrow(() => Assert.isFunction(123));
        });

        it("isNumber / isInteger", () => {
            expect(() => Assert.isNumber(1)).not.toThrow();
            expect(() => Assert.isInteger(2)).not.toThrow();
            expectThrow(() => Assert.isInteger(2.5));
            expectThrow(() => Assert.isNumber("a"));
        });

        it("isFinite / isNaNValue / isInfinity", () => {
            expect(() => Assert.isFinite(5)).not.toThrow();
            expectThrow(() => Assert.isFinite(Infinity));

            expect(() => Assert.isNaNValue(NaN)).not.toThrow();
            expectThrow(() => Assert.isNaNValue(1));

            expect(() => Assert.isInfinity(Infinity)).not.toThrow();
            expectThrow(() => Assert.isInfinity(1));
        });
    });

    describe("Range and comparison", () => {
        it("isIntegerBetween", () => {
            expect(() => Assert.isIntegerBetween(3, 1, 5)).not.toThrow();
            expectThrow(() => Assert.isIntegerBetween(10, 1, 5));
        });

        it("isNumberBetweenExclusive", () => {
            expect(() => Assert.isNumberBetweenExclusive(2, 1, 3)).not.toThrow();
            expectThrow(() => Assert.isNumberBetweenExclusive(1, 1, 3));
        });
    });

    describe("Array and inclusion", () => {
        const arr = [1, 2, 3];
        it("isIncluded() works", () => {
            expect(() => Assert.isIncluded(2, arr)).not.toThrow();
            expectThrow(() => Assert.isIncluded(5, arr));
        });

        it("isArrayIndex() works", () => {
            expect(() => Assert.isArrayIndex(1, arr)).not.toThrow();
            expectThrow(() => Assert.isArrayIndex(5, arr));
        });
    });
});

