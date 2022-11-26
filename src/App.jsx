import React, { useEffect, useState } from "react";
import ClockWrapper from "./ClockWrapper";

// eslint-disable-next-line space-before-function-paren
export default function App() {
    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

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
            />
        </div>
    );
}

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
}
