/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "../App.css";
import { adjustTime, getTimeInHourDec, convertTimeToFullDate, getConvertedTime } from "./selectors";
import Time from "../time";
import Clock from "../Clock";
import DebuggingPlot from "../DebugginPlot";

const debugging = process.env.NODE_ENV !== "production";

function ClockWrapper({ height, width, setRequesting, location }) {
    const initState = { time: 0, slope: 1, intercept: 0 };
    const [dayBounds, setDayBounds] = useState({ sunrise: 0, sunset: 0 });
    const [conversionFactors, setConversionFactors] = useState(initState);
    const [time, setConvertedTime] = useState(0);

    useEffect(() => {
        if (location.lat !== 0 && location.lng !== 0) {
            setRequesting(true);

            fetch(
                // eslint-disable-next-line comma-dangle
                `https://api.sunrise-sunset.org/json?lat=${location.lat}&lng=${location.lng}`
            )
                .then(function (response) {
                    setRequesting(false);
                    return response.json();
                })
                .then((data) => {
                    const sunrise = convertTimeToFullDate(data.results.sunrise);
                    const sunset = convertTimeToFullDate(data.results.sunset);
                    setDayBounds({
                        sunrise: getTimeInHourDec(sunrise),
                        sunset: getTimeInHourDec(sunset),
                    });
                })
                .catch(console.log);
        }
    }, [location]);

    useEffect(() => {
        if (!dayBounds.sunrise) {
            return;
        }
        const { adjustedTime, slope, intercept } = adjustTime(
            dayBounds.sunrise,
            dayBounds.sunset,
        );
        const currentTime = new Time(adjustedTime);
        setConversionFactors({
            slope,
            intercept,
        });
        setConvertedTime(currentTime.toTimeString());
    }, [dayBounds]);

    useEffect(() => {
        if (!time) {
            return;
        }
        const { slope, intercept } = conversionFactors;

        const previousHours = new Time(time).getHours();
        const intervalId = setInterval(() => {
            const currentTime = new Time(time);
            const newTime = getConvertedTime(slope, intercept, dayBounds);
            currentTime.addSeconds(1);
            if (previousHours < 6.0 && currentTime.getHours() > 6.0) {
                return setConversionFactors(initState);
            }
            console.log("formula", newTime, "time by adding", currentTime.toHours());
            setConvertedTime(currentTime.toTimeString());
            // setConvertedTime(new Time(newTime).toTimeString());
        }, 1000 / slope);

        return function cleanup() {
            clearInterval(intervalId);
        };
    }, [time, conversionFactors]);

    const { xValues, yValues } = adjustTime(dayBounds.sunrise, dayBounds.sunset);
    if (!location) {
        return (
            <div>
                Location services need to be turned on for the clock to run
            </div>
        );
    }

    return (
        <div>
            <Clock
                width={width}
                height={height}
                y={yValues}
                time={time || "Loading..."}
                currentTime={{
                    x: getTimeInHourDec(new Date()),
                    y: new Time(time).toHours(),
                }}
            />
            {debugging && <DebuggingPlot
                x={xValues} y={yValues}
                currentTime={{
                    x: getTimeInHourDec(new Date()),
                    y: new Time(time).toHours(),
                }}
            />}
        </div>
    );
}

export default ClockWrapper;
