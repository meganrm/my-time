import React from 'react';
import Plot from 'react-plotly.js';

function TimePlot({ x, y, currentTime }) {
    return (
        <Plot
            data={[
                {
                    x: x,
                    y: y,
                    type: 'scatter',
                    mode: 'markers',
                    marker: { color: 'blue' },
                },
                {
                    x: [currentTime.x],
                    y: [currentTime.y],
                    type: 'scatter',
                    mode: 'markers',
                    marker: { color: 'red' },
                },


            ]}
            layout={{ width: 400, height: 400, title: 'Time' }}
        />
    );

}

export default TimePlot