import { useEffect, useState } from 'react';
import MainClock from './MainClock';

export default function App() {
    const [windowSize, setWindowSize] = useState(getWindowSize());

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    return (
        <div style={{ width: windowSize.innerWidth, height: windowSize.innerHeight }}>
            <MainClock width={windowSize.innerWidth} height={windowSize.innerHeight} />
        </div>
    );
}

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
}