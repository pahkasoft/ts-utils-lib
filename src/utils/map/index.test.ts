import { getMapKeys } from ".";

describe("getMapKeys", () => {
    it("returns an empty array for an empty map", () => {
        const map = new Map<string, number>();
        expect(getMapKeys(map)).toEqual([]);
    });

    it("returns all keys from a string-keyed map", () => {
        const map = new Map<string, number>([
            ["a", 1],
            ["b", 2],
            ["c", 3],
        ]);
        expect(getMapKeys(map)).toEqual(["a", "b", "c"]);
    });

    it("returns all keys from a number-keyed map", () => {
        const map = new Map<number, string>([
            [1, "one"],
            [2, "two"],
        ]);
        expect(getMapKeys(map)).toEqual([1, 2]);
    });

    it("preserves insertion order", () => {
        const map = new Map<string, number>();
        map.set("first", 1);
        map.set("second", 2);
        map.set("third", 3);
        expect(getMapKeys(map)).toEqual(["first", "second", "third"]);
    });

    it("returns the same key references for object keys", () => {
        const obj1 = { id: 1 };
        const obj2 = { id: 2 };
        const map = new Map<object, string>([
            [obj1, "a"],
            [obj2, "b"],
        ]);
        const keys = getMapKeys(map);
        expect(keys[0]).toBe(obj1);
        expect(keys[1]).toBe(obj2);
    });
});
