const DAY_ARC = [];
for (let index = 90; index <= 270; index++) {
    DAY_ARC.push(index);
}
const NIGHT_ARC = [];
for (let index = -90; index <= 90; index++) {
    NIGHT_ARC.push(index);
}

const FULL_CIRCLE = [];
for (let index = 0; index <= 360; index++) {
    FULL_CIRCLE.push(index);
}
const EQUINOX_RADIUS = 30;
const BACKGROUND_COLOR = "#282c34";

const SEASON_DATES = {
    2022: {
        spring_equinox: {
            day: 21,
            month: 3,
            phenom: "Equinox",
        },
        summer_solstice: {
            day: 21,
            month: 6,
            phenom: "Solstice",
        },
        fall_equinox: {
            day: 23,
            month: 9,
            phenom: "Equinox",
            time: "10:04 DT",
        },
        winter_solstice: {
            day: 22,
            month: 12,
            phenom: "Solstice",
        },
    },
    2023: {
        spring_equinox: {
            day: 21,
            month: 3,
            phenom: "Equinox",
            time: "06:24 DT",
        },
        summer_solstice: {
            day: 21,
            month: 6,
            phenom: "Solstice",
            time: "23:58 DT",
        },

        fall_equinox: {
            day: 23,
            month: 9,
            phenom: "Equinox",
            time: "15:50 DT",
        },
        winter_solstice: {
            day: 22,
            month: 12,
            phenom: "Solstice",
            time: "11:27 ST",
        },

    },
};
export {
    SEASON_DATES,
    BACKGROUND_COLOR,
    DAY_ARC,
    NIGHT_ARC,
    EQUINOX_RADIUS,
    FULL_CIRCLE,
};
