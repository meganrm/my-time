export const convertTimeToFullDate = (time) => {
    const today = new Date()
    return new Date(Date.parse(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${time} UTC`))  
}

const convertHourToTime = (time) => {
    const timeToString = (time).toString().split('.')
    let hour = timeToString[0]
    let mins = Number(timeToString[1]) * .6
    let seconds = mins * .6
    mins = mins.toString().substring(0, 2)
    seconds = mins.toString().substring(0, 2)
    if (mins > 60) {
        mins = mins - 60
        hour = Number(hour) + 1
    }
    if (hour > 24) {
        return `${hour - 24}:${mins}:${seconds} AM `
    } else if (hour > 12) {
        return `${hour - 12}:${mins}:${seconds} PM `
    } else {
        return `${hour}:${mins}:${seconds} AM `
    }
}

export const getTimeInHourDec = (time) => {
    const hour = time.getHours()
    let mins = time.getMinutes() 
    const seconds = time.getSeconds() 
    mins = mins + seconds / 60
    return hour + mins / 60
}

export const getSlope = (x1, x2) => {
    return 12.0 / (x2 - x1)
}

export const adjustTime = (sunriseHour, sunsetHour) => {

    const sixPM = 18.0
    const now = getTimeInHourDec(new Date())
    let adjustedTime
    let slope
    let xValues = []
    let yValues = []

    const adjustedSunrise = 24.0 + sunriseHour
    const adjustedSixPM = 24.0 + sixPM
    const nightSlope = getSlope(sunsetHour, adjustedSunrise)
    const nightIntercept = adjustedSixPM - nightSlope * sunsetHour
    const daySlope = getSlope(sunriseHour, sunsetHour)
    const dayIntercept = sixPM - daySlope * sunsetHour
    for (let normalTime = 0; normalTime <= 24.0; normalTime++) {
        xValues.push(normalTime)
        let newTime
        if (normalTime > sunsetHour) {
            newTime = nightSlope * normalTime + nightIntercept - 24
        } else if (normalTime < sunriseHour) {
            newTime = nightSlope * normalTime
        } else {
            newTime = daySlope * normalTime + dayIntercept
        }
        yValues.push(newTime)
        
    }
    if (now > sunriseHour) {
        slope = nightSlope
        adjustedTime = slope * now + nightIntercept - 24

    } else {
        slope = daySlope
        adjustedTime = slope * now + dayIntercept
    }
    return {
        adjustedTime: convertHourToTime(adjustedTime),
        slope,
        isTomorrow: adjustedTime > 24,
        yValues,
        xValues
    }
}


