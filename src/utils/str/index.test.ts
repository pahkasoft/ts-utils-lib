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

    it("split by caps", () => {
        expect(StringUtils.splitByCaps("")).toEqual([]);
        expect(StringUtils.splitByCaps("hello")).toEqual(["hello"]);
        expect(StringUtils.splitByCaps("Hello")).toEqual(["Hello"]);
        expect(StringUtils.splitByCaps("HelloWorld")).toEqual(["Hello", "World"]);
        expect(StringUtils.splitByCaps("Helloworld")).toEqual(["Helloworld"]);
        expect(StringUtils.splitByCaps("Hello world")).toEqual(["Hello world"]);
        expect(StringUtils.splitByCaps("Hello World")).toEqual(["Hello ", "World"]);
        expect(StringUtils.splitByCaps("HeLlOWorLd")).toEqual(["He", "Ll", "O", "Wor", "Ld"]);
    });

    it("split by strings", () => {
        expect(StringUtils.splitByStrings("")).toEqual([""]); // no splitter
        expect(StringUtils.splitByStrings("", "")).toEqual([]); // "" splitter
        expect(StringUtils.splitByStrings("abc", "")).toEqual(["a", "b", "c"]);
        expect(StringUtils.splitByStrings("abc", "abc")).toEqual(["", ""]);
        expect(StringUtils.splitByStrings("abc", "b")).toEqual(["a", "c"]);
        expect(StringUtils.splitByStrings("aa.bb,cc;dd:ee", ".", ",", ";", ":")).toEqual(["aa", "bb", "cc", "dd", "ee"]);
    });

    it("split by chars", () => {
        expect(StringUtils.splitByChars("", "")).toEqual([""]); // no splitters
        expect(StringUtils.splitByChars("abc", "")).toEqual(["abc"]);
        expect(StringUtils.splitByChars("abc", "abc")).toEqual(["", "", "", ""]);
        expect(StringUtils.splitByChars("abc", "b")).toEqual(["a", "c"]);
        expect(StringUtils.splitByChars("aa.bb,cc;dd:ee", ".,;:")).toEqual(["aa", "bb", "cc", "dd", "ee"]);
    });
});
