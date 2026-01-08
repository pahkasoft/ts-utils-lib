import { UniMap } from ".";

export class CallTracker<T = unknown> {
    private counts = new UniMap<T, number>((a, b) => a === b);

    track(value: T): void {
        const count = this.counts.getOrCreate(value, 0);
        this.counts.set(value, count + 1);
    }

    getCallCountFor(value: T): number {
        return this.counts.get(value) ?? 0;
    }

    hasBeenCalledWith(value: T): boolean {
        return this.getCallCountFor(value) > 0;
    }

    // ─────────────────────────────────────────
    // Static default tracker
    // ─────────────────────────────────────────

    private static _default = new CallTracker<any>();

    static track(value: any): void {
        this._default.track(value);
    }

    static getCallCountFor(value: any): number {
        return this._default.getCallCountFor(value);
    }

    static hasBeenCalledWith(value: any): boolean {
        return this._default.hasBeenCalledWith(value);
    }
}
