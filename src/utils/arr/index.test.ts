import * as ArrayUtils from ".";

describe("ArrayUtil", () => {

    it("should", () => {
        expect(ArrayUtils.toArray(1)).toEqual([1]);
        expect(ArrayUtils.toArray([1])).toEqual([1]);
        expect(ArrayUtils.toArray("abc")).toEqual(["abc"]);
        expect(ArrayUtils.toArray(["a", "b", "c"])).toEqual(["a", "b", "c"]);

        expect(ArrayUtils.removeDuplicates(["a", "b", "b", "c"])).toEqual(["a", "b", "c"]);

        expect(ArrayUtils.fillArray("A", 5)).toEqual(["A", "A", "A", "A", "A"]);
        expect(ArrayUtils.fillArray("A", 0)).toEqual([]);
        expect(() => ArrayUtils.fillArray("A", -1)).toThrow();

        expect(ArrayUtils.mapSequenceArray(5, i => i)).toEqual([0, 1, 2, 3, 4]);
        expect(ArrayUtils.mapSequenceArray(5, i => "abcdef".charAt(i))).toEqual(["a", "b", "c", "d", "e"]);

        expect(ArrayUtils.getSequenceArray(5)).toEqual([0, 1, 2, 3, 4]);
        expect(() => ArrayUtils.getSequenceArray(-5)).toThrow();;
        
        expect(ArrayUtils.mapRangeArray(4, 2, i => i)).toEqual([4, 3, 2]);
        expect(ArrayUtils.mapRangeArray(4, 2, i => "abcdef".charAt(i))).toEqual(["e", "d", "c"]);
        
        expect(ArrayUtils.getRangeArray(-2, 3)).toEqual([-2, -1, 0, 1, 2, 3]);
        expect(ArrayUtils.getRangeArray(3, -2)).toEqual([3, 2, 1, 0, -1, -2]);

        expect(ArrayUtils.arrayContains(["a", "b", "c"], "a")).toEqual(true);
        expect(ArrayUtils.arrayContains(["a", "b", "c"], "d")).toEqual(false);
        expect(ArrayUtils.arrayContains([1, 2, 3], 2)).toEqual(true);
        expect(ArrayUtils.arrayContains([1, 2, 3], 0)).toEqual(false);
    });
});