import { UniMap } from ".";

export class CallTracker {
    private counts = new UniMap<any, number>((a, b) => a === b);

    getCallCountFor(value: any): number {
        let oldCount = this.counts.getOrCreate(value, 0);
        this.counts.set(value, oldCount + 1);
        return oldCount;
    }

    hasBeenCalledWith(value: any): boolean {
        return this.getCallCountFor(value) > 0;
    }

    // Static default interface
    private static _default = new CallTracker();

    static getCallCountFor(value: any): number {
        return this._default.getCallCountFor(value);
    }

    static hasBeenCalledWith(value: any): boolean {
        return this._default.hasBeenCalledWith(value);
    }
}
