import * as Guard from ".";

class A { }
function F() { }
enum E { Num7 = 7, Str = "Str" }

describe("Is", () => {
    it("isNull", () => {
        expect(Guard.isNull({})).toBeFalse();
        expect(Guard.isNull(new A())).toBeFalse();
        expect(Guard.isNull(F)).toBeFalse();
        expect(Guard.isNull(E)).toBeFalse();
        expect(Guard.isNull("string")).toBeFalse();
        expect(Guard.isNull([0, 1, 2])).toBeFalse();
        expect(Guard.isNull(7)).toBeFalse();
        expect(Guard.isNull(null)).toBeTrue();
        expect(Guard.isNull(0)).toBeFalse();
        expect(Guard.isNull(undefined)).toBeFalse();
    });

    it("isUndefined", () => {
        expect(Guard.isUndefined({})).toBeFalse();
        expect(Guard.isUndefined(new A())).toBeFalse();
        expect(Guard.isUndefined(F)).toBeFalse();
        expect(Guard.isUndefined(E)).toBeFalse();
        expect(Guard.isUndefined("string")).toBeFalse();
        expect(Guard.isUndefined([0, 1, 2])).toBeFalse();
        expect(Guard.isUndefined(7)).toBeFalse();
        expect(Guard.isUndefined(null)).toBeFalse();
        expect(Guard.isUndefined(0)).toBeFalse();
        expect(Guard.isUndefined(undefined)).toBeTrue();
    });

    it("isObject", () => {
        expect(Guard.isObject({})).toBeTrue();
        expect(Guard.isObject(new A())).toBeTrue();
        expect(Guard.isObject(F)).toBeFalse();
        expect(Guard.isObject(E)).toBeTrue(); // Enum is object in ts.
        expect(Guard.isObject("string")).toBeFalse();
        expect(Guard.isObject([0, 1, 2])).toBeFalse();
        expect(Guard.isObject(7)).toBeFalse();
        expect(Guard.isObject(null)).toBeFalse();
        expect(Guard.isObject(0)).toBeFalse();
        expect(Guard.isObject(undefined)).toBeFalse();
    });

    it("isObjectOrUndefined", () => {
        expect(Guard.isObjectOrUndefined({})).toBeTrue();
        expect(Guard.isObject(new A())).toBeTrue();
        expect(Guard.isObject(F)).toBeFalse();
        expect(Guard.isObject(E)).toBeTrue();
        expect(Guard.isObjectOrUndefined("string")).toBeFalse();
        expect(Guard.isObjectOrUndefined([0, 1, 2])).toBeFalse();
        expect(Guard.isObjectOrUndefined(7)).toBeFalse();
        expect(Guard.isObjectOrUndefined(null)).toBeFalse();
        expect(Guard.isObjectOrUndefined(0)).toBeFalse();
        expect(Guard.isObjectOrUndefined(undefined)).toBeTrue();
    });

    it("isArray", () => {
        expect(Guard.isArray({})).toBeFalse();
        expect(Guard.isArray(new A())).toBeFalse();
        expect(Guard.isArray(F)).toBeFalse();
        expect(Guard.isArray(E)).toBeFalse();
        expect(Guard.isArray("string")).toBeFalse();
        expect(Guard.isArray([0, 1, 2])).toBeTrue();
        expect(Guard.isArray(7)).toBeFalse();
        expect(Guard.isArray(null)).toBeFalse();
        expect(Guard.isArray(0)).toBeFalse();
        expect(Guard.isArray(undefined)).toBeFalse();
    });

    it("isArrayOrUndefined", () => {
        expect(Guard.isArrayOrUndefined({})).toBeFalse();
        expect(Guard.isArrayOrUndefined(new A())).toBeFalse();
        expect(Guard.isArrayOrUndefined(F)).toBeFalse();
        expect(Guard.isArrayOrUndefined(E)).toBeFalse();
        expect(Guard.isArrayOrUndefined("string")).toBeFalse();
        expect(Guard.isArrayOrUndefined([0, 1, 2])).toBeTrue();
        expect(Guard.isArrayOrUndefined(7)).toBeFalse();
        expect(Guard.isArrayOrUndefined(null)).toBeFalse();
        expect(Guard.isArrayOrUndefined(0)).toBeFalse();
        expect(Guard.isArrayOrUndefined(undefined)).toBeTrue();
    });

    it("isString", () => {
        expect(Guard.isString({})).toBeFalse();
        expect(Guard.isString(new A())).toBeFalse();
        expect(Guard.isString(F)).toBeFalse();
        expect(Guard.isString(E)).toBeFalse();
        expect(Guard.isString(E.Num7)).toBeFalse();
        expect(Guard.isString(E.Str)).toBeTrue(); // Enum string value.
        expect(Guard.isString("string")).toBeTrue();
        expect(Guard.isString("")).toBeTrue();
        expect(Guard.isString([0, 1, 2])).toBeFalse();
        expect(Guard.isString(7)).toBeFalse();
        expect(Guard.isString(null)).toBeFalse();
        expect(Guard.isString(0)).toBeFalse();
        expect(Guard.isString(undefined)).toBeFalse();
    });

    it("isStringOrUndefined", () => {
        expect(Guard.isStringOrUndefined({})).toBeFalse();
        expect(Guard.isStringOrUndefined(new A())).toBeFalse();
        expect(Guard.isStringOrUndefined(F)).toBeFalse();
        expect(Guard.isStringOrUndefined(E)).toBeFalse();
        expect(Guard.isStringOrUndefined(E.Num7)).toBeFalse();
        expect(Guard.isStringOrUndefined(E.Str)).toBeTrue(); // Enum string value.
        expect(Guard.isStringOrUndefined("string")).toBeTrue();
        expect(Guard.isStringOrUndefined("")).toBeTrue();
        expect(Guard.isStringOrUndefined([0, 1, 2])).toBeFalse();
        expect(Guard.isStringOrUndefined(7)).toBeFalse();
        expect(Guard.isStringOrUndefined(null)).toBeFalse();
        expect(Guard.isStringOrUndefined(0)).toBeFalse();
        expect(Guard.isStringOrUndefined(undefined)).toBeTrue();
    });

    it("isBoolean", () => {
        expect(Guard.isBoolean({})).toBeFalse();
        expect(Guard.isBoolean(new A())).toBeFalse();
        expect(Guard.isBoolean(F)).toBeFalse();
        expect(Guard.isBoolean(E)).toBeFalse();
        expect(Guard.isBoolean("string")).toBeFalse();
        expect(Guard.isBoolean("")).toBeFalse();
        expect(Guard.isBoolean([0, 1, 2])).toBeFalse();
        expect(Guard.isBoolean(7)).toBeFalse();
        expect(Guard.isBoolean(null)).toBeFalse();
        expect(Guard.isBoolean(0)).toBeFalse();
        expect(Guard.isBoolean(undefined)).toBeFalse();
        expect(Guard.isBoolean(true)).toBeTrue();
        expect(Guard.isBoolean(false)).toBeTrue();
        expect(Guard.isBoolean("true")).toBeFalse();
        expect(Guard.isBoolean("false")).toBeFalse();
    });

    it("isBooleanOrUndefined", () => {
        expect(Guard.isBooleanOrUndefined({})).toBeFalse();
        expect(Guard.isBooleanOrUndefined(new A())).toBeFalse();
        expect(Guard.isBooleanOrUndefined(F)).toBeFalse();
        expect(Guard.isBooleanOrUndefined(E)).toBeFalse();
        expect(Guard.isBooleanOrUndefined("string")).toBeFalse();
        expect(Guard.isBooleanOrUndefined("")).toBeFalse();
        expect(Guard.isBooleanOrUndefined([0, 1, 2])).toBeFalse();
        expect(Guard.isBooleanOrUndefined(7)).toBeFalse();
        expect(Guard.isBooleanOrUndefined(null)).toBeFalse();
        expect(Guard.isBooleanOrUndefined(0)).toBeFalse();
        expect(Guard.isBooleanOrUndefined(undefined)).toBeTrue();
        expect(Guard.isBooleanOrUndefined(true)).toBeTrue();
        expect(Guard.isBooleanOrUndefined(false)).toBeTrue();
        expect(Guard.isBooleanOrUndefined("true")).toBeFalse();
        expect(Guard.isBooleanOrUndefined("false")).toBeFalse();
    });

    it("isFunction", () => {
        expect(Guard.isFunction({})).toBeFalse();
        expect(Guard.isFunction(new A())).toBeFalse();
        expect(Guard.isFunction("string")).toBeFalse();
        expect(Guard.isFunction("")).toBeFalse();
        expect(Guard.isFunction([0, 1, 2])).toBeFalse();
        expect(Guard.isFunction(7)).toBeFalse();
        expect(Guard.isFunction(null)).toBeFalse();
        expect(Guard.isFunction(0)).toBeFalse();
        expect(Guard.isFunction(undefined)).toBeFalse();
        expect(Guard.isFunction(true)).toBeFalse();
        expect(Guard.isFunction(false)).toBeFalse();
        expect(Guard.isFunction("true")).toBeFalse();
        expect(Guard.isFunction("false")).toBeFalse();
        expect(Guard.isFunction(F)).toBeTrue();
        expect(Guard.isFunction(() => { })).toBeTrue();
    });

    it("isFunctionOrUndefined", () => {
        expect(Guard.isFunctionOrUndefined({})).toBeFalse();
        expect(Guard.isFunctionOrUndefined(new A())).toBeFalse();
        expect(Guard.isFunctionOrUndefined("string")).toBeFalse();
        expect(Guard.isFunctionOrUndefined("")).toBeFalse();
        expect(Guard.isFunctionOrUndefined([0, 1, 2])).toBeFalse();
        expect(Guard.isFunctionOrUndefined(7)).toBeFalse();
        expect(Guard.isFunctionOrUndefined(null)).toBeFalse();
        expect(Guard.isFunctionOrUndefined(0)).toBeFalse();
        expect(Guard.isFunctionOrUndefined(undefined)).toBeTrue();
        expect(Guard.isFunctionOrUndefined(true)).toBeFalse();
        expect(Guard.isFunctionOrUndefined(false)).toBeFalse();
        expect(Guard.isFunctionOrUndefined("true")).toBeFalse();
        expect(Guard.isFunctionOrUndefined("false")).toBeFalse();
        expect(Guard.isFunctionOrUndefined(F)).toBeTrue();
        expect(Guard.isFunctionOrUndefined(() => { })).toBeTrue();
    });

    it("isNumber", () => {
        expect(Guard.isNumber({})).toBeFalse();
        expect(Guard.isNumber(new A())).toBeFalse();
        expect(Guard.isNumber(E.Num7)).toBeTrue(); // Enum number value.
        expect(Guard.isNumber(E.Str)).toBeFalse();
        expect(Guard.isNumber("string")).toBeFalse();
        expect(Guard.isNumber("")).toBeFalse();
        expect(Guard.isNumber([0, 1, 2])).toBeFalse();
        expect(Guard.isNumber(7)).toBeTrue();
        expect(Guard.isNumber(-0.1)).toBeTrue();
        expect(Guard.isNumber(Infinity)).toBeTrue();
        expect(Guard.isNumber(NaN)).toBeTrue();
        expect(Guard.isNumber(null)).toBeFalse();
        expect(Guard.isNumber(0)).toBeTrue();
        expect(Guard.isNumber(undefined)).toBeFalse();
    });

    it("isNumberOrUndefined", () => {
        expect(Guard.isNumberOrUndefined({})).toBeFalse();
        expect(Guard.isNumberOrUndefined(new A())).toBeFalse();
        expect(Guard.isNumberOrUndefined(E.Num7)).toBeTrue(); // Enum number value.
        expect(Guard.isNumberOrUndefined(E.Str)).toBeFalse();
        expect(Guard.isNumberOrUndefined("string")).toBeFalse();
        expect(Guard.isNumberOrUndefined("")).toBeFalse();
        expect(Guard.isNumberOrUndefined([0, 1, 2])).toBeFalse();
        expect(Guard.isNumberOrUndefined(7)).toBeTrue();
        expect(Guard.isNumberOrUndefined(-0.1)).toBeTrue();
        expect(Guard.isNumberOrUndefined(Infinity)).toBeTrue();
        expect(Guard.isNumberOrUndefined(NaN)).toBeTrue();
        expect(Guard.isNumberOrUndefined(null)).toBeFalse();
        expect(Guard.isNumberOrUndefined(0)).toBeTrue();
        expect(Guard.isNumberOrUndefined(undefined)).toBeTrue();
    });

    it("isEnumValue", () => {
        expect(Guard.isEnumValue({}, E)).toBeFalse();
        expect(Guard.isEnumValue(new A(), E)).toBeFalse();
        expect(Guard.isEnumValue([0, 1, 2], E)).toBeFalse();
        expect(Guard.isEnumValue(null, E)).toBeFalse();
        expect(Guard.isEnumValue(undefined, E)).toBeFalse();
        expect(Guard.isEnumValue(E, E)).toBeFalse();
        expect(Guard.isEnumValue(E.Str, E)).toBeTrue();
        expect(Guard.isEnumValue("Str", E)).toBeTrue();
        expect(Guard.isEnumValue(E.Num7, E)).toBeTrue();
        expect(Guard.isEnumValue(7, E)).toBeTrue();
        expect(Guard.isEnumValue("Not", E)).toBeFalse();
        expect(Guard.isEnumValue(88, E)).toBeFalse();
    });

    it("isEnumValueOrUndefined", () => {
        expect(Guard.isEnumValueOrUndefined({}, E)).toBeFalse();
        expect(Guard.isEnumValueOrUndefined(new A(), E)).toBeFalse();
        expect(Guard.isEnumValueOrUndefined([0, 1, 2], E)).toBeFalse();
        expect(Guard.isEnumValueOrUndefined(null, E)).toBeFalse();
        expect(Guard.isEnumValueOrUndefined(undefined, E)).toBeTrue();
        expect(Guard.isEnumValueOrUndefined(E, E)).toBeFalse();
        expect(Guard.isEnumValueOrUndefined(E.Str, E)).toBeTrue();
        expect(Guard.isEnumValueOrUndefined("Str", E)).toBeTrue();
        expect(Guard.isEnumValueOrUndefined(E.Num7, E)).toBeTrue();
        expect(Guard.isEnumValueOrUndefined(7, E)).toBeTrue();
        expect(Guard.isEnumValueOrUndefined("Not", E)).toBeFalse();
        expect(Guard.isEnumValueOrUndefined(88, E)).toBeFalse();
    });

    it("isInteger", () => {
        expect(Guard.isInteger(0)).toBeTrue();
        expect(Guard.isInteger(7)).toBeTrue();
        expect(Guard.isInteger(-7)).toBeTrue();
        expect(Guard.isInteger(4.5)).toBeFalse();
        expect(Guard.isInteger(-4.5)).toBeFalse();
        expect(Guard.isInteger(Infinity)).toBeFalse();
        expect(Guard.isInteger(-Infinity)).toBeFalse();
        expect(Guard.isInteger(NaN)).toBeFalse();
        expect(Guard.isInteger("0")).toBeFalse();
        expect(Guard.isInteger("-6")).toBeFalse();
        expect(Guard.isInteger("6")).toBeFalse();
        expect(Guard.isInteger([9])).toBeFalse();
        expect(Guard.isInteger({})).toBeFalse();
        expect(Guard.isInteger(new A())).toBeFalse();
        expect(Guard.isInteger([0, 1, 2])).toBeFalse();
        expect(Guard.isInteger(null)).toBeFalse();
        expect(Guard.isInteger(undefined)).toBeFalse();
        expect(Guard.isInteger(E)).toBeFalse();
        expect(Guard.isInteger(E.Str)).toBeFalse();
        expect(Guard.isInteger(E.Num7)).toBeTrue();
    });

    it("isOddNumber", () => {
        expect(Guard.isOddNumber(3)).toBeTrue();
        expect(Guard.isOddNumber(4)).toBeFalse();
    });

    it("isEvenNumber", () => {
        expect(Guard.isEvenNumber(3)).toBeFalse();
        expect(Guard.isEvenNumber(4)).toBeTrue();
    });
});
