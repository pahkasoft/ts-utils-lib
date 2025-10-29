import { LinkedList } from "./linked-list";

describe("LinkedList", () => {
    it("test basic container ops", () => {
        const list = new LinkedList<number>();

        expect(list.toString()).toBe("LinkedList(0)[ ]");

        list.push(10);
        list.push(20);
        list.unshift(5);
        list.insertAt(1, 7); // [5, 7, 10, 20]

        expect(list.toString()).toBe("LinkedList(4)[ 5, 7, 10, 20 ]");
        expect(list.get(2)).toBe(10);

        list.set(2, 11);
        expect([...list]).toEqual([5, 7, 11, 20]);

        list.removeAt(1);
        expect(list.toArray()).toEqual([5, 11, 20]);
    });

    it("test iterator", () => {
        const list = new LinkedList<string>();

        list.push("a");
        list.push("b");
        list.push("c");

        expect([...list]).toEqual(["a", "b", "c"]);
        expect([...list.keys()]).toEqual([0, 1, 2]);
        expect([...list.values()]).toEqual(["a", "b", "c"]);
        expect([...list.entries()]).toEqual([[0, "a"], [1, "b"], [2, "c"]]);
    });

    it("test createDeep() and clone()", () => {
        const list1 = new LinkedList<[string]>();
        const deep1 = LinkedList.createDeep<[string]>();

        list1.push(["a"]);
        list1.push(["b"]);
        list1.push(["c"]);

        deep1.push(["a"]);
        deep1.push(["b"]);
        deep1.push(["c"]);

        expect(list1.has(["a"])).toBeFalse();
        expect(deep1.has(["a"])).toBeTrue();
        expect(deep1.has(["d"])).toBeFalse();

        expect([...list1]).toEqual([["a"], ["b"], ["c"]]);
        expect([...list1.clone()]).toEqual([["a"], ["b"], ["c"]]);

        expect([...deep1]).toEqual([["a"], ["b"], ["c"]]);
        expect([...deep1.clone()]).toEqual([["a"], ["b"], ["c"]]);
    });
});