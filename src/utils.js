export const convertToLocalTime = (time) => {
    const theDate = convertTimeToFullDate(time)
    return theDate.toLocaleString()
}

export const convertTimeToFullDate = (time) => {
    const today = new Date()
    console.log(`Today ${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`)
    return new Date(Date.parse(`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${time} UTC`))  
}

const convertHourToTime = (time) => {
    const timeToString = (time).toString().split('.')
    const hour = timeToString[0]
    let mins = Number(timeToString[1]) * .6
    mins = mins.toString().substring(0, 2)
    if (hour > 24) {
        return `${hour - 24}:${mins} AM `
    } else if (hour > 12) {
        return `${hour - 12}:${mins} PM `
    } else {
        return `${hour}:${mins} AM `
    }
}

const getHourMinInDec = (time) => {
    const hour = time.getHours()
    const mins = time.getMinutes() 
    return hour + mins / 60
}

export const adjustTime = (sunriseTime, sunsetTime) => {
    const sunrise = convertTimeToFullDate(sunriseTime)
    const sunset = convertTimeToFullDate(sunsetTime)
    const sunriseHour = getHourMinInDec(sunrise)
    const sunsetHour = getHourMinInDec(sunset)
    console.log("SUNRISE", sunriseHour)
    console.log("SUNSET", sunsetHour)
    const sixAM = 6.0
    const sixPM = 18.0
    const now = new Date().getHours()

    if (now > sunsetHour) {
        const adjustedSunrise = 24 + sunriseHour
        const adjustedSixPM = 24 + sixPM
        const slope = (adjustedSixPM - sixPM) / (adjustedSunrise - sunsetHour)
        const b = adjustedSixPM - slope * sunsetHour
        const adjustedHour = slope * now + b - 24
        return convertHourToTime(adjustedHour)
    }

    const slope = (sixPM - sixAM) / (sunsetHour - sunriseHour)
    const b = sixPM - slope * sunsetHour
    const adjustedHour = slope * now + b
    return convertHourToTime(adjustedHour)
}


