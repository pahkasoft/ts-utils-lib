import { Stack } from "./stack";

describe(Stack.name, () => {
    it("should work", () => {
        let s = new Stack<number>();
        expect(s.push(7)).toEqual(7);
        expect(s.push(-1)).toEqual(-1);
        expect(s.push(NaN)).toEqual(NaN);
        expect(s.toArray()).toEqual([7, -1, NaN]);
        expect(s.pop()).toEqual(NaN);
        expect(s.pop()).toEqual(-1);
        expect(s.pop()).toEqual(7);
        expect(() => s.pop()).toThrow();
    });
});
