import { LRUCache } from "./LRU-cache";

describe("LRUCache", () => {
    it("stores and retrieves values with set/get", () => {
        const c = new LRUCache<string, number>(3);
        c.set("a", 1);
        c.set("b", 2);
        expect(c.get("a")).toBe(1);
        expect(c.get("b")).toBe(2);
    });

    it("evicts least recently used when over capacity", () => {
        const c = new LRUCache<string, number>(2);
        c.set("a", 1);
        c.set("b", 2);
        // access "a" to make "b" the least recently used
        expect(c.get("a")).toBe(1);
        c.set("c", 3);
        // cache capacity is 2: keys should be "a" and "c"
        expect(c.get("b")).toBeUndefined();
        expect(c.get("a")).toBe(1);
        expect(c.get("c")).toBe(3);
    });

    it("ignores keys longer than maxKeyLength", () => {
        const c = new LRUCache<string, number>(3, 2); // max key length 2
        c.set("abc", 10); // too long, should be ignored
        expect(c.get("abc")).toBeUndefined();
    });
});
