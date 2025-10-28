/**
 * @deprecated - Use {@link Vec} instead. Will be removed in v2.0.0.
 * @private
 * 
 * Vec2 class.
 */
export class Vec2 {
    readonly x: number;
    readonly y: number;

    constructor(x?: number, y?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    add(a: Vec2) {
        return new Vec2(this.x + a.x, this.y + a.y);
    }

    sub(a: Vec2) {
        return new Vec2(this.x - a.x, this.y - a.y);
    }

    mul(a: number) {
        return new Vec2(this.x * a, this.y * a);
    }

    div(a: number) {
        return new Vec2(this.x / a, this.y / a);
    }
}
