import { asMulti } from "./multi-container";
import { SignedIndexArray as Arr, SignedIndexArray } from "./signed-index-array";

describe(Arr.name, () => {
    it("should work", () => {
        const multi = asMulti(new SignedIndexArray<string[]>());

        multi.add(0, "a");
        multi.add(1, "b");
        multi.add(1, "c");

        expect(multi.getAll(0)).toEqual(["a"]);
        expect(multi.getAll(1)).toEqual(["b", "c"]);

        multi.remove(1, "b");

        expect(multi.getAll(1)).toEqual(["c"]);

        multi.clear();

        expect(multi.getAll(0)).toEqual([]);
        expect(multi.getAll(1)).toEqual([]);
    });
});
