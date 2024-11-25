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

export { BACKGROUND_COLOR, DAY_ARC, NIGHT_ARC, EQUINOX_RADIUS, FULL_CIRCLE };
