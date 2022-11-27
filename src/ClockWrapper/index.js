/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "../App.css";
import { adjustTime, getTimeInHourDec, convertTimeToFullDate } from "./selectors";
import Time from "../time";
import Clock from "../Clock";

function ClockWrapper ({ height, width }) {
    const [location, setLatLng] = useState({ lat: 0, lng: 0 });
    const [requesting, setRequesting] = useState(false);
    const [dayBounds, setDayBounds] = useState({ sunrise: 0, sunset: 0 });
    const [time, setAdjustedTime] = useState();
    const [timeFactor, setTimeFactor] = useState();
    const options = {
        enableHighAccuracy: false,
        maximumAge: 100000,
    };
    const success = (pos) => {
        if (requesting) {
            return;
        }
        const crd = pos.coords;
        const minChange = 10;
        if (
            Math.abs(crd.latitude - location.lat) > minChange ||
            Math.abs(crd.longitude - location.lng) > minChange
        ) {
            setLatLng({ lat: crd.latitude, lng: crd.longitude });
        }
    };
    function error(err) {
        console.error(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.watchPosition(success, error, options);
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
        const { adjustedTime, slope } = adjustTime(
            dayBounds.sunrise,
            dayBounds.sunset,
        );
        const currentTime = new Time(adjustedTime);
        setTimeFactor(slope);
        setAdjustedTime(currentTime.toTimeString());
    }, [dayBounds]);

    useEffect(() => {
        if (!time) {
            return;
        }

        const intervalId = setInterval(() => {
            const currentTime = new Time(time);
            currentTime.addSeconds(1);
            setAdjustedTime(currentTime.toTimeString());
        }, 1000 / timeFactor);

        return function cleanup() {
            clearInterval(intervalId);
        };
    }, [timeFactor, time]);

    const { yValues } = adjustTime(dayBounds.sunrise, dayBounds.sunset);
    if (!location) {
        return (
            <div>
                Location services need to be turned on for the clock to run
            </div>
        );
    } else if (!time) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <Clock
                width={width}
                height={height}
                y={yValues}
                time={time}
                currentTime={{
                    x: getTimeInHourDec(new Date()),
                    y: new Time(time).toHours(),
                }}
            />
        </div>
    );
}

export default ClockWrapper;
