import * as StringUtils from ".";

describe("StringUtil", () => {

    it("should", () => {
        expect(StringUtils.toCharArray("Hello")).toEqual(["H", "e", "l", "l", "o"]);
        expect(StringUtils.repeatString("Abc", 3)).toEqual("AbcAbcAbc");
        expect(StringUtils.chunkString("Hello World!!!", 3)).toEqual(["Hel", "lo ", "Wor", "ld!", "!!"]);

        expect(StringUtils.replaceAt("Hello World!", 2, 2, "gg")).toEqual("Heggo World!");
        expect(StringUtils.replaceAt("Hello!", 0, 5, "World")).toEqual("World!");
        expect(StringUtils.replaceAt("Hello!", 0, 5, "")).toEqual("!");
        expect(() => StringUtils.replaceAt("Hello", -1, 1, "World!")).toThrow();
        expect(() => StringUtils.replaceAt("Hello", 5, 1, "World!")).toThrow();

        expect(StringUtils.insertAt("abcde", 2, "123")).toEqual("ab123cde");
        expect(() => StringUtils.insertAt("abcde", -1, "123")).toThrow();
        expect(() => StringUtils.insertAt("abcde", 6, "123")).toThrow();

        expect(StringUtils.removeAt("abcde", 2, 1)).toEqual("abde");
        expect(() => StringUtils.removeAt("abcde", -1, 1)).toThrow();
        expect(() => StringUtils.removeAt("abcde", 5, 1)).toThrow();
        expect(StringUtils.removeAt("abcde", 0, 0)).toEqual("abcde");
        expect(() => StringUtils.removeAt("abcde", 0, -1)).toThrow();

        expect(StringUtils.makeSentenceFromPascal("WhatAGreatDay!")).toEqual("What a great day!");
    });

});
