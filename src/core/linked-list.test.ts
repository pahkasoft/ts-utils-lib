import { LinkedList } from "./linked-list";

describe("LinkedList", () => {
    it("misc tests", () => {
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
});