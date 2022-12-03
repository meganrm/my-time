import { SEASON_DATES } from "../constants";
import { degreesToRadians } from "../utils";

export const isDay = (degree) => {
    return Math.cos(degreesToRadians(degree)) <= 0;
};

export const getSeason = () => {
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisDay = now.getDate();
    const seasons = SEASON_DATES[now.getFullYear()];
    if (thisMonth >= seasons.spring_equinox.month &&
        thisMonth <= seasons.fall_equinox.month
    ) {
        if (thisMonth === seasons.spring_equinox.month) {
            if (thisDay > seasons.spring_equinox.day) {
                return "light";
            } else {
                return "dark";
            }
        }
        if (thisMonth === seasons.fall_equinox.month) {
            if (thisDay < seasons.fall_equinox.day) {
                return "light";
            } else {
                return "dark";
            }
        }
        return "light";
    }
    return "dark";
};

export const getMarkerIndex = (degree) => {
    const radians = degreesToRadians(degree);
    const index = Math.abs(-4 * Math.cos(radians));
    return Math.floor(index);
};

export const getMarkerColor = (degree) => {
    const dayColors = ["#ae4612", "#bb3e03", "#ca6702", "#EE9B00", "#E9D8A6"];
    const nightColors = ["#94d2bd", "#0a9396", "#0a6a96", "#023e4b", "#001219"];
    const index = getMarkerIndex(degree);
    if (isDay(degree)) {
        return dayColors[index];
    }
    return nightColors[index];
};

function getDaysIntoYear(date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

const convertDateToDegrees = (dateString) => {
    const date = new Date(dateString);
    const daysIntoYears = getDaysIntoYear(date);
    return daysIntoYears / 365.25 * 360;
};

const getRadiusFromDegrees = (factor, h, degrees) => {
    return factor * Math.cos(degreesToRadians(degrees - h)) + 30;
};

const convertEventToDate = (eventData) => {
    const now = new Date();
    return `${now.getFullYear()}, ${eventData.month}, ${eventData.day}`;
};

export const getRadialAxisMarkers = (dayRadius) => {
    const now = new Date();
    const seasons = SEASON_DATES[now.getFullYear()];
    const equinox = convertEventToDate(seasons.filter(seasonData => seasonData.phenom === "Equinox")[1]);
    const solstices = seasons.filter(seasonData => seasonData.phenom === "Solstice");
    const todayInDegrees = convertDateToDegrees(new Date());
    const equinoxDayInDegrees = convertDateToDegrees(equinox);
    const h = equinoxDayInDegrees - 270;

    const nowUnscaled = Math.cos(degreesToRadians(todayInDegrees - h));
    const factor = (dayRadius - 30) / nowUnscaled;

    const radii = solstices.map(convertEventToDate)
        .map((dateString, index) => {
            const radius = getRadiusFromDegrees(factor, h, (convertDateToDegrees(dateString)));
            const name = solstices[index].phenom;
            return {
                radius,
                name,
            };
        });
    return [...radii.sort((a, b) => a.radius - b.radius)];
};
