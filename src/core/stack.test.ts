import { Stack } from "./stack";

describe(Stack.name, () => {

    let s: Stack<number>;

    beforeEach(() => {
        s = new Stack<number>();
        s.push(0);
        s.push(1);
        s.push(2);
        s.push(3);
    });

    it("top() returns top or throws", () => {
        expect(s.top()).toBe(3);
        s.clear();
        expect(() => s.top()).toThrow();
    });

    it("topOrUndef() returns top or undefined", () => {
        expect(s.topOrUndef()).toBe(3);
        s.clear();
        expect(s.topOrUndef()).toBeUndefined();
    });

    it("topOr() returns top or default", () => {
        expect(s.topOr(-1)).toBe(3);
        s.clear();
        expect(s.topOr(-1)).toBe(-1);
    });

    it("pop() pops or throws", () => {
        expect(s.pop()).toBe(3);
        expect(s.pop()).toBe(2);
        expect(s.pop()).toBe(1);
        expect(s.pop()).toBe(0);
        expect(() => s.pop()).toThrow();
    });

    it("popOrUndef() pops or returns undefined", () => {
        expect(s.popOrUndef()).toBe(3);
        expect(s.popOrUndef()).toBe(2);
        expect(s.popOrUndef()).toBe(1);
        expect(s.popOrUndef()).toBe(0);
        expect(s.popOrUndef()).toBeUndefined();
    });
    
    it("popOr() pops or returns default", () => {
        expect(s.popOr(-1)).toBe(3);
        expect(s.popOr(-1)).toBe(2);
        expect(s.popOr(() => -1)).toBe(1);
        expect(s.popOr(() => -1)).toBe(0);
        expect(s.popOr(-1)).toBe(-1);
        expect(s.popOr(() => -1)).toBe(-1);
    });

    it("peek() peeks or throws", () => {
        expect(() => s.peek(-1)).toThrow();
        expect(s.peek()).toBe(3);
        expect(s.peek(0)).toBe(3);
        expect(s.peek(1)).toBe(2);
        expect(s.peek(2)).toBe(1);
        expect(s.peek(3)).toBe(0);
        expect(() => s.peek(4)).toThrow();
    });

    it("peek() peeks or throws", () => {
        expect(() => s.peek(-1)).toThrow();
        expect(s.peek()).toBe(3);
        expect(s.peek(0)).toBe(3);
        expect(s.peek(1)).toBe(2);
        expect(s.peek(2)).toBe(1);
        expect(s.peek(3)).toBe(0);
        expect(() => s.peek(4)).toThrow();
    });

    it("peekOrUndef() peeks or return undefined", () => {
        expect(s.peekOrUndef(-1)).toBeUndefined();
        expect(s.peekOrUndef()).toBe(3);
        expect(s.peekOrUndef(0)).toBe(3);
        expect(s.peekOrUndef(1)).toBe(2);
        expect(s.peekOrUndef(2)).toBe(1);
        expect(s.peekOrUndef(3)).toBe(0);
        expect(s.peekOrUndef(4)).toBeUndefined();
    });

    it("clear() and isEmpty()", () => {
        expect(s.isEmpty()).toBeFalse();
        s.clear();
        expect(s.isEmpty()).toBeTrue();
    });

    it("toArray()", () => {
        expect(s.toArray()).toEqual([0, 1, 2, 3]);
        s.clear();
        expect(s.toArray()).toEqual([]);
    });

    it("toString()", () => {
        expect(s.toString()).toEqual("Stack(4)[ 0, 1, 2, 3 ]");
        s.clear();
        expect(s.toString()).toEqual("Stack(0)[ ]");
    });
});
