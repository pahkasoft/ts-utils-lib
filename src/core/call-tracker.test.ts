import { CallTracker } from "./call-tracker";

describe("CallTracker", () => {

    it("starts with zero counts", () => {
        const tracker = new CallTracker<string>();
        expect(tracker.getCallCountFor("a")).toBe(0);
        expect(tracker.hasBeenCalledWith("a")).toBe(false);
    });

    it("track() increments count", () => {
        const tracker = new CallTracker<string>();
        tracker.track("a");
        tracker.track("a");

        expect(tracker.getCallCountFor("a")).toBe(2);
    });

    it("track() tracks multiple values independently", () => {
        const tracker = new CallTracker<string>();
        tracker.track("a");
        tracker.track("b");
        tracker.track("a");

        expect(tracker.getCallCountFor("a")).toBe(2);
        expect(tracker.getCallCountFor("b")).toBe(1);
        expect(tracker.getCallCountFor("c")).toBe(0);
    });

    it("hasBeenCalledWith() reflects tracked values", () => {
        const tracker = new CallTracker<number>();

        expect(tracker.hasBeenCalledWith(1)).toBe(false);

        tracker.track(1);

        expect(tracker.hasBeenCalledWith(1)).toBe(true);
        expect(tracker.hasBeenCalledWith(2)).toBe(false);
    });

    it("query methods do not mutate state", () => {
        const tracker = new CallTracker<string>();

        tracker.getCallCountFor("x");
        tracker.hasBeenCalledWith("x");

        expect(tracker.getCallCountFor("x")).toBe(0);
    });

    it("supports object keys by reference", () => {
        const tracker = new CallTracker<object>();
        const a = {};
        const b = {};

        tracker.track(a);
        tracker.track(a);

        expect(tracker.getCallCountFor(a)).toBe(2);
        expect(tracker.getCallCountFor(b)).toBe(0);
    });

    describe("static default tracker", () => {

        it("tracks values globally", () => {
            CallTracker.track("px");
            CallTracker.track("px");

            expect(CallTracker.getCallCountFor("px")).toBe(2);
            expect(CallTracker.hasBeenCalledWith("px")).toBe(true);
        });

        it("returns false for untracked values", () => {
            expect(CallTracker.getCallCountFor("cm")).toBe(0);
            expect(CallTracker.hasBeenCalledWith("cm")).toBe(false);
        });

    });

});
