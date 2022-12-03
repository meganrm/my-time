/* eslint-disable no-undef */
import { isDay, getMarkerIndex } from "./selectors";

describe("isDay", () => {
    test("returns true if between 90 and 270", () => {
        const degrees = [91, 100, 270];
        degrees.forEach(degree => {
            expect(isDay(degree)).toBeTruthy();
        });
    });
    test("returns false if less than 90 or greater than 270", () => {
        const degrees = [0, 89, 271];
        degrees.forEach(degree => {
            expect(isDay(degree)).toBeFalsy();
        });
    });
});

describe("getMarkerColor", () => {
    test("returns min index for beginning or end of day", () => {
        const degrees = [90, 269];
        degrees.forEach(degree => {
            expect(getMarkerIndex(degree)).toEqual(0);
        });
    });
    test("returns max index for exact of day", () => {
        expect(getMarkerIndex(180)).toEqual(4);
    });
    test("returns next index for middle of day", () => {
        expect(getMarkerIndex(182)).toEqual(3);
    });
    test("returns min index for beginning or end of night", () => {
        const degrees = [80, 272];
        degrees.forEach(degree => {
            expect(getMarkerIndex(degree)).toEqual(0);
        });
    });
    test("returns max index for middle of night", () => {
        expect(getMarkerIndex(0)).toEqual(4);
    });
});
