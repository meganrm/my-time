class Time {
    static adjustBase(number, base) {
        const numberOfBases = Math.floor(number / base)
        const adjustedNumber = number % base
        return {
            numberOfBases,
            adjustedNumber
        }
    }
    static parse(timeString) {
        const splitOnColon = timeString.split(':')
        let hours = Number(splitOnColon[0])
        let mins
        let seconds = 0 
        let AMPM
        if (splitOnColon.length === 3) {
            mins = Number(splitOnColon[1])
            seconds = Number(splitOnColon[2].split(' ')[0])
            AMPM = splitOnColon[2].split(' ')[1]
        } else {
            mins = Number(splitOnColon[1].split(' ')[0])
            AMPM = splitOnColon[1].split(' ')[1]
        }
        if (AMPM === 'PM'){
            hours = hours + 12
        }
        return {
            hours, 
            mins,
            seconds
        }
    }

    constructor(timeString) {
        const {hours, mins, seconds } = Time.parse(timeString)
        this.hours = hours
        this.mins = mins
        this.seconds = seconds
    }

    addSeconds(seconds) {
        const adjustedSecs = Time.adjustBase(seconds, 60)
        let newSeconds = this.seconds + adjustedSecs.adjustedNumber
        let newMins = this.mins + adjustedSecs.numberOfBases
        let newHours = this.hours
        if (newSeconds >= 60) {
            const adjusted = Time.adjustBase(newSeconds, 60)
            newSeconds = adjusted.adjustedNumber
            newMins = newMins + adjusted.numberOfBases
        }
        if (newMins >= 60) {
            const adjusted = Time.adjustBase(newMins, 60)
            newMins = adjusted.adjustedNumber
            newHours = newHours + adjusted.numberOfBases
        }
        if (newHours > 24) {
            const adjusted = Time.adjustBase(newHours, 24)
            newHours = adjusted.adjustedNumber
        }
        this.hours = newHours
        this.mins = newMins
        this.seconds = newSeconds
    }

    addMinutes(minutes) {
        const additionalHours = Math.floor(minutes / 60 ) 
        const additionalMins = minutes % 60 
        let newHours = this.hours + additionalHours
        let newMins = this.mins + additionalMins
        if (newMins >= 60) {
            const adjusted = Time.adjustBase(newMins, 60)
            newMins = adjusted.adjustedNumber
            newHours = newHours + adjusted.numberOfBases
        }
        if (newHours > 24) {
            const adjusted = Time.adjustBase(newHours, 24)
            newHours = adjusted.adjustedNumber
        }
        this.hours = newHours
        this.mins = newMins
    }

    getHours() {
        return this.hours
    }

    getMinutes() {
        return this.mins
    }

    getSeconds() {
        return this.seconds
    }

    toHours = () => {
        const hour = this.getHours()
        let mins = this.getMinutes()
        const seconds = this.getSeconds()
        mins = mins + seconds / 60
        return hour + mins / 60
    }

    toTimeString = () => {
        let hours = this.hours
        let mins = '00'.substring(0, 2 - this.mins.toString().length) + this.mins
        let seconds = '00'.substring(0, 2 - this.seconds.toString().length) + this.seconds
        if (hours > 12) {
            return `${hours - 12}:${mins}:${seconds} PM`
        } else {
            return `${hours}:${mins}:${seconds} AM`
        }
    }

    toTwentyFourHourTime = () => {
        const hours = this.hours
        const mins = '00'.substring(0, 2 - this.mins.toString().length) + this.mins
        const seconds = '00'.substring(0, 2 - this.seconds.toString().length) + this.seconds
        return `${hours}:${mins}:${seconds}`
    }
}

export default Time