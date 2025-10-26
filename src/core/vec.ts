import { isFinite } from "../guard";

/**
 * Vector class.
 * 
 * ```ts
 * // Example usage:
 * const a = new Vec(1, 2);
 * const b = new Vec(3, 4);
 *
 * console.log(a.add(b).toString());     // Vec(4, 6)
 * console.log(a.add(3, 3).toString());  // Vec(4, 5)
 * console.log(a.mul(2).toString());     // Vec(2, 4)
 * console.log(a.equals(b));             // false
 * console.log(a.clone().equals(a));     // true
 * ```
 */
export class Vec {
    readonly coords: number[];

    constructor(...coords: number[]) {
        if (coords.length < 2) {
            throw new TypeError("Vec needs minumum two coords!")
        }
        this.coords = coords;
    }

    static vec2(x: number, y: number): Vec {
        return new Vec(x, y);
    }

    static vec3(x: number, y: number, z: number): Vec {
        return new Vec(x, y, z);
    }

    static zero(dim: number): Vec {
        if (dim < 2) {
            throw new TypeError("Vec.zero requires dimension >= 2");
        }
        return new Vec(...Array(dim).fill(0));
    }

    get dim(): number {
        return this.coords.length;
    }

    get length(): number {
        return Math.hypot(...this.coords);
    }

    magnitude(): number {
        return this.length;
    }

    get x(): number {
        return this.coords[0];
    }

    get y(): number {
        return this.coords[1];
    }

    get z(): number {
        if (this.coords[2] === undefined) {
            throw new TypeError("Vec z-coord not available!")
        }
        return this.coords[2];
    }

    add(other: Vec): Vec;
    add(...coords: number[]): Vec;
    add(...args: [Vec] | number[]): Vec {
        const otherCoords = args[0] instanceof Vec
            ? args[0].coords
            : args as number[];

        if (this.coords.length !== otherCoords.length) {
            throw new TypeError("Coordinate length mismatch!");
        }

        return new Vec(...this.coords.map((coord, i) => coord + otherCoords[i]));
    }

    sub(other: Vec): Vec;
    sub(...coords: number[]): Vec;
    sub(...args: [Vec] | number[]): Vec {
        const otherCoords = args[0] instanceof Vec
            ? args[0].coords
            : args as number[];

        if (this.coords.length !== otherCoords.length) {
            throw new TypeError("Coordinate length mismatch!");
        }

        return new Vec(...this.coords.map((coord, i) => coord - otherCoords[i]));
    }

    mul(scalar: number): Vec {
        return new Vec(...this.coords.map(coord => coord * scalar));
    }

    div(scalar: number): Vec {
        return new Vec(...this.coords.map(coord => coord / scalar));
    }

    dot(other: Vec): number {
        if (this.coords.length !== other.coords.length) {
            throw new TypeError("Coordinate length mismatch!");
        }
        return this.coords.reduce((sum, c, i) => sum + c * other.coords[i], 0);
    }

    distance(other: Vec): number {
        if (this.coords.length !== other.coords.length) {
            throw new TypeError("Coordinate length mismatch!");
        }
        return Math.hypot(...this.coords.map((c, i) => c - other.coords[i]));
    }

    normalize(): Vec {
        const len = this.length;
        if (len === 0) {
            throw new TypeError("Cannot normalize zero-length vector!");
        }
        return this.div(len);
    }

    static lerp(a: Vec, b: Vec, t: number): Vec {
        if (a.coords.length !== b.coords.length) {
            throw new TypeError("Coordinate length mismatch!");
        }
        if (!isFinite(t)) {
            throw new TypeError("Lerp t is not finite!");
        }
        return a.add(b.sub(a).mul(t));
    }

    toLength(len: number): Vec {
        const mag = this.length;
        return mag === 0 ? this : this.mul(len / mag);
    }

    clamp(minLength?: number, maxLength?: number, defaultDir?: Vec): Vec {
        const mag = this.length;

        if (mag === 0) {
            if (minLength !== undefined) {
                if (defaultDir && defaultDir.coords.length !== this.coords.length)
                    throw new TypeError("Coordinate length mismatch!");
                const dir = defaultDir && defaultDir.length !== 0 ? defaultDir.normalize() : new Vec(1, ...Array(this.coords.length - 1).fill(0));
                return dir.mul(minLength);
            }
            return this; // zero vector stays zero
        }

        // If maxLength is defined and vector is too long
        if (maxLength !== undefined && mag > maxLength) {
            return this.normalize().mul(maxLength);
        }

        // If minLength is defined and vector is too short
        if (minLength !== undefined && mag < minLength) {
            return this.normalize().mul(minLength);
        }

        return this;
    }

    equals(other: Vec): boolean {
        return this.coords.length === other.coords.length &&
            this.coords.every((v, i) => v === other.coords[i]);
    }

    clone(): Vec {
        return new Vec(...this.coords);
    }

    toObject() {
        return { x: this.x, y: this.y, z: this.z }
    }

    [Symbol.iterator]() {
        return this.coords[Symbol.iterator]();
    }

    toString(): string {
        return `Vec(${this.coords.join(", ")})`;
    }
}
