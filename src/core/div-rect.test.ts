import { DivRect } from "./div-rect";

describe("DivRect", () => {
    // --- Constructors ------------------------------------------------------

    it("constructor with no args creates zero rect", () => {
        const r = new DivRect();
        expect(r.left).toBe(0);
        expect(r.centerX).toBe(0);
        expect(r.right).toBe(0);
        expect(r.top).toBe(0);
        expect(r.centerY).toBe(0);
        expect(r.bottom).toBe(0);
    });

    it("constructor with 4 args computes centers correctly", () => {
        const r = new DivRect(0, 10, 0, 20);
        expect(r.centerX).toBe(5);
        expect(r.centerY).toBe(10);
    });

    it("constructor with 6 args sets fields directly", () => {
        const r = new DivRect(1, 2, 3, 4, 5, 6);
        expect(r.left).toBe(1);
        expect(r.centerX).toBe(2);
        expect(r.right).toBe(3);
        expect(r.top).toBe(4);
        expect(r.centerY).toBe(5);
        expect(r.bottom).toBe(6);
    });

    // --- Static creators ---------------------------------------------------

    it("create() builds from left, top, width, height", () => {
        const r = DivRect.create(10, 20, 30, 40);
        expect(r.left).toBe(10);
        expect(r.right).toBe(40);
        expect(r.top).toBe(20);
        expect(r.bottom).toBe(60);
        expect(r.centerX).toBe(25);
        expect(r.centerY).toBe(40);
    });

    it("createCentered() builds from center, width, height", () => {
        const r = DivRect.createCentered(50, 50, 20, 10);
        expect(r.left).toBe(40);
        expect(r.right).toBe(60);
        expect(r.top).toBe(45);
        expect(r.bottom).toBe(55);
        expect(r.centerX).toBe(50);
        expect(r.centerY).toBe(50);
    });

    it("createSections() builds from section widths/heights", () => {
        const r = DivRect.createSections(2, 3, 4, 5);
        expect(r.left).toBe(-2);
        expect(r.centerX).toBe(0);
        expect(r.right).toBe(3);
        expect(r.top).toBe(-4);
        expect(r.centerY).toBe(0);
        expect(r.bottom).toBe(5);
    });

    // --- Getters -----------------------------------------------------------

    it("width, height, leftw/rightw, toph/bottomh computed correctly", () => {
        const r = new DivRect(0, 5, 10, 0, 5, 10);
        expect(r.width).toBe(10);
        expect(r.height).toBe(10);
        expect(r.leftw).toBe(5);
        expect(r.rightw).toBe(5);
        expect(r.toph).toBe(5);
        expect(r.bottomh).toBe(5);
    });

    // --- Geometry / Spatial methods ---------------------------------------

    it("contains() correctly detects inside/outside", () => {
        const r = DivRect.create(0, 0, 10, 10);
        expect(r.contains(5, 5)).toBe(true);
        expect(r.contains(0, 0)).toBe(true);
        expect(r.contains(10, 10)).toBe(true);
        expect(r.contains(-1, 5)).toBe(false);
        expect(r.contains(5, 11)).toBe(false);
    });

    it("overlap() detects intersecting rects", () => {
        const a = DivRect.create(0, 0, 10, 10);
        const b = DivRect.create(5, 5, 10, 10);
        const c = DivRect.create(11, 11, 10, 10);
        expect(DivRect.overlap(a, b)).toBe(true);
        expect(DivRect.overlap(a, c)).toBe(false);
    });

    it("overlapX() detects horizontal overlap only", () => {
        const a = DivRect.create(0, 0, 10, 10);
        const b = DivRect.create(5, 20, 10, 10); // overlaps only in X
        const c = DivRect.create(11, 0, 10, 10); // no X overlap
        expect(DivRect.overlapX(a, b)).toBe(true);
        expect(DivRect.overlapX(a, c)).toBe(false);
    });

    // --- Equality ----------------------------------------------------------

    it("equals() detects equality and null handling", () => {
        const a = new DivRect(0, 5, 10, 0, 5, 10);
        const b = new DivRect(0, 5, 10, 0, 5, 10);
        const c = new DivRect(0, 6, 10, 0, 5, 10);
        expect(DivRect.equals(a, b)).toBe(true);
        expect(DivRect.equals(a, c)).toBe(false);
        expect(DivRect.equals(a, null)).toBe(false);
        expect(DivRect.equals(null, null)).toBe(true);
        expect(DivRect.equals(undefined, undefined)).toBe(true);
    });

    it("equalsFrame() ignores center coords", () => {
        const a = new DivRect(0, 5, 10, 0, 5, 10);
        const b = new DivRect(0, 6, 10, 0, 7, 10);
        const c = new DivRect(1, 5, 10, 0, 5, 10);
        expect(DivRect.equalsFrame(a, b)).toBe(true);
        expect(DivRect.equalsFrame(a, c)).toBe(false);
    });

    // --- Copy / Mutations --------------------------------------------------

    it("copy() makes deep copy", () => {
        const a = new DivRect(0, 5, 10, 0, 5, 10);
        const b = a.copy();
        expect(DivRect.equals(a, b)).toBe(true);
        expect(a).not.toBe(b);
    });

    it("offsetInPlace() modifies rect", () => {
        const r = new DivRect(0, 5, 10, 0, 5, 10);
        r.offsetInPlace(10, 20);
        expect(r.left).toBe(10);
        expect(r.centerX).toBe(15);
        expect(r.right).toBe(20);
        expect(r.top).toBe(20);
        expect(r.centerY).toBe(25);
        expect(r.bottom).toBe(30);
    });

    it("offsetCopy() returns shifted copy, original unchanged", () => {
        const r = new DivRect(0, 5, 10, 0, 5, 10);
        const copy = r.offsetCopy(5, 5);
        expect(copy.left).toBe(5);
        expect(r.left).toBe(0);
    });

    it("expandInPlace() merges boundaries", () => {
        const a = DivRect.create(0, 0, 10, 10);
        const b = DivRect.create(5, 5, 20, 20);
        a.expandInPlace(b);
        expect(a.left).toBe(0);
        expect(a.right).toBe(25);
        expect(a.top).toBe(0);
        expect(a.bottom).toBe(25);
    });

    it("expandCopy() merges without changing original", () => {
        const a = DivRect.create(0, 0, 10, 10);
        const b = DivRect.create(10, 10, 5, 5);
        const c = a.expandCopy(b);
        expect(c.right).toBeGreaterThan(a.right);
        expect(a.right).toBe(10);
    });

    it("clipInPlace() clamps inside another rect", () => {
        const a = DivRect.create(0, 0, 10, 10);
        const clip = DivRect.create(2, 2, 5, 5);
        a.clipInPlace(clip);
        expect(a.left).toBe(2);
        expect(a.top).toBe(2);
        expect(a.right).toBe(7);
        expect(a.bottom).toBe(7);
        expect(a.centerX).toBeGreaterThanOrEqual(a.left);
        expect(a.centerX).toBeLessThanOrEqual(a.right);
    });

    it("clipCopy() returns clipped copy, original unchanged", () => {
        const a = DivRect.create(0, 0, 10, 10);
        const clip = DivRect.create(5, 5, 10, 10);
        const c = a.clipCopy(clip);
        expect(c.left).toBeGreaterThan(a.left);
        expect(a.left).toBe(0);
    });

    it("scaleInPlace() scales from center correctly", () => {
        const r = DivRect.createCentered(0, 0, 10, 10);
        r.scaleInPlace(2);
        expect(r.width).toBeCloseTo(20);
        expect(r.height).toBeCloseTo(20);
        expect(r.centerX).toBe(0);
        expect(r.centerY).toBe(0);
    });

    it("scaleCopy() returns scaled copy, original unchanged", () => {
        const r = DivRect.createCentered(0, 0, 10, 10);
        const c = r.scaleCopy(0.5);
        expect(c.width).toBeCloseTo(5);
        expect(r.width).toBeCloseTo(10);
    });

    it("getRect() returns itself", () => {
        const r = new DivRect();
        expect(r.getRect()).toBe(r);
    });
});
