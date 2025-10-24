import { Vec2 } from "./vec2";

describe("Vec2 (deprecated)", () => {
    it("constructs with default zeros", () => {
        const v = new Vec2();
        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });

    it("basic ops: add, sub, mul, div, length", () => {
        const a = new Vec2(3, 4);
        const b = new Vec2(1, 2);
        const sum = a.add(b);
        expect(sum.x).toBe(4);
        expect(sum.y).toBe(6);
        const sub = a.sub(b);
        expect(sub.x).toBe(2);
        expect(sub.y).toBe(2);
        const mul = a.mul(2);
        expect(mul.x).toBe(6);
        expect(mul.y).toBe(8);
        const div = a.div(2);
        expect(div.x).toBe(1.5);
        expect(div.y).toBe(2);
        expect(a.length()).toBeCloseTo(5);
    });
});
