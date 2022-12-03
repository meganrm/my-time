import React, { useEffect, useState } from "react";
import ClockWrapper from "./ClockWrapper";

// eslint-disable-next-line space-before-function-paren
export default function App() {
    const [windowSize, setWindowSize] = useState(getWindowSize());
    const [location, setLatLng] = useState({ lat: 0, lng: 0 });
    const [requesting, setRequesting] = useState(false);
    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);
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
    return (
        <div
            className="App"
            style={{
                width: windowSize.innerWidth,
                height: windowSize.innerHeight,
            }}
        >
            <ClockWrapper
                width={windowSize.innerWidth}
                height={windowSize.innerHeight}
                location={location}
                setRequesting={setRequesting}
            />
        </div>
    );
}

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
}
