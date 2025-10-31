import { getEnumKeys, getEnumValues, getEnumEntries, getEnumKey, forEachEnum } from ".";

enum Color {
    Red = "RED",
    Green = "GREEN",
    Blue = "BLUE",
}

enum Direction {
    Up,
    Down,
    Left,
    Right,
}

describe("Enum utilities", () => {
    describe("getEnumKeys", () => {
        it("returns all keys for a string enum", () => {
            expect(getEnumKeys(Color)).toEqual(["Red", "Green", "Blue"]);
        });

        it("returns all keys for a numeric enum", () => {
            expect(getEnumKeys(Direction)).toEqual(["Up", "Down", "Left", "Right"]);
        });
    });

    describe("getEnumValues", () => {
        it("returns all values for a string enum", () => {
            expect(getEnumValues(Color)).toEqual([Color.Red, Color.Green, Color.Blue]);
        });

        it("returns all values for a numeric enum", () => {
            expect(getEnumValues(Direction)).toEqual([0, 1, 2, 3]);
        });
    });

    describe("getEnumEntries", () => {
        it("returns key-value pairs for a string enum", () => {
            expect(getEnumEntries(Color)).toEqual([
                ["Red", Color.Red],
                ["Green", Color.Green],
                ["Blue", Color.Blue],
            ]);
        });

        it("returns key-value pairs for a numeric enum", () => {
            expect(getEnumEntries(Direction)).toEqual([
                ["Up", 0],
                ["Down", 1],
                ["Left", 2],
                ["Right", 3],
            ]);
        });
    });

    describe("getEnumKey", () => {
        it("returns key for a given value in string enum", () => {
            expect(getEnumKey(Color, Color.Green)).toBe("Green");
        });

        it("returns key for a given value in numeric enum", () => {
            expect(getEnumKey(Direction, 2)).toBe("Left");
        });

        it("returns undefined for invalid value", () => {
            expect(getEnumKey(Color, "PURPLE" as any)).toBeUndefined();
        });
    });

    describe("forEachEnum", () => {
        it("calls callback for each entry", () => {
            const calls: Array<[string, string]> = [];
            forEachEnum(Color, (key, value) => calls.push([key as string, value as string]));
            expect(calls).toEqual([
                ["Red", "RED"],
                ["Green", "GREEN"],
                ["Blue", "BLUE"],
            ]);
        });
    });
});
