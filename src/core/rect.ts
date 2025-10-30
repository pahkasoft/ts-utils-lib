import { AnchoredRect } from "./anchor-rect";

/**
 * An immutable 2D rectangle defined by its top-left corner (x, y) and size (width, height).
 * Provides geometric utilities like intersection, containment, scaling, etc.
 */
export class Rect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor();
    constructor(width: number, height: number);
    constructor(x: number, y: number, width: number, height: number);
    constructor(...args: number[]) {
        if (args.length === 0) {
            this.x = this.y = this.width = this.height = 0;
        }
        else if (args.length === 2) {
            this.x = this.y = 0;
            this.width = args[0];
            this.height = args[1];
        }
        else {
            this.x = args[0];
            this.y = args[1];
            this.width = args[2];
            this.height = args[3];
        }

        if (this.width < 0 || this.height < 0)
            throw new Error("Rect width and height must be non-negative.");
    }

    set(): Rect;
    set(width: number, height: number): Rect;
    set(x: number, y: number, width: number, height: number): Rect;
    set(...args: number[]): Rect {
        if (args.length === 0) {
            this.x = this.y = this.width = this.height = 0;
        }
        else if (args.length === 2) {
            this.x = this.y = 0;
            this.width = args[0];
            this.height = args[1];
        }
        else {
            this.x = args[0];
            this.y = args[1];
            this.width = args[2];
            this.height = args[3];
        }

        if (this.width < 0 || this.height < 0)
            throw new Error("Rect width and height must be non-negative.");

        return this;
    }

    // --- Static Constructors ---

    static fromPoints(p1: { x: number; y: number }, p2: { x: number; y: number }): Rect {
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        const w = Math.abs(p1.x - p2.x);
        const h = Math.abs(p1.y - p2.y);
        return new Rect(x, y, w, h);
    }

    static fromCenter(cx: number, cy: number, width: number, height: number): Rect {
        return new Rect(cx - width / 2, cy - height / 2, width, height);
    }

    // --- Derived Properties ---

    get left(): number { return this.x; }
    get top(): number { return this.y; }
    get right(): number { return this.x + this.width; }
    get bottom(): number { return this.y + this.height; }

    get centerX(): number { return this.x + this.width / 2; }
    get centerY(): number { return this.y + this.height / 2; }
    get center(): { x: number; y: number } { return { x: this.centerX, y: this.centerY }; }

    get area(): number { return this.width * this.height; }
    get isEmpty(): boolean { return this.width <= 0 || this.height <= 0; }

    // --- Geometric Tests ---

    containsPoint(px: number, py: number): boolean {
        return px >= this.left && px <= this.right && py >= this.top && py <= this.bottom;
    }

    containsRect(other: Rect): boolean {
        return (
            other.left >= this.left &&
            other.right <= this.right &&
            other.top >= this.top &&
            other.bottom <= this.bottom
        );
    }

    intersects(other: Rect): boolean {
        return !(
            other.right < this.left ||
            other.left > this.right ||
            other.bottom < this.top ||
            other.top > this.bottom
        );
    }

    // --- Operations ---

    intersectionCopy(other: Rect): Rect {
        const x1 = Math.max(this.left, other.left);
        const y1 = Math.max(this.top, other.top);
        const x2 = Math.min(this.right, other.right);
        const y2 = Math.min(this.bottom, other.bottom);
        if (x2 <= x1 || y2 <= y1) return new Rect();
        return new Rect(x1, y1, x2 - x1, y2 - y1);
    }

    unionCopy(other: Rect): Rect {
        const x1 = Math.min(this.left, other.left);
        const y1 = Math.min(this.top, other.top);
        const x2 = Math.max(this.right, other.right);
        const y2 = Math.max(this.bottom, other.bottom);
        return new Rect(x1, y1, x2 - x1, y2 - y1);
    }

    insetCopy(dx: number, dy: number): Rect {
        return new Rect(this.x + dx, this.y + dy, this.width - 2 * dx, this.height - 2 * dy);
    }

    inflateCopy(dx: number, dy: number): Rect {
        return new Rect(this.x - dx, this.y - dy, this.width + 2 * dx, this.height + 2 * dy);
    }

    offsetInPlace(dx: number, dy: number): Rect {
        this.x += dx;
        this.y += dy;
        return this;
    }

    offsetCopy(dx: number, dy: number): Rect {
        return new Rect(this.x + dx, this.y + dy, this.width, this.height);
    }

    scaleInPlace(scaleX: number, scaleY: number = scaleX): Rect {
        this.x = this.centerX - this.width * scaleX / 2;
        this.width *= scaleX;
        this.y = this.centerY - this.height * scaleY / 2;
        this.height *= scaleY;
        return this;
    }

    scaleCopy(scaleX: number, scaleY: number = scaleX): Rect {
        return this.clone().scaleInPlace(scaleX, scaleY);
    }

    roundCopy(): Rect {
        const left = Math.round(this.left);
        const top = Math.round(this.top);
        const right = Math.round(this.right);
        const bottom = Math.round(this.bottom);
        return new Rect(left, top, right - left, bottom - top);
    }

    floorCopy(): Rect {
        const left = Math.floor(this.left);
        const top = Math.floor(this.top);
        const right = Math.floor(this.right);
        const bottom = Math.floor(this.bottom);
        return new Rect(left, top, right - left, bottom - top);
    }

    ceilCopy(): Rect {
        const left = Math.ceil(this.left);
        const top = Math.ceil(this.top);
        const right = Math.ceil(this.right);
        const bottom = Math.ceil(this.bottom);
        return new Rect(left, top, right - left, bottom - top);
    }

    expandCopy(px: number, py: number): Rect {
        const left = Math.min(this.left, px);
        const top = Math.min(this.top, py);
        const right = Math.max(this.right, px);
        const bottom = Math.max(this.bottom, py);
        return new Rect(left, top, right - left, bottom - top);
    }

    // --- Utilities ---

    equals(other: Rect): boolean {
        return (
            this.x === other.x &&
            this.y === other.y &&
            this.width === other.width &&
            this.height === other.height
        );
    }

    clone(): Rect {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    toString(): string {
        return `Rect(x=${this.x}, y=${this.y}, w=${this.width}, h=${this.height})`;
    }

    toAnchoredRect(): AnchoredRect {
        return new AnchoredRect(this.left, this.right, this.top, this.bottom);
    }
}
