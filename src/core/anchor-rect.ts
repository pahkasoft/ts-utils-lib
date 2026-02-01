import { hasProperties } from "../utils/obj";
import { clamp } from "../utils/math";
import { Rect } from "./rect";

function getRectProps(arg: unknown) {
    let left: number = NaN;
    let anchorX: number | undefined;
    let right: number = NaN;
    let top: number = NaN;
    let anchorY: number | undefined;
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
    if (hasProperties(arg, ["anchorX", "anchorY"] as const)) {
        anchorX = Number(arg.anchorX);
        anchorY = Number(arg.anchorY);
    }

    return { left, anchorX, right, top, anchorY, bottom }
}

/**
 * Mutable axis-aligned rectangle with an explicit anchor point.
 *
 * The rectangle is defined by its edges (`left`, `top`, `right`, `bottom`)
 * and an independent anchor (`anchorX`, `anchorY`) that acts as a logical
 * pivot for scaling, sectioning, and layout operations.
 *
 * The anchor does not need to lie at the geometric center of the rectangle.
 *
 * All coordinates use the same coordinate space and orientation
 * (top ≤ bottom, left ≤ right).
 */
export class AnchoredRect {
    left: number;
    anchorX: number;
    right: number;
    top: number;
    anchorY: number;
    bottom: number;

    /**
     * Create an empty rectangle at the origin.
     * All edges and anchor coordinates are set to zero.
     */
    constructor();

    /**
     * Create a rectangle from `{ left, top, width, height }`.
     * The anchor is placed at the geometric center.
     */
    constructor(other: { left: number, top: number, width: number, height: number });

    /**
     * Create a deep copy of another AnchoredRect.
     */
    constructor(other: AnchoredRect);

    /**
     * Create a rectangle from edge coordinates.
     * The anchor is placed at the geometric center.
     *
     * @param left - Left edge
     * @param right - Right edge
     * @param top - Top edge
     * @param bottom - Bottom edge
     */
    constructor(left: number, right: number, top: number, bottom: number);

    /**
     * Create a rectangle with explicit edge and anchor coordinates.
     *
     * @param left - Left edge
     * @param anchorX - Anchor x-coordinate
     * @param right - Right edge
     * @param top - Top edge
     * @param anchorY - Anchor y-coordinate
     * @param bottom - Bottom edge
     */
    constructor(left: number, anchorX: number, right: number, top: number, anchorY: number, bottom: number);

    constructor(...args: unknown[]) {
        if (args.length === 6) {
            this.left = args[0] as number;
            this.anchorX = args[1] as number;
            this.right = args[2] as number;
            this.top = args[3] as number;
            this.anchorY = args[4] as number;
            this.bottom = args[5] as number;
        }
        else if (args.length === 4) {
            this.left = args[0] as number;
            this.right = args[1] as number;
            this.anchorX = (this.left + this.right) / 2;
            this.top = args[2] as number;
            this.bottom = args[3] as number;
            this.anchorY = (this.top + this.bottom) / 2;
        }
        else if (args.length === 1) {
            const _args = getRectProps(args[0]);
            this.left = _args.left;
            this.right = _args.right;
            this.anchorX = _args.anchorX ?? (this.left + this.right) / 2;
            this.top = _args.top;
            this.bottom = _args.bottom;
            this.anchorY = _args.anchorY ?? (this.top + this.bottom) / 2;
        }
        else if (args.length === 0) {
            this.left = this.anchorX = this.right = 0;
            this.top = this.anchorY = this.bottom = 0;
        }
        else {
            throw new TypeError(`Invalid AnchoredRect args: ${args}`);
        }
    }

    /**
     * Reset this rectangle to the origin.
     * All edges and anchor coordinates are set to zero.
     */
    set(): AnchoredRect;

    /**
     * Set rectangle edges.
     * The anchor is repositioned to the geometric center.
     */
    set(left: number, right: number, top: number, bottom: number): AnchoredRect;

    /**
     * Set rectangle edges and anchor explicitly.
     */
    set(left: number, anchorX: number, right: number, top: number, anchorY: number, bottom: number): AnchoredRect;

    set(...args: unknown[]): AnchoredRect {
        if (args.length === 6) {
            this.left = args[0] as number;
            this.anchorX = args[1] as number;
            this.right = args[2] as number;
            this.top = args[3] as number;
            this.anchorY = args[4] as number;
            this.bottom = args[5] as number;
        }
        else if (args.length === 4) {
            this.left = args[0] as number;
            this.right = args[1] as number;
            this.anchorX = (this.left + this.right) / 2;
            this.top = args[2] as number;
            this.bottom = args[3] as number;
            this.anchorY = (this.top + this.bottom) / 2;
        }
        else if (args.length === 0) {
            this.left = this.anchorX = this.right = 0;
            this.top = this.anchorY = this.bottom = 0;
        }
        else {
            throw new TypeError(`Invalid AnchoredRect args: ${args}`);
        }
        return this;
    }

