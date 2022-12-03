import Time from "../time";

export const convertTimeToFullDate = (timeString) => {
    const today = new Date();
    const dateString = `${today.getFullYear()}/${
        today.getMonth() + 1
    }/${today.getDate()} ${timeString} UTC`;
    return new Date(Date.parse(dateString));
};

const getSlope = (x1, x2) => {
    return 12.0 / (x2 - x1);
};

const convertTime = (
    normalTime,
    sunriseHour,
    sunsetHour,
    daySlope,
    dayIntercept,
    nightIntercept,
    nightSlope,
) => {
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

export const getConvertedTime = (
    slope, intercept, dayBounds,
) => {
    const now = getTimeInHourDec(new Date());
    let newTime;
    if (now > dayBounds.sunset) {
        newTime = slope * now + intercept - 24;
    } else {
        newTime = slope * now + intercept;
    }
    return newTime;
};

export const getTimeInHourDec = (time) => {
    const hour = time.getHours();
    let mins = time.getMinutes();
    const seconds = time.getSeconds();
    mins = mins + seconds / 60;
    return hour + mins / 60;
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
    for (let normalTime = 0; normalTime <= 24.0; normalTime++) {
        xValues.push(normalTime);
        const newTime = convertTime(
            normalTime,
            sunriseHour,
            sunsetHour,
            daySlope,
            dayIntercept,
            nightIntercept,
            nightSlope,
        );
        yValues.push(newTime);
    }
    const newTime = convertTime(
        now,
        sunriseHour,
        sunsetHour,
        daySlope,
        dayIntercept,
        nightIntercept,
        nightSlope,
    );
    let intercept;
    if (now >= sunriseHour && now <= sunsetHour) {
        slope = daySlope;
        intercept = dayIntercept;
    } else if (now < sunriseHour) {
        slope = nightSlope;
        intercept = 0;
    } else {
        slope = nightSlope;
        intercept = nightIntercept;
    }
    return {
        adjustedTime: new Time(newTime).toTimeString(),
        slope,
        intercept,
        isTomorrow: newTime > 24,
        yValues,
        xValues,
    };
};
