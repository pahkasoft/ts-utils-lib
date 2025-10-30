import { clamp } from "../utils/math";
import { Rect } from "./rect";

/**
 * A mutable AnchoredRect class is a rectangle (left, top, right, bottom) with an anchor point (anchorX, anchorY).
 */
export class AnchoredRect {
    left: number;
    anchorX: number;
    right: number;
    top: number;
    anchorY: number;
    bottom: number;

    /**
     * Create rectangle with all zero values.
     */
    constructor();

    /**
     * Create rectangle with left, right, top, bottom.
     * Properties anchorX and anchorY will be centered in the middle.
     * 
     * @param left - Left coordinate.
     * @param right - Right coordinate.
     * @param top - Top coordinate.
     * @param bottom - Bottom coordinate.
     */
    constructor(left: number, right: number, top: number, bottom: number);

    /**
     * Create rectangle with full arguments.
     * 
     * @param left - Left coordinate.
     * @param anchorX - Center x-coordinate.
     * @param right - Right coordinate.
     * @param top - Top coordinate.
     * @param anchorY - Center y-coordinate.
     * @param bottom - Bottom coordinate.
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
        else if (args.length === 0) {
            this.left = this.anchorX = this.right = 0;
            this.top = this.anchorY = this.bottom = 0;
        }
        else {
            throw new TypeError(`Invalid AnchoredRect args: ${args}`);
        }
    }

    /**
     * Set rectangle with all zero values.
     */
    set(): AnchoredRect;

    /**
     * Set rectangle with left, right, top, bottom.
     * Properties anchorX and anchorY will be centered in the middle.
     * 
     * @param left - Left coordinate.
     * @param right - Right coordinate.
     * @param top - Top coordinate.
     * @param bottom - Bottom coordinate.
     */
    set(left: number, right: number, top: number, bottom: number): AnchoredRect;

    /**
     * Set rectangle with full arguments.
     * 
     * @param left - Left coordinate.
     * @param anchorX - Center x-coordinate.
     * @param right - Right coordinate.
     * @param top - Top coordinate.
     * @param anchorY - Center y-coordinate.
     * @param bottom - Bottom coordinate.
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

    /**
     * Get center x-coordinate.
     */
    get centerX() {
        return this.left + this.width / 2;
    }

    /**
     * Get center ycoordinate.
     */
    get centerY() {
        return this.top + this.height / 2;
    }

    /**
     * Width getter.
     */
    get width() {
        return this.right - this.left;
    }

    /**
     * Height getter.
     */
    get height() {
        return this.bottom - this.top;
    }

    /**
     * Left section width getter.
     */
    get leftw() {
        return this.anchorX - this.left;
    }

    /**
     * Right section width getter.
     */
    get rightw() {
        return this.right - this.anchorX;
    }

    /**
     * Top section height getter.
     */
    get toph() {
        return this.anchorY - this.top;
    }

    /**
     * Bottom section height getter.
     */
    get bottomh() {
        return this.bottom - this.anchorY;
    }

    /**
     * Does this Rect contain given (x, y)-point?
     * 
     * @param x - X-coordinate.
     * @param y - Y-coordinate.
     * @returns - True/false.
     */
    contains(x: number, y: number): boolean {
        return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
    }

    /**
     * Do a and b rects overlap?
     * 
     * @param a - AnchoredRect a.
     * @param b - AnchoredRect b.
     * @returns - True/false.
     */
    static overlap(a: AnchoredRect, b: AnchoredRect): boolean {
        return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
    }

    /**
     * Do horizontal measures of a and b rects overlap?
     * 
     * @param a - AnchoredRect a.
     * @param b - AnchoredRect b.
     * @returns - True/false.
     */
    static overlapX(a: AnchoredRect, b: AnchoredRect): boolean {
        return a.right > b.left && a.left < b.right;
    }

    /**
     * Check if given rects are equal.
     * @param a - AnchoredRect a.
     * @param b - AnchoredRect b.
     * @returns - True/false.
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
     * Check if this rect equals with another rect.
     * @param other - The other rect.
     * @returns - True/false.
     */
    equals(other: AnchoredRect): boolean {
        return AnchoredRect.equals(this, other);
    }

    /**
     * Check if edges of given rects are equal, ignoring anchorX and anchorY.
     * 
     * @param a - AnchoredRect a.
     * @param b - AnchoredRect b.
     * @returns - True/false.
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
     * Check if edges of this Rect equals with given Rect, ignoring anchorX and anchorY.
     * 
     * @param other - The other AnchoredRect.
     * @returns - True/false.
     */
    equalsEdges(other: AnchoredRect): boolean {
        return AnchoredRect.equalsEdges(this, other);
    }

    /**
     * Created duplicate of this Rect.
     * @returns - Duplicate.
     */
    clone(): AnchoredRect {
        return new AnchoredRect(this.left, this.anchorX, this.right, this.top, this.anchorY, this.bottom);
    }

    /**
     * Move this rect by (dx, dy). Modifies this Rect.
     * 
     * @param dx - Offset amount in x-direction.
     * @param dy - Offset amount in y-direction.
     * @returns - This AnchoredRect instance.
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
     * Move this rect by (dx, dy). Immutable, returns modified copy.
     * 
     * @param dx - Offset amount in x-direction.
     * @param dy - Offset amount in y-direction.
     * @returns - AnchoredRect copy with applied offset.
     */
    offsetCopy(dx: number, dy: number): AnchoredRect {
        return this.clone().offsetInPlace(dx, dy);
    }

    /**
     * Expand this Rect by given Rect. Modifies this Rect.
     * 
     * @param rect - AnchoredRect to expand this instance with.
     * @returns - This AnchoredRect instance.
     */
    expandInPlace(rect: AnchoredRect): AnchoredRect {
        this.left = Math.min(this.left, rect.left);
        this.right = Math.max(this.right, rect.right);
        this.top = Math.min(this.top, rect.top);
        this.bottom = Math.max(this.bottom, rect.bottom);
        return this;
    }

    /**
     * Expand this Rect by given Rect. Immutable, returns modified copy.
     * 
     * @param rect - AnchoredRect to expand this instance with.
     * @returns - Expanded copy of this AnchoredRect.
     */
    expandCopy(rect: AnchoredRect): AnchoredRect {
        return this.clone().expandInPlace(rect);
    }

    /**
     * Clip this Rect by given Rect. Mmodifies this Rect.
     * 
     * @param clipRect - AnchoredRect to clip this instance with.
     * @returns - This AnchoredRect instance.
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
     * Scale Rect. Anchor pos is (anchorX, anchorY). Modifies this Rect.
     * 
     * @param scaleX - Scale x-amount.
     * @param scaleY - Scale y-amount. If undefined then scale x-amount is used.
     * @returns This AnchoredRect instance.
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
     * Get this AnchoredRect instance.
     * @returns - This AnchoredRect instance.
     */
    getRect(): AnchoredRect {
        return this;
    }

    toRect(): Rect {
        return new Rect(this.left, this.right, this.width, this.height);
    }
}