    /**
     * Create rect from basic left, top, width and height arguments.
     * 
     * @param left - Left coordinate.
     * @param top - Top coordinate.
     * @param width - Width.
     * @param height - Height.
     * @returns - AnchoredRect.
     */
    static create(left: number, top: number, width: number, height: number): AnchoredRect {
        return new AnchoredRect(left, left + width, top, top + height);
    }

    /**
     * Create rect from anchorX, anchorY, width, height arguments.
     * 
     * @param centerX - Center x-coordinate.
     * @param centerY - Center y-coordinate.
     * @param width - Width.
     * @param height - Height.
     * @returns - AnchoredRect.
     */
    static createCentered(centerX: number, centerY: number, width: number, height: number): AnchoredRect {
        return new AnchoredRect(
            centerX - width / 2,
            centerX,
            centerX + width / 2,
            centerY - height / 2,
            centerY,
            centerY + height / 2
        );
    }

    /**
     * Create rect from sections.
     * 
     * @param leftw - Left section width.
     * @param rightw - Right section width.
     * @param toph - Top section height.
     * @param bottomh - Bottomsection height.
     * @returns - AnchoredRect.
     */
    static createSections(leftw: number, rightw: number, toph: number, bottomh: number): AnchoredRect {
        return new AnchoredRect(-leftw, 0, rightw, -toph, 0, bottomh);
    }

    /** Geometric center x-coordinate (ignores anchor). */
    get centerX() {
        return this.left + this.width / 2;
    }

    /** Geometric center y-coordinate (ignores anchor). */
    get centerY() {
        return this.top + this.height / 2;
    }

    /** Rectangle width (`right - left`). */
    get width() {
        return this.right - this.left;
    }

    /** Rectangle height (`bottom - top`). */
    get height() {
        return this.bottom - this.top;
    }

    /** Distance from left edge to anchor. */
    get leftw() {
        return this.anchorX - this.left;
    }

    /** Distance from anchor to right edge. */
    get rightw() {
        return this.right - this.anchorX;
    }

    /** Distance from top edge to anchor. */
    get toph() {
        return this.anchorY - this.top;
    }

    /** Distance from anchor to bottom edge. */
    get bottomh() {
        return this.bottom - this.anchorY;
    }

    /**
     * Test whether a point lies inside or on the edges of this rectangle.
     */
    contains(x: number, y: number): boolean {
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
    }

    /**
     * Create an inset (shrunken) copy of this rectangle.
     *
     * The rectangle edges are moved inward by the given amounts.
     * The anchor position is preserved.
     *
     * @param dx - Horizontal inset applied to left and right edges.
     * @param dy - Vertical inset applied to top and bottom edges.
     *             Defaults to `dx`.
     * @returns A new AnchoredRect inset from all sides.
     */
    insetCopy(dx: number, dy: number = dx): AnchoredRect {
        return new AnchoredRect(this.left + dx, this.anchorX, this.right - dx, this.top + dy, this.anchorY, this.bottom - dy);
    }

    /**
     * Create an inflated (expanded) copy of this rectangle.
     *
     * The rectangle edges are moved outward by the given amounts.
     * The anchor position is preserved.
     *
     * @param dx - Horizontal expansion applied to left and right edges.
     * @param dy - Vertical expansion applied to top and bottom edges.
     *             Defaults to `dx`.
     * @returns A new AnchoredRect expanded on all sides.
     */
    inflateCopy(dx: number, dy: number = dx): AnchoredRect {
        return new AnchoredRect(this.left - dx, this.anchorX, this.right + dx, this.top - dy, this.anchorY, this.bottom + dy);
    }

    /**
     * Test whether this rectangle intersects another rectangle.
     *
     * Edge-touching is considered an intersection.
     * Accepts either an AnchoredRect or a rect-like object
     * with `{ left, top, width, height }`.
     */
    intersects(other: AnchoredRect): boolean;
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
     * This method requires strict overlap (edge-touching does NOT count).
     */
    static overlap(a: AnchoredRect, b: AnchoredRect): boolean {
        return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
    }

    /**
     * This method requires strict (horizontal) overlap (edge-touching does NOT count).
     */
    static overlapX(a: AnchoredRect, b: AnchoredRect): boolean {
        return a.right > b.left && a.left < b.right;
    }

    /**
     * Test if rects are equal.
     */
    static equals(a: AnchoredRect | null | undefined, b: AnchoredRect | null | undefined): boolean {
        if (a == null && b == null) {
            // handles null and undefined
            return true;
        }
        else if (a == null || b == null) {
            return false;
        }
        else {
            return a === b || a.left === b.left && a.anchorX === b.anchorX && a.right === b.right && a.top === b.top && a.anchorY === b.anchorY && a.bottom === b.bottom;
        }
    }

    /**
     * Test if this rect equals with given rect.
     */
    equals(other: AnchoredRect): boolean {
        return AnchoredRect.equals(this, other);
    }

