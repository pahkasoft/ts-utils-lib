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

    it("toString oututs cache", () => {
        const chc1 = new LRUCache<string, number>(3);
        expect(chc1.toString()).toBe(`LRUCache(0){ }`);
        chc1.set("a", 10);
        expect(chc1.toString()).toBe(`LRUCache(1){ "a": 10 }`);
        chc1.set("b", -11);
        expect(chc1.toString()).toBe(`LRUCache(2){ "a": 10, "b": -11 }`);
        chc1.set("c", 12);
        expect(chc1.toString()).toBe(`LRUCache(3){ "a": 10, "b": -11, "c": 12 }`);
        chc1.set("a", 1);
        expect(chc1.toString()).toBe(`LRUCache(3){ "b": -11, "c": 12, "a": 1 }`);
        const chc2 = new LRUCache<string, string>(3, 3);
        chc2.set("LongKey", "LongValue");
        expect(chc2.toString()).toBe(`LRUCache(0){ }`);
        chc2.set("Lon", "LongValue");
        expect(chc2.toString()).toBe(`LRUCache(1){ "Lon": "LongValue" }`);
    });
});
