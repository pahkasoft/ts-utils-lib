import { Vec } from "./vec";

describe("Vec", () => {

    // --- Construction ---
    it("creates a 2D vector", () => {
        const v = new Vec(1, 2);
        expect(v.coords).toEqual([1, 2]);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
    });

    it("throws when fewer than 2 coords", () => {
        expect(() => new Vec(1)).toThrowError(TypeError);
    });

    it("creates a 3D vector", () => {
        const v = new Vec(1, 2, 3);
        expect(v.coords).toEqual([1, 2, 3]);
        expect(v.x).toBe(1);
        expect(v.y).toBe(2);
        expect(v.z).toBe(3);
    });

    it("throws when accessing z on 2D vector", () => {
        const v = new Vec(1, 2);
        expect(() => v.z).toThrowError(TypeError);
    });

    // --- Basic math ---
    it("adds two vectors", () => {
        const v = new Vec(1, 2).add(new Vec(3, 4));
        expect(v.coords).toEqual([4, 6]);
        expect(v.toString()).toBe("Vec(4, 6)");
    });

    it("adds coordinate list", () => {
        const v = new Vec(1, 2).add(3, 4);
        expect(v.coords).toEqual([4, 6]);
    });

    it("throws when adding different dimensions", () => {
        const a = new Vec(1, 2);
        const b = new Vec(1, 2, 3);
        expect(() => a.add(b)).toThrowError(TypeError);
    });

    it("subtracts two vectors", () => {
        const v = new Vec(5, 7).sub(new Vec(2, 3));
        expect(v.coords).toEqual([3, 4]);
        expect(v.toString()).toBe("Vec(3, 4)");
    });

    it("subtracts coordinate list", () => {
        const v = new Vec(5, 7).sub(2, 3);
        expect(v.coords).toEqual([3, 4]);
    });

    it("multiplies by scalar", () => {
        const v = new Vec(2, 3).mul(2);
        expect(v.coords).toEqual([4, 6]);
    });

    it("divides by scalar", () => {
        const v = new Vec(4, 6).div(2);
        expect(v.coords).toEqual([2, 3]);
    });

    // --- Length ---
    it("computes vector length", () => {
        const v = new Vec(3, 4);
        expect(v.length).toBe(5);
    });

    it("computes length for 3D vector", () => {
        const v = new Vec(1, 2, 2);
        expect(v.length).toBe(3);
    });

    // --- Utility methods ---
    it("clones vector", () => {
        const v = new Vec(1, 2);
        const c = v.clone();
        expect(c.coords).toEqual([1, 2]);
        expect(c).not.toBe(v);
    });

    it("compares equality (true)", () => {
        const a = new Vec(1, 2, 3);
        const b = new Vec(1, 2, 3);
        expect(a.equals(b)).toBeTrue();
    });

    it("compares equality (false)", () => {
        const a = new Vec(1, 2);
        const b = new Vec(2, 1);
        expect(a.equals(b)).toBeFalse();
    });

    it("toString returns readable format", () => {
        expect(new Vec(1, 2).toString()).toBe("Vec(1, 2)");
        expect(new Vec(3, 4, 5).toString()).toBe("Vec(3, 4, 5)");
    });

    it("creates Vec2 using static helper", () => {
        const v = Vec.vec2(9, 8);
        expect(v.coords).toEqual([9, 8]);
    });

    it("creates Vec3 using static helper", () => {
        const v = Vec.vec3(1, 2, 3);
        expect(v.coords).toEqual([1, 2, 3]);
    });

    it("does not mutate original vector on add/sub/mul/div", () => {
        const a = new Vec(1, 2);
        const b = a.add(2, 3);
        const c = a.sub(2, 3);
        const d = a.mul(3);
        const e = a.div(2);

        expect(a.coords).toEqual([1, 2]);
        expect(b.coords).toEqual([3, 5]);
        expect(c.coords).toEqual([-1, -1]);
        expect(d.coords).toEqual([3, 6]);
        expect(e.coords).toEqual([0.5, 1]);
    });

    it("computes dot product", () => {
        const a = new Vec(1, 2, 3);
        const b = new Vec(4, -5, 6);
        expect(a.dot(b)).toBe(12); // 1*4 + 2*-5 + 3*6 = 12
    });

    it("throws when dot product dimensions differ", () => {
        const a = new Vec(1, 2);
        const b = new Vec(1, 2, 3);
        expect(() => a.dot(b)).toThrowError(TypeError);
    });

    it("computes distance between vectors", () => {
        const a = new Vec(1, 2);
        const b = new Vec(4, 6);
        expect(a.distance(b)).toBe(5); // 3-4-5 triangle
    });

    it("throws when distance dimensions differ", () => {
        const a = new Vec(1, 2);
        const b = new Vec(1, 2, 3);
        expect(() => a.distance(b)).toThrowError(TypeError);
    });

    it("normalizes vector correctly", () => {
        const v = new Vec(3, 4);
        const n = v.normalize();
        expect(n.length).toBeCloseTo(1, 10);
        expect(n.coords).toEqual([0.6, 0.8]);
    });

    it("throws when normalizing zero vector", () => {
        const v = Vec.zero(2);
        expect(() => v.normalize()).toThrowError(TypeError);
    });

    it("creates zero vector", () => {
        const z2 = Vec.zero(2);
        const z3 = Vec.zero(3);
        expect(z2.coords).toEqual([0, 0]);
        expect(z3.coords).toEqual([0, 0, 0]);
    });

    it("throws when Vec.zero has too small dim", () => {
        expect(() => Vec.zero(1)).toThrowError(TypeError);
    });

    it("supports destructuring {x,y,z}", () => {
        const v = new Vec(1, 2, 3);
        const { x, y, z } = v;
        expect(x).toBe(1);
        expect(y).toBe(2);
        expect(z).toBe(3);
    });

    it("supports destructuring [x,y,z]", () => {
        const v = new Vec(7, 8, 9);
        const [x, y, z] = v;
        expect(x).toBe(7);
        expect(y).toBe(8);
        expect(z).toBe(9);
    });

    // Example assumes Jest or similar test framework

    it("lerp between two vectors", () => {
        const a = new Vec(0, 0, 0);
        const b = new Vec(10, 10, 10);

        expect(Vec.lerp(a, b, 0).coords).toEqual([0, 0, 0]);
        expect(Vec.lerp(a, b, 1).coords).toEqual([10, 10, 10]);
        expect(Vec.lerp(a, b, 0.5).coords).toEqual([5, 5, 5]);
        expect(Vec.lerp(a, b, 2).coords).toEqual([20, 20, 20]); // extrapolation
    });

    it("toLength scales vector correctly", () => {
        const v = new Vec(3, 4); // length 5
        const scaled = v.toLength(10);
        expect(scaled.length).toBeCloseTo(10);
        expect(scaled.coords[0] / scaled.coords[1]).toBeCloseTo(3 / 4);

        const zero = new Vec(0, 0);
        expect(zero.toLength(5).coords).toEqual([0, 0]); // zero vector stays zero
    });

    const v = new Vec(3, 4); // length 5

    it("clamp maxLength only", () => {
        expect(v.clamp(undefined, 10).coords).toEqual([3, 4]); // already < max
        const clamped = v.clamp(undefined, 3);
        expect(clamped.length).toBeCloseTo(3);
    });

    it("clamp minLength only", () => {
        expect(v.clamp(3).coords).toEqual([3, 4]); // already > min
        const small = new Vec(1, 1);
        const clamped = small.clamp(3);
        expect(clamped.length).toBeCloseTo(3);
    });

    it("clamp minLength and maxLength", () => {
        const short = new Vec(1, 0); // length 1
        const medium = short.clamp(2, 5);
        expect(medium.length).toBeCloseTo(2);

        const long = new Vec(10, 0); // length 10
        const clamped = long.clamp(2, 5);
        expect(clamped.length).toBeCloseTo(5);
    });

    it("clamp zero vector with minLength and defaultDir", () => {
        const zero = new Vec(0, 0, 0);
        const clamped = zero.clamp(5, undefined, new Vec(0, 1, 0));
        expect(clamped.coords).toEqual([0, 5, 0]);
    });

    it("clamp zero vector without defaultDir", () => {
        const zero = new Vec(0, 0);
        const clamped = zero.clamp(5);
        // falls back to x-axis
        expect(clamped.coords).toEqual([5, 0]);
    });

    it("clamp zero vector when minLength undefined", () => {
        const zero = new Vec(0, 0);
        expect(zero.clamp(undefined, 10).coords).toEqual([0, 0]);
    });
});
