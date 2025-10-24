import * as Guard from ".";

class A { }
function F() { }
enum E { Num7 = 7, Str = "Str" }

describe("Is", () => {
    it("isNull", () => {
        expect(Guard.isNull({})).toEqual(false);
        expect(Guard.isNull(new A())).toEqual(false);
        expect(Guard.isNull(F)).toEqual(false);
        expect(Guard.isNull(E)).toEqual(false);
        expect(Guard.isNull("string")).toEqual(false);
        expect(Guard.isNull([0, 1, 2])).toEqual(false);
        expect(Guard.isNull(7)).toEqual(false);
        expect(Guard.isNull(null)).toEqual(true);
        expect(Guard.isNull(0)).toEqual(false);
        expect(Guard.isNull(undefined)).toEqual(false);
    });

    it("isUndefined", () => {
        expect(Guard.isUndefined({})).toEqual(false);
        expect(Guard.isUndefined(new A())).toEqual(false);
        expect(Guard.isUndefined(F)).toEqual(false);
        expect(Guard.isUndefined(E)).toEqual(false);
        expect(Guard.isUndefined("string")).toEqual(false);
        expect(Guard.isUndefined([0, 1, 2])).toEqual(false);
        expect(Guard.isUndefined(7)).toEqual(false);
        expect(Guard.isUndefined(null)).toEqual(false);
        expect(Guard.isUndefined(0)).toEqual(false);
        expect(Guard.isUndefined(undefined)).toEqual(true);
    });

    it("isObject", () => {
        expect(Guard.isObject({})).toEqual(true);
        expect(Guard.isObject(new A())).toEqual(true);
        expect(Guard.isObject(F)).toEqual(false);
        expect(Guard.isObject(E)).toEqual(true); // Enum is object in ts.
        expect(Guard.isObject("string")).toEqual(false);
        expect(Guard.isObject([0, 1, 2])).toEqual(false);
        expect(Guard.isObject(7)).toEqual(false);
        expect(Guard.isObject(null)).toEqual(false);
        expect(Guard.isObject(0)).toEqual(false);
        expect(Guard.isObject(undefined)).toEqual(false);
    });

    it("isObjectOrUndefined", () => {
        expect(Guard.isObjectOrUndefined({})).toEqual(true);
        expect(Guard.isObject(new A())).toEqual(true);
        expect(Guard.isObject(F)).toEqual(false);
        expect(Guard.isObject(E)).toEqual(true);
        expect(Guard.isObjectOrUndefined("string")).toEqual(false);
        expect(Guard.isObjectOrUndefined([0, 1, 2])).toEqual(false);
        expect(Guard.isObjectOrUndefined(7)).toEqual(false);
        expect(Guard.isObjectOrUndefined(null)).toEqual(false);
        expect(Guard.isObjectOrUndefined(0)).toEqual(false);
        expect(Guard.isObjectOrUndefined(undefined)).toEqual(true);
    });

    it("isArray", () => {
        expect(Guard.isArray({})).toEqual(false);
        expect(Guard.isArray(new A())).toEqual(false);
        expect(Guard.isArray(F)).toEqual(false);
        expect(Guard.isArray(E)).toEqual(false);
        expect(Guard.isArray("string")).toEqual(false);
        expect(Guard.isArray([0, 1, 2])).toEqual(true);
        expect(Guard.isArray(7)).toEqual(false);
        expect(Guard.isArray(null)).toEqual(false);
        expect(Guard.isArray(0)).toEqual(false);
        expect(Guard.isArray(undefined)).toEqual(false);
    });

    it("isArrayOrUndefined", () => {
        expect(Guard.isArrayOrUndefined({})).toEqual(false);
        expect(Guard.isArrayOrUndefined(new A())).toEqual(false);
        expect(Guard.isArrayOrUndefined(F)).toEqual(false);
        expect(Guard.isArrayOrUndefined(E)).toEqual(false);
        expect(Guard.isArrayOrUndefined("string")).toEqual(false);
        expect(Guard.isArrayOrUndefined([0, 1, 2])).toEqual(true);
        expect(Guard.isArrayOrUndefined(7)).toEqual(false);
        expect(Guard.isArrayOrUndefined(null)).toEqual(false);
        expect(Guard.isArrayOrUndefined(0)).toEqual(false);
        expect(Guard.isArrayOrUndefined(undefined)).toEqual(true);
    });

    it("isString", () => {
        expect(Guard.isString({})).toEqual(false);
        expect(Guard.isString(new A())).toEqual(false);
        expect(Guard.isString(F)).toEqual(false);
        expect(Guard.isString(E)).toEqual(false);
        expect(Guard.isString(E.Num7)).toEqual(false);
        expect(Guard.isString(E.Str)).toEqual(true); // Enum string value.
        expect(Guard.isString("string")).toEqual(true);
        expect(Guard.isString("")).toEqual(true);
        expect(Guard.isString([0, 1, 2])).toEqual(false);
        expect(Guard.isString(7)).toEqual(false);
        expect(Guard.isString(null)).toEqual(false);
        expect(Guard.isString(0)).toEqual(false);
        expect(Guard.isString(undefined)).toEqual(false);
    });

    it("isStringOrUndefined", () => {
        expect(Guard.isStringOrUndefined({})).toEqual(false);
        expect(Guard.isStringOrUndefined(new A())).toEqual(false);
        expect(Guard.isStringOrUndefined(F)).toEqual(false);
        expect(Guard.isStringOrUndefined(E)).toEqual(false);
        expect(Guard.isStringOrUndefined(E.Num7)).toEqual(false);
        expect(Guard.isStringOrUndefined(E.Str)).toEqual(true); // Enum string value.
        expect(Guard.isStringOrUndefined("string")).toEqual(true);
        expect(Guard.isStringOrUndefined("")).toEqual(true);
        expect(Guard.isStringOrUndefined([0, 1, 2])).toEqual(false);
        expect(Guard.isStringOrUndefined(7)).toEqual(false);
        expect(Guard.isStringOrUndefined(null)).toEqual(false);
        expect(Guard.isStringOrUndefined(0)).toEqual(false);
        expect(Guard.isStringOrUndefined(undefined)).toEqual(true);
    });

    it("isBoolean", () => {
        expect(Guard.isBoolean({})).toEqual(false);
        expect(Guard.isBoolean(new A())).toEqual(false);
        expect(Guard.isBoolean(F)).toEqual(false);
        expect(Guard.isBoolean(E)).toEqual(false);
        expect(Guard.isBoolean("string")).toEqual(false);
        expect(Guard.isBoolean("")).toEqual(false);
        expect(Guard.isBoolean([0, 1, 2])).toEqual(false);
        expect(Guard.isBoolean(7)).toEqual(false);
        expect(Guard.isBoolean(null)).toEqual(false);
        expect(Guard.isBoolean(0)).toEqual(false);
        expect(Guard.isBoolean(undefined)).toEqual(false);
        expect(Guard.isBoolean(true)).toEqual(true);
        expect(Guard.isBoolean(false)).toEqual(true);
        expect(Guard.isBoolean("true")).toEqual(false);
        expect(Guard.isBoolean("false")).toEqual(false);
    });

    it("isBooleanOrUndefined", () => {
        expect(Guard.isBooleanOrUndefined({})).toEqual(false);
        expect(Guard.isBooleanOrUndefined(new A())).toEqual(false);
        expect(Guard.isBooleanOrUndefined(F)).toEqual(false);
        expect(Guard.isBooleanOrUndefined(E)).toEqual(false);
        expect(Guard.isBooleanOrUndefined("string")).toEqual(false);
        expect(Guard.isBooleanOrUndefined("")).toEqual(false);
        expect(Guard.isBooleanOrUndefined([0, 1, 2])).toEqual(false);
        expect(Guard.isBooleanOrUndefined(7)).toEqual(false);
        expect(Guard.isBooleanOrUndefined(null)).toEqual(false);
        expect(Guard.isBooleanOrUndefined(0)).toEqual(false);
        expect(Guard.isBooleanOrUndefined(undefined)).toEqual(true);
        expect(Guard.isBooleanOrUndefined(true)).toEqual(true);
        expect(Guard.isBooleanOrUndefined(false)).toEqual(true);
        expect(Guard.isBooleanOrUndefined("true")).toEqual(false);
        expect(Guard.isBooleanOrUndefined("false")).toEqual(false);
    });

    it("isFunction", () => {
        expect(Guard.isFunction({})).toEqual(false);
        expect(Guard.isFunction(new A())).toEqual(false);
        expect(Guard.isFunction("string")).toEqual(false);
        expect(Guard.isFunction("")).toEqual(false);
        expect(Guard.isFunction([0, 1, 2])).toEqual(false);
        expect(Guard.isFunction(7)).toEqual(false);
        expect(Guard.isFunction(null)).toEqual(false);
        expect(Guard.isFunction(0)).toEqual(false);
        expect(Guard.isFunction(undefined)).toEqual(false);
        expect(Guard.isFunction(true)).toEqual(false);
        expect(Guard.isFunction(false)).toEqual(false);
        expect(Guard.isFunction("true")).toEqual(false);
        expect(Guard.isFunction("false")).toEqual(false);
        expect(Guard.isFunction(F)).toEqual(true);
        expect(Guard.isFunction(() => { })).toEqual(true);
    });

    it("isFunctionOrUndefined", () => {
        expect(Guard.isFunctionOrUndefined({})).toEqual(false);
        expect(Guard.isFunctionOrUndefined(new A())).toEqual(false);
        expect(Guard.isFunctionOrUndefined("string")).toEqual(false);
        expect(Guard.isFunctionOrUndefined("")).toEqual(false);
        expect(Guard.isFunctionOrUndefined([0, 1, 2])).toEqual(false);
        expect(Guard.isFunctionOrUndefined(7)).toEqual(false);
        expect(Guard.isFunctionOrUndefined(null)).toEqual(false);
        expect(Guard.isFunctionOrUndefined(0)).toEqual(false);
        expect(Guard.isFunctionOrUndefined(undefined)).toEqual(true);
        expect(Guard.isFunctionOrUndefined(true)).toEqual(false);
        expect(Guard.isFunctionOrUndefined(false)).toEqual(false);
        expect(Guard.isFunctionOrUndefined("true")).toEqual(false);
        expect(Guard.isFunctionOrUndefined("false")).toEqual(false);
        expect(Guard.isFunctionOrUndefined(F)).toEqual(true);
        expect(Guard.isFunctionOrUndefined(() => { })).toEqual(true);
    });

    it("isNumber", () => {
        expect(Guard.isNumber({})).toEqual(false);
        expect(Guard.isNumber(new A())).toEqual(false);
        expect(Guard.isNumber(E.Num7)).toEqual(true); // Enum number value.
        expect(Guard.isNumber(E.Str)).toEqual(false);
        expect(Guard.isNumber("string")).toEqual(false);
        expect(Guard.isNumber("")).toEqual(false);
        expect(Guard.isNumber([0, 1, 2])).toEqual(false);
        expect(Guard.isNumber(7)).toEqual(true);
        expect(Guard.isNumber(-0.1)).toEqual(true);
        expect(Guard.isNumber(Infinity)).toEqual(true);
        expect(Guard.isNumber(NaN)).toEqual(true);
        expect(Guard.isNumber(null)).toEqual(false);
        expect(Guard.isNumber(0)).toEqual(true);
        expect(Guard.isNumber(undefined)).toEqual(false);
    });

    it("isNumberOrUndefined", () => {
        expect(Guard.isNumberOrUndefined({})).toEqual(false);
        expect(Guard.isNumberOrUndefined(new A())).toEqual(false);
        expect(Guard.isNumberOrUndefined(E.Num7)).toEqual(true); // Enum number value.
        expect(Guard.isNumberOrUndefined(E.Str)).toEqual(false);
        expect(Guard.isNumberOrUndefined("string")).toEqual(false);
        expect(Guard.isNumberOrUndefined("")).toEqual(false);
        expect(Guard.isNumberOrUndefined([0, 1, 2])).toEqual(false);
        expect(Guard.isNumberOrUndefined(7)).toEqual(true);
        expect(Guard.isNumberOrUndefined(-0.1)).toEqual(true);
        expect(Guard.isNumberOrUndefined(Infinity)).toEqual(true);
        expect(Guard.isNumberOrUndefined(NaN)).toEqual(true);
        expect(Guard.isNumberOrUndefined(null)).toEqual(false);
        expect(Guard.isNumberOrUndefined(0)).toEqual(true);
        expect(Guard.isNumberOrUndefined(undefined)).toEqual(true);
    });

    it("isEnumValue", () => {
        expect(Guard.isEnumValue({}, E)).toEqual(false);
        expect(Guard.isEnumValue(new A(), E)).toEqual(false);
        expect(Guard.isEnumValue([0, 1, 2], E)).toEqual(false);
        expect(Guard.isEnumValue(null, E)).toEqual(false);
        expect(Guard.isEnumValue(undefined, E)).toEqual(false);
        expect(Guard.isEnumValue(E, E)).toEqual(false);
        expect(Guard.isEnumValue(E.Str, E)).toEqual(true);
        expect(Guard.isEnumValue("Str", E)).toEqual(true);
        expect(Guard.isEnumValue(E.Num7, E)).toEqual(true);
        expect(Guard.isEnumValue(7, E)).toEqual(true);
        expect(Guard.isEnumValue("Not", E)).toEqual(false);
        expect(Guard.isEnumValue(88, E)).toEqual(false);
    });

    it("isEnumValueOrUndefined", () => {
        expect(Guard.isEnumValueOrUndefined({}, E)).toEqual(false);
        expect(Guard.isEnumValueOrUndefined(new A(), E)).toEqual(false);
        expect(Guard.isEnumValueOrUndefined([0, 1, 2], E)).toEqual(false);
        expect(Guard.isEnumValueOrUndefined(null, E)).toEqual(false);
        expect(Guard.isEnumValueOrUndefined(undefined, E)).toEqual(true);
        expect(Guard.isEnumValueOrUndefined(E, E)).toEqual(false);
        expect(Guard.isEnumValueOrUndefined(E.Str, E)).toEqual(true);
        expect(Guard.isEnumValueOrUndefined("Str", E)).toEqual(true);
        expect(Guard.isEnumValueOrUndefined(E.Num7, E)).toEqual(true);
        expect(Guard.isEnumValueOrUndefined(7, E)).toEqual(true);
        expect(Guard.isEnumValueOrUndefined("Not", E)).toEqual(false);
        expect(Guard.isEnumValueOrUndefined(88, E)).toEqual(false);
    });

    it("isInteger", () => {
        expect(Guard.isInteger(0)).toEqual(true);
        expect(Guard.isInteger(7)).toEqual(true);
        expect(Guard.isInteger(-7)).toEqual(true);
        expect(Guard.isInteger(4.5)).toEqual(false);
        expect(Guard.isInteger(-4.5)).toEqual(false);
        expect(Guard.isInteger(Infinity)).toEqual(false);
        expect(Guard.isInteger(-Infinity)).toEqual(false);
        expect(Guard.isInteger(NaN)).toEqual(false);
        expect(Guard.isInteger("0")).toEqual(false);
        expect(Guard.isInteger("-6")).toEqual(false);
        expect(Guard.isInteger("6")).toEqual(false);
        expect(Guard.isInteger([9])).toEqual(false);
        expect(Guard.isInteger({})).toEqual(false);
        expect(Guard.isInteger(new A())).toEqual(false);
        expect(Guard.isInteger([0, 1, 2])).toEqual(false);
        expect(Guard.isInteger(null)).toEqual(false);
        expect(Guard.isInteger(undefined)).toEqual(false);
        expect(Guard.isInteger(E)).toEqual(false);
        expect(Guard.isInteger(E.Str)).toEqual(false);
        expect(Guard.isInteger(E.Num7)).toEqual(true);
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
