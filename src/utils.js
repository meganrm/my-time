import { SEASON_DATES } from "./constants";
import { degreesToRadians } from "./polarPlot";

export const convertTimeToFullDate = (timeString) => {
    const today = new Date();
    const dateString = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()} ${timeString} UTC`;
    return new Date(Date.parse(dateString));
};

const convertHourToTime = (time) => {
    const timeToString = (time).toString().split(".");
    let hour = timeToString[0];
    let mins = Number(timeToString[1]) * 0.6;
    let seconds = mins * 0.6;
    mins = mins.toString().substring(0, 2);
    seconds = mins.toString().substring(0, 2);
    if (mins > 60) {
        mins = mins - 60;
        hour = Number(hour) + 1;
    }
    if (hour > 24) {
        return `${hour - 24}:${mins}:${seconds} AM `;
    } else if (hour > 12) {
        return `${hour - 12}:${mins}:${seconds} PM `;
    } else {
        return `${hour}:${mins}:${seconds} AM `;
    }
};

export const getTimeInHourDec = (time) => {
    const hour = time.getHours();
    let mins = time.getMinutes();
    const seconds = time.getSeconds();
    mins = mins + seconds / 60;
    return hour + mins / 60;
};

export const getSlope = (x1, x2) => {
    return 12.0 / (x2 - x1);
};

export const convertTime = (normalTime, sunriseHour, sunsetHour, daySlope, dayIntercept, nightIntercept, nightSlope) => {
    let newTime;
    if (normalTime > sunsetHour) {
        newTime = nightSlope * normalTime + nightIntercept - 24;
    } else if (normalTime < sunriseHour) {
        newTime = nightSlope * normalTime;
    } else {
        newTime = daySlope * normalTime + dayIntercept;
    }
    return newTime;
};

export const adjustTime = (sunriseHour, sunsetHour) => {
    const sixPM = 18.0;
    const now = getTimeInHourDec(new Date());
    let slope;
    const xValues = [];
    const yValues = [];

    const adjustedSunrise = 24.0 + sunriseHour;
    const adjustedSixPM = 24.0 + sixPM;
    const nightSlope = getSlope(sunsetHour, adjustedSunrise);
    const nightIntercept = adjustedSixPM - nightSlope * sunsetHour;
    const daySlope = getSlope(sunriseHour, sunsetHour);
    const dayIntercept = sixPM - daySlope * sunsetHour;
    for (let normalTime = 0; normalTime < 24.0; normalTime++) {
        xValues.push(normalTime);
        const newTime = convertTime(normalTime, sunriseHour, sunsetHour, daySlope, dayIntercept, nightIntercept, nightSlope);
        yValues.push(newTime);
    }
    const newTime = convertTime(now, sunriseHour, sunsetHour, daySlope, dayIntercept, nightIntercept, nightSlope);
    if (now >= sunriseHour || now <= sunsetHour) {
        slope = daySlope;
    } else {
        slope = nightIntercept;
    }
    return {
        adjustedTime: convertHourToTime(newTime),
        slope,
        isTomorrow: newTime > 24,
        yValues,
        xValues,
    };
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

function getDaysIntoYear(date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

export const getRadialAxisMarkers = (dayRadius) => {
    const now = new Date();

    const season = getSeason();
    const seasons = SEASON_DATES[now.getFullYear()];

    const daysIntoYear = getDaysIntoYear(new Date());


    const winterSolstice = new Date(`${now.getFullYear()}, ${seasons.winter_solstice.month}, ${seasons.winter_solstice.day}`);
    const summerSolstice = new Date(`${now.getFullYear()}, ${seasons.summer_solstice.month}, ${seasons.summer_solstice.day}`)

    const shortestDay = getDaysIntoYear(winterSolstice);
    const longestDay = getDaysIntoYear(summerSolstice);
    const shortestDayToDegrees = shortestDay / 365.25 * 360;
    const longestDayToDegrees = longestDay / 365.25 * 360;
    const todayToDegrees = daysIntoYear / 365.25 * 360;
    const h = 365.25 - shortestDay;
    // y = 30 * Math.sine(x - h);
    const smallestRadius = 60 * Math.sin(degreesToRadians(shortestDayToDegrees) - h) + 30;
    const largestRadius = 60 * Math.sin(degreesToRadians(longestDayToDegrees) - h) + 30;
    const nowRadius = 60 * Math.sin(degreesToRadians(todayToDegrees) - h) + 30;

    return { smallestRadius, largestRadius, nowRadius };
};