    /**
     * Test if edges of given rects are equal, ignoring anchorX and anchorY.
     */
    static equalsEdges(a: AnchoredRect | null | undefined, b: AnchoredRect | null | undefined): boolean {
        if (a == null && b == null) {
            // handles null and undefined
            return true;
        }
        else if (a == null || b == null) {
            return false;
        }
        else {
            return a === b || a.left === b.left && a.right === b.right && a.top === b.top && a.bottom === b.bottom;
        }
    }

    /**
     * Test if edges of this equal with given Rect, ignoring anchorX and anchorY.
     */
    equalsEdges(other: AnchoredRect): boolean {
        return AnchoredRect.equalsEdges(this, other);
    }

    /**
     * Create copy.
     */
    clone(): AnchoredRect {
        return new AnchoredRect(this.left, this.anchorX, this.right, this.top, this.anchorY, this.bottom);
    }

    /**
     * Move this rect by (dx, dy).
     * 
     * @param dx - Offset amount in x-direction.
     * @param dy - Offset amount in y-direction.
     * @returns - Modified this.
     */
    offsetInPlace(dx: number, dy: number): AnchoredRect {
        this.left += dx;
        this.anchorX += dx;
        this.right += dx;
        this.top += dy;
        this.anchorY += dy;
        this.bottom += dy;
        return this;
    }

    /**
     * Move this rect by (dx, dy).
     * 
     * @param dx - Offset amount in x-direction.
     * @param dy - Offset amount in y-direction.
     * @returns - Copy with applied offset.
     */
    offsetCopy(dx: number, dy: number): AnchoredRect {
        return this.clone().offsetInPlace(dx, dy);
    }

    /**
     * Expand this rectangle to include another rectangle.
     * The anchor is preserved.
     */
    unionInPlace(other: AnchoredRect): AnchoredRect {
        this.left = Math.min(this.left, other.left);
        this.right = Math.max(this.right, other.right);
        this.top = Math.min(this.top, other.top);
        this.bottom = Math.max(this.bottom, other.bottom);
        return this;
    }

    /** @deprecated - Use unionInPlace(). */
    expandInPlace(other: AnchoredRect): AnchoredRect {
        return this.unionInPlace(other);
    }

    /**
     * Union this rect with given Rect. 
     * @param other - Union with.
     * @returns - Modified copy.
     */
    unionCopy(other: AnchoredRect): AnchoredRect {
        return new AnchoredRect(
            Math.min(this.left, other.left),
            this.anchorX,
            Math.max(this.right, other.right),
            Math.min(this.top, other.top),
            this.anchorY,
            Math.max(this.bottom, other.bottom)
        );
    }

    /** @deprecated - Use unionCopy(). */
    expandCopy(other: AnchoredRect): AnchoredRect {
        return this.unionCopy(other);
    }

    /**
     * Clip this rectangle to the bounds of another rectangle.
     * The anchor is clamped to remain inside the clipped region.
     */
    clipInPlace(clipRect: AnchoredRect): AnchoredRect {
        this.left = Math.max(this.left, clipRect.left);
        this.right = Math.min(this.right, clipRect.right);
        this.anchorX = clamp(this.anchorX, this.left, this.right);
        this.top = Math.max(this.top, clipRect.top);
        this.bottom = Math.min(this.bottom, clipRect.bottom);
        this.anchorY = clamp(this.anchorY, this.top, this.bottom);
        return this;
    }

    /**
     * Clip this Rect by given Rect. Immutable, return modified copy.
     * 
     * @param clipRect - AnchoredRecto to clip this instance with.
     * @returns - Clipped AnchoredRect copy.
     */
    clipCopy(clipRect: AnchoredRect): AnchoredRect {
        return this.clone().clipInPlace(clipRect);
    }

    /**
     * Scale this rectangle around its anchor point.
     * Edges are moved relative to the anchor.
     */
    scaleInPlace(scaleX: number, scaleY: number = scaleX): AnchoredRect {
        this.left = this.anchorX - this.leftw * scaleX;
        this.right = this.anchorX + this.rightw * scaleX;
        this.top = this.anchorY - this.toph * scaleY;
        this.bottom = this.anchorY + this.bottomh * scaleY;
        return this;
    }

    /**
     * Scale Rect. Anchor pos is (anchorX, anchorY). Immutable, returns modified copy.
     * 
     * @param scaleX - Scale x-amount.
     * @param scaleY - Scale y-amount. If undefined then scale x-amount is used.
     * @returns Scaled copy of this AnchoredRect.
     */
    scaleCopy(scaleX: number, scaleY: number = scaleX): AnchoredRect {
        return this.clone().scaleInPlace(scaleX, scaleY);
    }

    /**
     * Return this rect.
     */
    getRect(): AnchoredRect {
        return this;
    }

    /**
     * Convert to a basic Rect using geometric edges.
     * Anchor information is discarded.
     */
    toRect(): Rect {
        return new Rect(this.left, this.top, this.width, this.height);
    }

    /** String of this rect. */
    toString(): string {
        return `Rect(left=${this.left}, anchorX=${this.anchorX}, right=${this.right}, top=${this.top}, anchorY=${this.anchorY}, bottom=${this.bottom})`;
    }
}
