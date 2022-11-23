import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js'
function Clock({dayInterval, nightInterval, time}) {
    const [date, setDate] = useState(new Date());

    <Plot
        data={[
            {
                x: x,
                y: y,
                type: 'scatter',
                mode: 'markers',
                marker: { color: 'red' },
            },
        ]}
        layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
    />
    );
}
export default Clock;