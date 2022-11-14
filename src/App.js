import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { convertToLocalTime, adjustTime } from './utils'

function App() {

  let options;
  const [location, setLatLng] = useState({ lat: 0, lng: 0 });
  const [sunData, setSunData] = useState({})
  const [requesting, setRequesting] = useState(false)
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
      axios({
        method: 'get',
        url: `https://api.sunrise-sunset.org/json?lat=${location.lat}&lng=${location.lng}`,
      })
        .then(function (response) {
          setRequesting(false)
          return response.data

        }).then((data) => {
          setSunData(data.results)

        })
    }
  }, [location])


  function error(err) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }


  options = {
    enableHighAccuracy: false,
    maximumAge: 100000
  };
  navigator.geolocation.watchPosition(success, error, options);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
          <li> Sunrise: {convertToLocalTime(sunData.sunrise)}</li>
          <li>Sunset: {convertToLocalTime(sunData.sunset)}</li>
          <li>{adjustTime(sunData.sunrise, sunData.sunset)}</li>
      </header>
    </div>
  );
}

export default App;
