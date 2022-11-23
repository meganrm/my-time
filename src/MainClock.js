import React, { useState, useEffect } from 'react';
import './App.css';
import { adjustTime, getTimeInHourDec, convertTimeToFullDate } from './utils'
import Time from './time';
import TimePlot from './TimePlot';

function MainClock({height, width}) {

  let options;
  const [location, setLatLng] = useState({ lat: 0, lng: 0 });
  const [requesting, setRequesting] = useState(false);
  const [dayBounds, setDayBounds] = useState({sunrise: 0, sunset: 0})
  const [time, setAdjustedTime] = useState();
  const [timeFactor, setTimeFactor] = useState();

  const success = (pos) => {
    if (requesting) {
      return
    }
    const crd = pos.coords;
    const minChange = 10
    if (Math.abs(crd.latitude - location.lat) > minChange || Math.abs(crd.longitude - location.lng) > minChange) {
      setLatLng({ lat: crd.latitude, lng: crd.longitude })
    }
  }

  useEffect(() => {
    if (location.lat !== 0 && location.lng !== 0) {
      setRequesting(true)
      fetch(`https://api.sunrise-sunset.org/json?lat=${location.lat}&lng=${location.lng}`,
      )
        .then(function (response) {
          setRequesting(false)
          return response.json()

        }).then((data) => {
          const sunrise = convertTimeToFullDate(data.results.sunrise)
          const sunset = convertTimeToFullDate(data.results.sunset)
          setDayBounds({
            sunrise: getTimeInHourDec(sunrise),
            sunset: getTimeInHourDec(sunset)
          })
        })
    }
  }, [location])

  useEffect(() => {
    if (!dayBounds.sunrise) {
      return
    }
    let {
      adjustedTime,
      slope,
    } = adjustTime(dayBounds.sunrise, dayBounds.sunset)
    const currentTime = new Time(adjustedTime)
    setTimeFactor(slope)
    setAdjustedTime(currentTime.toTimeString())
  }, [dayBounds])

  useEffect(() => {
    if (!time) {
      return
    }

    const intervalId = setInterval(() => {
      const currentTime = new Time(time)
      currentTime.addSeconds(1)
      setAdjustedTime(currentTime.toTimeString())
    }, 1000 / timeFactor)

    return function cleanup() {
      clearInterval(intervalId);
    };
  }, [timeFactor, time])


  function error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }

  options = {
    enableHighAccuracy: false,
    maximumAge: 100000
  };
  navigator.geolocation.watchPosition(success, error, options);
  let {
    xValues,
    yValues,
  } = adjustTime(dayBounds.sunrise, dayBounds.sunset)
  if (!time) {
    return 
  }
  return (
    <div className="App">
      <TimePlot width={width} height={height} x={xValues} y={yValues} time={time} currentTime={{ x: getTimeInHourDec(new Date()), y: new Time(time).toHours() }}/>
    </div>
  );
}

export default MainClock;
