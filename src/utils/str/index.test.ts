import * as StringUtils from ".";

describe("StringUtil", () => {

    it("should", () => {
        expect(StringUtils.toCharArray("Hello")).toEqual(["H", "e", "l", "l", "o"]);
        expect(StringUtils.repeatString("Abc", 3)).toBe("AbcAbcAbc");
        expect(StringUtils.chunkString("Hello World!!!", 3)).toEqual(["Hel", "lo ", "Wor", "ld!", "!!"]);

        expect(StringUtils.replaceAt("Hello World!", 2, 2, "gg")).toBe("Heggo World!");
        expect(StringUtils.replaceAt("Hello!", 0, 5, "World")).toBe("World!");
        expect(StringUtils.replaceAt("Hello!", 0, 5, "")).toBe("!");
        expect(() => StringUtils.replaceAt("Hello", -1, 1, "World!")).toThrow();
        expect(() => StringUtils.replaceAt("Hello", 5, 1, "World!")).toThrow();

        expect(StringUtils.insertAt("abcde", 2, "123")).toBe("ab123cde");
        expect(() => StringUtils.insertAt("abcde", -1, "123")).toThrow();
        expect(() => StringUtils.insertAt("abcde", 6, "123")).toThrow();

        expect(StringUtils.removeAt("abcde", 2, 1)).toBe("abde");
        expect(() => StringUtils.removeAt("abcde", -1, 1)).toThrow();
        expect(() => StringUtils.removeAt("abcde", 5, 1)).toThrow();
        expect(StringUtils.removeAt("abcde", 0, 0)).toBe("abcde");
        expect(() => StringUtils.removeAt("abcde", 0, -1)).toThrow();

        expect(StringUtils.charCount("", "a")).toBe(0);
        expect(StringUtils.charCount("a", "a")).toBe(1);
        expect(StringUtils.charCount("aa", "a")).toBe(2);
        expect(StringUtils.charCount("aa", "")).toBe(0);
        expect(StringUtils.charCount("aa", "aa")).toBe(0);
        expect(StringUtils.charCount("aa", "b")).toBe(0);
        expect(StringUtils.charCount("ab", "b")).toBe(1);
        expect(StringUtils.charCount("ba", "b")).toBe(1);

        expect(StringUtils.makeSentenceFromPascal("WhatAGreatDay!")).toBe("What a great day!");
    });

});
