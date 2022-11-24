import React from 'react';
import Plot from 'react-plotly.js';
import { degreesToRadians } from './polarPlot';

function TimePlot({ x, y, currentTime, height, width, time }) {
    const isDay = (degree) => {
        return Math.cos(degreesToRadians(degree)) <= 0
    }
    const degrees = y.map(yValue => yValue / 24.0 * 360)
    const dayDegrees = degrees.filter(isDay)
    const changeInDay = dayDegrees[1] - dayDegrees[0]
    const nightDegrees = degrees.filter(degree => dayDegrees.indexOf(degree) === -1)
    const changeInNight = nightDegrees[1] - nightDegrees[0]
    const thetaFactor = changeInNight / changeInDay
    const EQUINOX_RADIUS = 30
    const dayRadius = EQUINOX_RADIUS - ((EQUINOX_RADIUS * (1 - thetaFactor)) / (thetaFactor + 1))
    const nightRadius = EQUINOX_RADIUS + ((EQUINOX_RADIUS * (1 - thetaFactor)) / (thetaFactor + 1))
    const dayArc = []
    for (let index = 90; index <= 270; index++) {
        dayArc.push(index);
    }
    const nightArc = []
    for (let index = -90; index <= 90; index++) {
        nightArc.push(index);
    }
    const equal = []
    for (let index = 0; index < 360; index++) {
        equal.push(index);
    }

    const outerRadius = Math.max(dayRadius, nightRadius)
    const markerColor = (degree) => {
        const index = Math.round(Math.cos(2 * degreesToRadians(degree)) + 1)
        const dayColors = ["#bb3e03", "#ca6702", "#E9D8A6"]
        const nightColors = ["#005f73", "#0a9396", "#94d2bd"]
        if (isDay(degree)) {
            return dayColors[index]
        }
        return nightColors[index]
    }

    return (
        <div>
            <Plot data={[
                {
                    r: nightArc.map(degree => 30),
                    theta: nightArc,
                    type: 'scatterpolar',
                    mode: 'line',
                    // fill: 'toself',
                    line: { color: '#e9d8a6' },
                },
                {
                    r: nightArc.map(degree => nightRadius),
                    theta: nightArc,
                    type: 'scatterpolar',
                    mode: 'line',
                    fill: 'tonext',
                    line: { color: '#0a9396' },
                },


                {
                    r: dayArc.map(degree => 30),
                    theta: dayArc,
                    type: 'scatterpolar',
                    mode: 'line',
                    // fill: 'toself',
                    line: { color: '#e9d8a6' },
                },
                {
                    r: dayArc.map(degree => dayRadius),
                    theta: dayArc,
                    type: 'scatterpolar',
                    mode: 'line',
                    fill: 'tonext',

                    line: { color: '#bb3e03' },
                    marker: {
                        color: {
                        }
                    }
                },


                {
                    r: [0, isDay(currentTime.y / 24.0 * 360) ? dayRadius : nightRadius],
                    theta: [0, currentTime.y / 24.0 * 360],
                    type: 'scatterpolar',
                    mode: 'marker',
                    marker: { color: markerColor(currentTime.y / 24.0 * 360) },
                },

            ]}
                layout={{
                    annotations: [{ 
                        text: time,
                        font: {

                            color: "white",
                        },
                        showarrow: false,
                        // y: currentTime.y / 24.0 * 360 
                    }],
                    showlegend: false,
                    width: width,
                    height: height,
                    paper_bgcolor: "#282c34",
                    polar: {
                        width: window.innerWidth,
                        bgcolor: "282c34",
                        radialaxis: {
                            range: [1, outerRadius + 5],
                            showgrid: false,
                            showline: true,
                            showticklabels: false,
                            ticks: "",
                            linecolor: "green"
                        },
                        angularaxis: {
                            direction: "clockwise",
                            gridwidth: 0.1,
                            linecolor: "white",
                            tickcolor: "white",
                            period: 8,
                            rotation: 270,
                            tickmode: "array",
                            tickvals: [0, 45, 90, 135, 180, 225, 270, 315],
                            ticktext: ["midnight", "3 am", "6 am", "9 am", "noon", "3 pm", "6 pm", "9 pm"],
                            color: "white"
                        },


                    },
                }}
            // config={{ responsive: true }}

            />

            {/* <Plot
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
                        marker: { color: 'magenta' },
                    },


                ]}
                layout={{ width: 400, height: 400, title: 'Time' }}
                config={{responsive: true}}
            /> */}
        </div>
    );

}

export default TimePlot