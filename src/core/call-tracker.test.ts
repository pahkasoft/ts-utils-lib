import { CallTracker } from "./call-tracker";

describe("CallTracker", () => {
    it("Test default", () => {
        const obj = {};
        expect(CallTracker.getCallCountFor("a")).toBe(0);
        expect(CallTracker.getCallCountFor("a")).toBe(1);
        expect(CallTracker.hasBeenCalledWith(0)).toBe(false);
        expect(CallTracker.hasBeenCalledWith(0)).toBe(true);
        expect(CallTracker.getCallCountFor(obj)).toBe(0);
        expect(CallTracker.getCallCountFor(obj)).toBe(1);
        expect(CallTracker.hasBeenCalledWith(obj)).toBe(true);
    });

    it("Test with string", () => {
        const tracker = new CallTracker();
        expect(tracker.getCallCountFor("a")).toBe(0);
        expect(tracker.getCallCountFor("a")).toBe(1);
    });

    it("Test with number", () => {
        const tracker = new CallTracker();
        expect(tracker.hasBeenCalledWith(1)).toBe(false);
        expect(tracker.hasBeenCalledWith(1)).toBe(true);
    });

    it("Test with object", () => {
        const tracker = new CallTracker();
        const obj = {};
        expect(tracker.getCallCountFor(obj)).toBe(0);
        expect(tracker.getCallCountFor(obj)).toBe(1);
        expect(tracker.hasBeenCalledWith(obj)).toBe(true);
    });
});

