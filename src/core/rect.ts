import { hasProperties } from "../utils/obj";
import { AnchoredRect } from "./anchor-rect";

function getRectProps(arg: unknown) {
    let left: number = NaN;
    let right: number = NaN;
    let top: number = NaN;
    let bottom: number = NaN;

    if (hasProperties(arg, ["left", "top"] as const)) {
        left = Number(arg.left);
        top = Number(arg.top);
    }
    else if (hasProperties(arg, ["x", "y"] as const)) {
        left = Number(arg.x);
        top = Number(arg.y);
    }
    if (hasProperties(arg, ["width", "height"] as const)) {
        right = left + Number(arg.width);
        bottom = top + Number(arg.height);
    }

    return { left, top, right, bottom }
}

/**
 * Mutable axis-aligned 2D rectangle defined by a top-left corner (`x`, `y`)
 * and non-negative size (`width`, `height`).
 *
 * This class represents a basic geometric rectangle without an anchor.
 * All operations assume a coordinate system where:
 * - `left = x`
 * - `top = y`
 * - `right = x + width`
 * - `bottom = y + height`
 *
 * Width and height are always non-negative. An error is thrown if violated.
 */
export class Rect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    /**
     * Create an empty rectangle at the origin.
     */
    constructor();

    /**
     * Create a copy of another Rect.
     */
    constructor(other: Rect);

    /**
     * Create a rectangle from a rect-like object.
     *
     * Accepts `{ left, top, width, height }`.
     */
    constructor(other: { left: number, top: number, width: number, height: number });

    /**
     * Create a rectangle with size only.
     * The rectangle is positioned at the origin.
     */
    constructor(width: number, height: number);

    /**
     * Create a rectangle from position and size.
     *
     * @param x - Left coordinate
     * @param y - Top coordinate
     * @param width - Rectangle width (must be non-negative)
     * @param height - Rectangle height (must be non-negative)
     */
    constructor(x: number, y: number, width: number, height: number);

    constructor(...args: unknown[]) {
        if (args.length === 0) {
            this.x = this.y = this.width = this.height = 0;
        }
        else if (args.length === 1) {
            const _args = getRectProps(args[0]);
            this.x = _args.left;
            this.y = _args.top;
            this.width = _args.right - _args.left;
            this.height = _args.bottom - _args.top;
        }
        else if (args.length === 2) {
            this.x = this.y = 0;
            this.width = Number(args[0]);
            this.height = Number(args[1]);
        }
        else {
            this.x = Number(args[0]);
            this.y = Number(args[1]);
            this.width = Number(args[2]);
            this.height = Number(args[3]);
        }

        if (this.width < 0 || this.height < 0)
            throw new Error("Rect width and height must be non-negative.");
    }

    /**
     * Reset this rectangle to the origin with zero size.
     */
    set(): Rect;

    /**
     * Set rectangle size and reset position to the origin.
     *
     * @param width - Rectangle width (must be non-negative)
     * @param height - Rectangle height (must be non-negative)
     */
    set(width: number, height: number): Rect;

    /**
     * Set rectangle position and size.
     *
     * @param x - Left coordinate
     * @param y - Top coordinate
     * @param width - Rectangle width (must be non-negative)
     * @param height - Rectangle height (must be non-negative)
     */
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

    /**
     * Create the smallest rectangle enclosing two points.
     */
    static fromPoints(p1: { x: number; y: number }, p2: { x: number; y: number }): Rect {
        const x = Math.min(p1.x, p2.x);
        const y = Math.min(p1.y, p2.y);
        const w = Math.abs(p1.x - p2.x);
        const h = Math.abs(p1.y - p2.y);
        return new Rect(x, y, w, h);
    }

    /**
     * Create a rectangle centered at the given point.
     *
     * @param cx - Center x-coordinate
     * @param cy - Center y-coordinate
     * @param width - Rectangle width
     * @param height - Rectangle height
     */
    static fromCenter(cx: number, cy: number, width: number, height: number): Rect {
        return new Rect(cx - width / 2, cy - height / 2, width, height);
    }

    /** Left edge coordinate. */
    get left(): number { return this.x; }

    /** Top edge coordinate. */
    get top(): number { return this.y; }

    /** Right edge coordinate. */
    get right(): number { return this.x + this.width; }

    /** Bottom edge coordinate. */
    get bottom(): number { return this.y + this.height; }

    /** Geometric center x-coordinate. */
    get centerX(): number { return this.x + this.width / 2; }

    /** Geometric center y-coordinate. */
    get centerY(): number { return this.y + this.height / 2; }

    /** Geometric center point. */
    get center(): { x: number; y: number } { return { x: this.centerX, y: this.centerY }; }

    /** Rectangle area (`width * height`). */
    get area(): number { return this.width * this.height; }

    /**
     * Whether this rectangle has zero or negative area.
     * Note: width and height are guaranteed non-negative.
     */
    get isEmpty(): boolean { return this.width <= 0 || this.height <= 0; }

    /**
     * Test whether a point lies inside or on the edges of this rectangle.
     */
    containsPoint(px: number, py: number): boolean {
        return px >= this.left && px <= this.right && py >= this.top && py <= this.bottom;
    }

    /**
     * Test whether another rectangle is fully contained within this rectangle.
     */
    containsRect(other: Rect): boolean {
        return (
            other.left >= this.left &&
            other.right <= this.right &&
            other.top >= this.top &&
            other.bottom <= this.bottom
        );
    }

    /**
     * Test whether this rectangle intersects another rectangle.
     *
     * Edge-touching is considered an intersection.
     */
    intersects(other: Rect): boolean;

    /**
     * Test whether this rectangle intersects another rectangle.
     *
     * Edge-touching is considered an intersection.
     */
    intersects(other: { left: number, top: number, width: number, height: number }): boolean;

    intersects(other: unknown): boolean {
        const _args = getRectProps(other);
        return !(
            _args.right < this.left ||
            _args.left > this.right ||
            _args.bottom < this.top ||
            _args.top > this.bottom
        );
    }

    /**
     * Compute the intersection of this rectangle with another rectangle.
     *
     * Returns an empty rectangle if there is no overlap.
     */
    intersectionCopy(other: Rect): Rect;

    /**
     * Compute the intersection of this rectangle with another rectangle.
     *
     * Returns an empty rectangle if there is no overlap.
     */
    intersectionCopy(other: { left: number, top: number, width: number, height: number }): Rect;

    intersectionCopy(other: unknown): Rect {
        const _args = getRectProps(other);

        const x1 = Math.max(this.left, _args.left);
        const y1 = Math.max(this.top, _args.top);
        const x2 = Math.min(this.right, _args.right);
        const y2 = Math.min(this.bottom, _args.bottom);

        if (x2 <= x1 || y2 <= y1) return new Rect();

        return new Rect(x1, y1, x2 - x1, y2 - y1);
    }

    /**
     * Compute the union of this rectangle with another rectangle.
     */
    unionCopy(other: Rect): Rect;

    /**
     * Compute the union of this rectangle with another rectangle.
     */
    unionCopy(other: { left: number, top: number, width: number, height: number }): Rect;

    unionCopy(other: unknown): Rect {
        const _args = getRectProps(other);

        const x1 = Math.min(this.left, _args.left);
        const y1 = Math.min(this.top, _args.top);
        const x2 = Math.max(this.right, _args.right);
        const y2 = Math.max(this.bottom, _args.bottom);

        return new Rect(x1, y1, x2 - x1, y2 - y1);
    }

    /**
     * Create an inset (shrunken) copy of this rectangle.
     *
     * @param dx - Horizontal inset
     * @param dy - Vertical inset
     */
    insetCopy(dx: number, dy: number): Rect {
        return new Rect(this.x + dx, this.y + dy, this.width - 2 * dx, this.height - 2 * dy);
    }

    /**
     * Create an inflated (expanded) copy of this rectangle.
     *
     * @param dx - Horizontal expansion
     * @param dy - Vertical expansion
     */
    inflateCopy(dx: number, dy: number): Rect {
        return new Rect(this.x - dx, this.y - dy, this.width + 2 * dx, this.height + 2 * dy);
    }

    /**
     * Move this rectangle by the given offset.
     * Modifies this instance.
     */
    offsetInPlace(dx: number, dy: number): Rect {
        this.x += dx;
        this.y += dy;
        return this;
    }

    /**
     * Create a translated copy of this rectangle.
     */
    offsetCopy(dx: number, dy: number): Rect {
        return new Rect(this.x + dx, this.y + dy, this.width, this.height);
    }

    /**
     * Scale this rectangle around its geometric center.
     * Modifies this instance.
     *
     * @param scaleX - Horizontal scale factor
     * @param scaleY - Vertical scale factor (defaults to scaleX)
     */
    scaleInPlace(scaleX: number, scaleY: number = scaleX): Rect {
        this.x = this.centerX - this.width * scaleX / 2;
        this.width *= scaleX;
        this.y = this.centerY - this.height * scaleY / 2;
        this.height *= scaleY;
        return this;
    }

    /**
     * Create a scaled copy of this rectangle.
     * Scaling is performed around the geometric center.
     */
    scaleCopy(scaleX: number, scaleY: number = scaleX): Rect {
        return this.clone().scaleInPlace(scaleX, scaleY);
    }

    /**
     * Create a copy with all edges rounded to the nearest integer.
     */
    roundCopy(): Rect {
        const left = Math.round(this.left);
        const top = Math.round(this.top);
        const right = Math.round(this.right);
        const bottom = Math.round(this.bottom);
        return new Rect(left, top, right - left, bottom - top);
    }

    /**
     * Create a copy with all edges rounded down.
     */
    floorCopy(): Rect {
        const left = Math.floor(this.left);
        const top = Math.floor(this.top);
        const right = Math.floor(this.right);
        const bottom = Math.floor(this.bottom);
        return new Rect(left, top, right - left, bottom - top);
    }

    /**
     * Create a copy with all edges rounded up.
     */
    ceilCopy(): Rect {
        const left = Math.ceil(this.left);
        const top = Math.ceil(this.top);
        const right = Math.ceil(this.right);
        const bottom = Math.ceil(this.bottom);
        return new Rect(left, top, right - left, bottom - top);
    }

    /**
     * Expand this rectangle to include a point.
     */
    expandCopy(px: number, py: number): Rect {
        const left = Math.min(this.left, px);
        const top = Math.min(this.top, py);
        const right = Math.max(this.right, px);
        const bottom = Math.max(this.bottom, py);
        return new Rect(left, top, right - left, bottom - top);
    }

    /**
     * Test for exact equality with another rectangle.
     */
    equals(other: Rect): boolean {
        return (
            this.x === other.x &&
            this.y === other.y &&
            this.width === other.width &&
            this.height === other.height
        );
    }

    /**
     * Create a deep copy of this rectangle.
     */
    clone(): Rect {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    /**
     * Convert this rectangle to an AnchoredRect.
     * The anchor is placed at the geometric center.
     */
    toAnchoredRect(): AnchoredRect {
        return new AnchoredRect(this.left, this.right, this.top, this.bottom);
    }

    toString(): string {
        return `Rect(x=${this.x}, y=${this.y}, w=${this.width}, h=${this.height})`;
    }
}
