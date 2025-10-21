import { SmallIntCache } from "./small-int-cache";

describe("SmallIntCache", () => {
    it("sets and gets values for positive and negative keys", () => {
        const c = new SmallIntCache<number>();
        c.set(0, 10);
        c.set(2, 20);
        c.set(-1, 30);
        expect(c.get(0)).toBe(10);
        expect(c.get(2)).toBe(20);
        expect(c.get(-1)).toBe(30);
    });

    it("delete and has work correctly", () => {
        const c = new SmallIntCache<number>();
        c.set(1, 5);
        expect(c.has(1)).toBeTrue();
        c.delete(1);
        expect(c.has(1)).toBeFalse();
        expect(c.get(1)).toBeUndefined();
    });

    it("clear empties the cache", () => {
        const c = new SmallIntCache<number>();
        c.set(0, 1);
        c.set(-2, 2);
        c.clear();
        expect(c.has(0)).toBeFalse();
        expect(c.has(-2)).toBeFalse();
    });
});
