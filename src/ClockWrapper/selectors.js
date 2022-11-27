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

const getSlope = (x1, x2) => {
    return 12.0 / (x2 - x1);
};

const convertTime = (normalTime, sunriseHour, sunsetHour, daySlope, dayIntercept, nightIntercept, nightSlope) => {
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
