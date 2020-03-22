/**
 * Represents a timer.
 */
class Timer {
    constructor(callback) {
        this.seconds = 0
        this.minutes = 0
        this.hours = 0
        this.timerInterval = null
        this.callback = callback
    }

    start() {
        this.seconds = 0
        this.minutes = 0
        this.hours = 0
        this.callback(`${this.numberToString(this.hours)}:${this.numberToString(this.minutes)}:${this.numberToString(this.seconds)}`)
        this.timerInterval = setInterval(() => {
            this.addSecond()
            this.callback(`${this.numberToString(this.hours)}:${this.numberToString(this.minutes)}:${this.numberToString(this.seconds)}`)
        }, 1000)
    }

    stop() {
        clearInterval(this.timerInterval)
    }

    numberToString(number) {
        let str = `${number}`
        if (str.length === 1) return `0${str}`
        else return str
    }

    addSecond() {
        if (this.seconds === 59) {
            this.seconds = 0
            this.addMinute()
        }
        else {
            this.seconds++
        }
    }

    addMinute() {
        if (this.minutes === 59) {
            this.minutes = 0
            this.addHour()
        }
        else {
            this.minutes++
        }
    }

    addHour() {
        if (this.hours === 23) {
            this.minutes = 0
        }
        else {
            this.hours++
        }
    }
}