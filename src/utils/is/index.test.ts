import * as Is from ".";

class A { }
function F() { }
enum E { Num7 = 7, Str = "Str" }

describe("Is", () => {
    it("isNull", () => {
        expect(Is.isNull({})).toEqual(false);
        expect(Is.isNull(new A())).toEqual(false);
        expect(Is.isNull(F)).toEqual(false);
        expect(Is.isNull(E)).toEqual(false);
        expect(Is.isNull("string")).toEqual(false);
        expect(Is.isNull([0, 1, 2])).toEqual(false);
        expect(Is.isNull(7)).toEqual(false);
        expect(Is.isNull(null)).toEqual(true);
        expect(Is.isNull(0)).toEqual(false);
        expect(Is.isNull(undefined)).toEqual(false);
    });

    it("isUndefined", () => {
        expect(Is.isUndefined({})).toEqual(false);
        expect(Is.isUndefined(new A())).toEqual(false);
        expect(Is.isUndefined(F)).toEqual(false);
        expect(Is.isUndefined(E)).toEqual(false);
        expect(Is.isUndefined("string")).toEqual(false);
        expect(Is.isUndefined([0, 1, 2])).toEqual(false);
        expect(Is.isUndefined(7)).toEqual(false);
        expect(Is.isUndefined(null)).toEqual(false);
        expect(Is.isUndefined(0)).toEqual(false);
        expect(Is.isUndefined(undefined)).toEqual(true);
    });

    it("isObject", () => {
        expect(Is.isObject({})).toEqual(true);
        expect(Is.isObject(new A())).toEqual(true);
        expect(Is.isObject(F)).toEqual(false);
        expect(Is.isObject(E)).toEqual(true); // Enum is object in ts.
        expect(Is.isObject("string")).toEqual(false);
        expect(Is.isObject([0, 1, 2])).toEqual(false);
        expect(Is.isObject(7)).toEqual(false);
        expect(Is.isObject(null)).toEqual(false);
        expect(Is.isObject(0)).toEqual(false);
        expect(Is.isObject(undefined)).toEqual(false);
    });

    it("isObjectOrUndefined", () => {
        expect(Is.isObjectOrUndefined({})).toEqual(true);
        expect(Is.isObject(new A())).toEqual(true);
        expect(Is.isObject(F)).toEqual(false);
        expect(Is.isObject(E)).toEqual(true);
        expect(Is.isObjectOrUndefined("string")).toEqual(false);
        expect(Is.isObjectOrUndefined([0, 1, 2])).toEqual(false);
        expect(Is.isObjectOrUndefined(7)).toEqual(false);
        expect(Is.isObjectOrUndefined(null)).toEqual(false);
        expect(Is.isObjectOrUndefined(0)).toEqual(false);
        expect(Is.isObjectOrUndefined(undefined)).toEqual(true);
    });

    it("isArray", () => {
        expect(Is.isArray({})).toEqual(false);
        expect(Is.isArray(new A())).toEqual(false);
        expect(Is.isArray(F)).toEqual(false);
        expect(Is.isArray(E)).toEqual(false);
        expect(Is.isArray("string")).toEqual(false);
        expect(Is.isArray([0, 1, 2])).toEqual(true);
        expect(Is.isArray(7)).toEqual(false);
        expect(Is.isArray(null)).toEqual(false);
        expect(Is.isArray(0)).toEqual(false);
        expect(Is.isArray(undefined)).toEqual(false);
    });

    it("isArrayOrUndefined", () => {
        expect(Is.isArrayOrUndefined({})).toEqual(false);
        expect(Is.isArrayOrUndefined(new A())).toEqual(false);
        expect(Is.isArrayOrUndefined(F)).toEqual(false);
        expect(Is.isArrayOrUndefined(E)).toEqual(false);
        expect(Is.isArrayOrUndefined("string")).toEqual(false);
        expect(Is.isArrayOrUndefined([0, 1, 2])).toEqual(true);
        expect(Is.isArrayOrUndefined(7)).toEqual(false);
        expect(Is.isArrayOrUndefined(null)).toEqual(false);
        expect(Is.isArrayOrUndefined(0)).toEqual(false);
        expect(Is.isArrayOrUndefined(undefined)).toEqual(true);
    });

    it("isString", () => {
        expect(Is.isString({})).toEqual(false);
        expect(Is.isString(new A())).toEqual(false);
        expect(Is.isString(F)).toEqual(false);
        expect(Is.isString(E)).toEqual(false);
        expect(Is.isString(E.Num7)).toEqual(false);
        expect(Is.isString(E.Str)).toEqual(true); // Enum string value.
        expect(Is.isString("string")).toEqual(true);
        expect(Is.isString("")).toEqual(true);
        expect(Is.isString([0, 1, 2])).toEqual(false);
        expect(Is.isString(7)).toEqual(false);
        expect(Is.isString(null)).toEqual(false);
        expect(Is.isString(0)).toEqual(false);
        expect(Is.isString(undefined)).toEqual(false);
    });

    it("isStringOrUndefined", () => {
        expect(Is.isStringOrUndefined({})).toEqual(false);
        expect(Is.isStringOrUndefined(new A())).toEqual(false);
        expect(Is.isStringOrUndefined(F)).toEqual(false);
        expect(Is.isStringOrUndefined(E)).toEqual(false);
        expect(Is.isStringOrUndefined(E.Num7)).toEqual(false);
        expect(Is.isStringOrUndefined(E.Str)).toEqual(true); // Enum string value.
        expect(Is.isStringOrUndefined("string")).toEqual(true);
        expect(Is.isStringOrUndefined("")).toEqual(true);
        expect(Is.isStringOrUndefined([0, 1, 2])).toEqual(false);
        expect(Is.isStringOrUndefined(7)).toEqual(false);
        expect(Is.isStringOrUndefined(null)).toEqual(false);
        expect(Is.isStringOrUndefined(0)).toEqual(false);
        expect(Is.isStringOrUndefined(undefined)).toEqual(true);
    });

    it("isBoolean", () => {
        expect(Is.isBoolean({})).toEqual(false);
        expect(Is.isBoolean(new A())).toEqual(false);
        expect(Is.isBoolean(F)).toEqual(false);
        expect(Is.isBoolean(E)).toEqual(false);
        expect(Is.isBoolean("string")).toEqual(false);
        expect(Is.isBoolean("")).toEqual(false);
        expect(Is.isBoolean([0, 1, 2])).toEqual(false);
        expect(Is.isBoolean(7)).toEqual(false);
        expect(Is.isBoolean(null)).toEqual(false);
        expect(Is.isBoolean(0)).toEqual(false);
        expect(Is.isBoolean(undefined)).toEqual(false);
        expect(Is.isBoolean(true)).toEqual(true);
        expect(Is.isBoolean(false)).toEqual(true);
        expect(Is.isBoolean("true")).toEqual(false);
        expect(Is.isBoolean("false")).toEqual(false);
    });

    it("isBooleanOrUndefined", () => {
        expect(Is.isBooleanOrUndefined({})).toEqual(false);
        expect(Is.isBooleanOrUndefined(new A())).toEqual(false);
        expect(Is.isBooleanOrUndefined(F)).toEqual(false);
        expect(Is.isBooleanOrUndefined(E)).toEqual(false);
        expect(Is.isBooleanOrUndefined("string")).toEqual(false);
        expect(Is.isBooleanOrUndefined("")).toEqual(false);
        expect(Is.isBooleanOrUndefined([0, 1, 2])).toEqual(false);
        expect(Is.isBooleanOrUndefined(7)).toEqual(false);
        expect(Is.isBooleanOrUndefined(null)).toEqual(false);
        expect(Is.isBooleanOrUndefined(0)).toEqual(false);
        expect(Is.isBooleanOrUndefined(undefined)).toEqual(true);
        expect(Is.isBooleanOrUndefined(true)).toEqual(true);
        expect(Is.isBooleanOrUndefined(false)).toEqual(true);
        expect(Is.isBooleanOrUndefined("true")).toEqual(false);
        expect(Is.isBooleanOrUndefined("false")).toEqual(false);
    });

    it("isFunction", () => {
        expect(Is.isFunction({})).toEqual(false);
        expect(Is.isFunction(new A())).toEqual(false);
        expect(Is.isFunction("string")).toEqual(false);
        expect(Is.isFunction("")).toEqual(false);
        expect(Is.isFunction([0, 1, 2])).toEqual(false);
        expect(Is.isFunction(7)).toEqual(false);
        expect(Is.isFunction(null)).toEqual(false);
        expect(Is.isFunction(0)).toEqual(false);
        expect(Is.isFunction(undefined)).toEqual(false);
        expect(Is.isFunction(true)).toEqual(false);
        expect(Is.isFunction(false)).toEqual(false);
        expect(Is.isFunction("true")).toEqual(false);
        expect(Is.isFunction("false")).toEqual(false);
        expect(Is.isFunction(F)).toEqual(true);
        expect(Is.isFunction(() => { })).toEqual(true);
    });

    it("isFunctionOrUndefined", () => {
        expect(Is.isFunctionOrUndefined({})).toEqual(false);
        expect(Is.isFunctionOrUndefined(new A())).toEqual(false);
        expect(Is.isFunctionOrUndefined("string")).toEqual(false);
        expect(Is.isFunctionOrUndefined("")).toEqual(false);
        expect(Is.isFunctionOrUndefined([0, 1, 2])).toEqual(false);
        expect(Is.isFunctionOrUndefined(7)).toEqual(false);
        expect(Is.isFunctionOrUndefined(null)).toEqual(false);
        expect(Is.isFunctionOrUndefined(0)).toEqual(false);
        expect(Is.isFunctionOrUndefined(undefined)).toEqual(true);
        expect(Is.isFunctionOrUndefined(true)).toEqual(false);
        expect(Is.isFunctionOrUndefined(false)).toEqual(false);
        expect(Is.isFunctionOrUndefined("true")).toEqual(false);
        expect(Is.isFunctionOrUndefined("false")).toEqual(false);
        expect(Is.isFunctionOrUndefined(F)).toEqual(true);
        expect(Is.isFunctionOrUndefined(() => { })).toEqual(true);
    });

    it("isNumber", () => {
        expect(Is.isNumber({})).toEqual(false);
        expect(Is.isNumber(new A())).toEqual(false);
        expect(Is.isNumber(E.Num7)).toEqual(true); // Enum number value.
        expect(Is.isNumber(E.Str)).toEqual(false);
        expect(Is.isNumber("string")).toEqual(false);
        expect(Is.isNumber("")).toEqual(false);
        expect(Is.isNumber([0, 1, 2])).toEqual(false);
        expect(Is.isNumber(7)).toEqual(true);
        expect(Is.isNumber(-0.1)).toEqual(true);
        expect(Is.isNumber(Infinity)).toEqual(true);
        expect(Is.isNumber(NaN)).toEqual(true);
        expect(Is.isNumber(null)).toEqual(false);
        expect(Is.isNumber(0)).toEqual(true);
        expect(Is.isNumber(undefined)).toEqual(false);
    });

    it("isNumberOrUndefined", () => {
        expect(Is.isNumberOrUndefined({})).toEqual(false);
        expect(Is.isNumberOrUndefined(new A())).toEqual(false);
        expect(Is.isNumberOrUndefined(E.Num7)).toEqual(true); // Enum number value.
        expect(Is.isNumberOrUndefined(E.Str)).toEqual(false);
        expect(Is.isNumberOrUndefined("string")).toEqual(false);
        expect(Is.isNumberOrUndefined("")).toEqual(false);
        expect(Is.isNumberOrUndefined([0, 1, 2])).toEqual(false);
        expect(Is.isNumberOrUndefined(7)).toEqual(true);
        expect(Is.isNumberOrUndefined(-0.1)).toEqual(true);
        expect(Is.isNumberOrUndefined(Infinity)).toEqual(true);
        expect(Is.isNumberOrUndefined(NaN)).toEqual(true);
        expect(Is.isNumberOrUndefined(null)).toEqual(false);
        expect(Is.isNumberOrUndefined(0)).toEqual(true);
        expect(Is.isNumberOrUndefined(undefined)).toEqual(true);
    });

    it("isEnumValue", () => {
        expect(Is.isEnumValue({}, E)).toEqual(false);
        expect(Is.isEnumValue(new A(), E)).toEqual(false);
        expect(Is.isEnumValue([0, 1, 2], E)).toEqual(false);
        expect(Is.isEnumValue(null, E)).toEqual(false);
        expect(Is.isEnumValue(undefined, E)).toEqual(false);
        expect(Is.isEnumValue(E, E)).toEqual(false);
        expect(Is.isEnumValue(E.Str, E)).toEqual(true);
        expect(Is.isEnumValue("Str", E)).toEqual(true);
        expect(Is.isEnumValue(E.Num7, E)).toEqual(true);
        expect(Is.isEnumValue(7, E)).toEqual(true);
        expect(Is.isEnumValue("Not", E)).toEqual(false);
        expect(Is.isEnumValue(88, E)).toEqual(false);
    });

    it("isEnumValueOrUndefined", () => {
        expect(Is.isEnumValueOrUndefined({}, E)).toEqual(false);
        expect(Is.isEnumValueOrUndefined(new A(), E)).toEqual(false);
        expect(Is.isEnumValueOrUndefined([0, 1, 2], E)).toEqual(false);
        expect(Is.isEnumValueOrUndefined(null, E)).toEqual(false);
        expect(Is.isEnumValueOrUndefined(undefined, E)).toEqual(true);
        expect(Is.isEnumValueOrUndefined(E, E)).toEqual(false);
        expect(Is.isEnumValueOrUndefined(E.Str, E)).toEqual(true);
        expect(Is.isEnumValueOrUndefined("Str", E)).toEqual(true);
        expect(Is.isEnumValueOrUndefined(E.Num7, E)).toEqual(true);
        expect(Is.isEnumValueOrUndefined(7, E)).toEqual(true);
        expect(Is.isEnumValueOrUndefined("Not", E)).toEqual(false);
        expect(Is.isEnumValueOrUndefined(88, E)).toEqual(false);
    });

    it("isInteger", () => {
        expect(Is.isInteger(0)).toEqual(true);
        expect(Is.isInteger(7)).toEqual(true);
        expect(Is.isInteger(-7)).toEqual(true);
        expect(Is.isInteger(4.5)).toEqual(false);
        expect(Is.isInteger(-4.5)).toEqual(false);
        expect(Is.isInteger(Infinity)).toEqual(false);
        expect(Is.isInteger(-Infinity)).toEqual(false);
        expect(Is.isInteger(NaN)).toEqual(false);
        expect(Is.isInteger("0")).toEqual(false);
        expect(Is.isInteger("-6")).toEqual(false);
        expect(Is.isInteger("6")).toEqual(false);
        expect(Is.isInteger([9])).toEqual(false);
        expect(Is.isInteger({})).toEqual(false);
        expect(Is.isInteger(new A())).toEqual(false);
        expect(Is.isInteger([0, 1, 2])).toEqual(false);
        expect(Is.isInteger(null)).toEqual(false);
        expect(Is.isInteger(undefined)).toEqual(false);
        expect(Is.isInteger(E)).toEqual(false);
        expect(Is.isInteger(E.Str)).toEqual(false);
        expect(Is.isInteger(E.Num7)).toEqual(true);
    });
});