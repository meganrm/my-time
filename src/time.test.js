import Time from "./time";

describe("Time Class", () => {
    it("handles a time with hours and mins", () => {
        const timeString = "2:09 PM";
        expect(new Time(timeString).toTimeString()).toEqual("2:09:00 PM");
        const timeString2 = "2:19 PM";
        expect(new Time(timeString2).toTimeString()).toEqual("2:19:00 PM");
    });
    it("handles a time with hours, mins and seconds", () => {
        const timeString = "2:09:10 PM";
        expect(new Time(timeString).toTimeString()).toEqual("2:09:10 PM");
    });
    describe("adjustBase", () => {
        it("will not change if number is less than base", () => {
            const result = Time.adjustBase(4, 60)
            expect(result.numberOfBases).toEqual(0)
            expect(result.adjustedNumber).toEqual(4)
        })
        it("will change if number is less than base", () => {
            const result = Time.adjustBase(65, 60)
            expect(result.numberOfBases).toEqual(1)
            expect(result.adjustedNumber).toEqual(5)
        })
    })
    describe("addSeconds", () => {
        it("will add seconds to zero if there are none", () => {
            const timeString = "2:09 PM";
            const time = new Time(timeString)
            time.addSeconds(1)
            expect(time.seconds).toEqual(1)
        })
        it("will add seconds to existing seconds", () => {
            const timeString = "2:09:59 PM";
            const time = new Time(timeString)
            time.addSeconds(1)
            expect(time.hours).toEqual(14)
            expect(time.mins).toEqual(10)
            expect(time.seconds).toEqual(0)
            expect(time.toTimeString()).toEqual("2:10:00 PM")

        })
    })
    describe("addMinutes", () => {
        it("will add mins", () => {
            const timeString = "2:09 PM";
            const time = new Time(timeString)
            time.addMinutes(1)
            expect(time.mins).toEqual(10)
            expect(time.hours).toEqual(14)
        })
        it("will add hours if mins are over 60", () => {
            const timeString = "2:00:00 PM";
            const time = new Time(timeString)
            time.addMinutes(70)
            expect(time.hours).toEqual(15)
            expect(time.mins).toEqual(10)
            expect(time.seconds).toEqual(0)
            expect(time.toTimeString()).toEqual("3:10:00 PM")

        })
    })
})
