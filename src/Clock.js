/* eslint-disable react/prop-types */
import React from "react";
import Plot from "react-plotly.js";
import { BACKGROUND_COLOR, DAY_ARC, NIGHT_ARC, EQUINOX_RADIUS, FULL_CIRCLE } from "./constants";
import { degreesToRadians } from "./polarPlot";
import { getRadialAxisMarkers } from "./utils";

function TimePlot({ y, currentTime, height, width, time }) {
    const isDay = (degree) => {
        return Math.cos(degreesToRadians(degree)) <= 0;
    };
    const degrees = y.map(yValue => yValue / 24.0 * 360);
    const dayDegrees = degrees.filter(isDay);
    const changeInDay = dayDegrees[1] - dayDegrees[0];
    const nightDegrees = degrees.filter(degree => dayDegrees.indexOf(degree) === -1);
    const changeInNight = nightDegrees[1] - nightDegrees[0];
    const thetaFactor = changeInNight / changeInDay;
    const dayRadius = EQUINOX_RADIUS - ((EQUINOX_RADIUS * (1 - thetaFactor)) / (thetaFactor + 1));
    const nightRadius = EQUINOX_RADIUS + ((EQUINOX_RADIUS * (1 - thetaFactor)) / (thetaFactor + 1));

    const outerRadius = Math.max(dayRadius, nightRadius);
    const markerColor = (degree) => {
        const index = Math.round(Math.cos(2 * degreesToRadians(degree)) + 1);
        const dayColors = ["#bb3e03", "#ca6702", "#E9D8A6"];
        const nightColors = ["#005f73", "#0a9396", "#94d2bd"];
        if (isDay(degree)) {
            return dayColors[index];
        }
        return nightColors[index];
    };
    const { smallestRadius, largestRadius, nowRadius } = getRadialAxisMarkers(dayRadius);
    console.log(smallestRadius, largestRadius, nowRadius);
    return (
        <div>
            <Plot data={[
                {
                    r: NIGHT_ARC.map(_ => EQUINOX_RADIUS),
                    theta: NIGHT_ARC,
                    type: "scatterpolar",
                    mode: "line",
                    line: { color: "#e9d8a6" },
                    name: "EquiLux circle",
                },
                {
                    r: NIGHT_ARC.map(_ => nightRadius),
                    theta: NIGHT_ARC,
                    type: "scatterpolar",
                    mode: "line",
                    fill: "tonext",
                    line: { color: "#0a9396" },
                    name: "Night scaled to length of darkness",
                },

                {
                    r: DAY_ARC.map(_ => EQUINOX_RADIUS),
                    theta: DAY_ARC,
                    type: "scatterpolar",
                    mode: "line",
                    line: { color: "#e9d8a6" },
                    name: "EquiLux circle",
                },
                {
                    r: DAY_ARC.map(_ => dayRadius),
                    theta: DAY_ARC,
                    type: "scatterpolar",
                    mode: "line",
                    fill: "tonext",
                    line: { color: "#bb3e03" },
                    name: "Day scaled to length of light",
                },
                {
                    r: FULL_CIRCLE.map(_ => 10),
                    theta: FULL_CIRCLE,
                    type: "scatterpolar",
                    mode: "line",
                    fill: "toself",
                    fillcolor: markerColor(currentTime.y / 24.0 * 360),
                    line: { color: markerColor(currentTime.y / 24.0 * 360) },
                },
                {
                    r: [0, isDay(currentTime.y / 24.0 * 360) ? dayRadius : nightRadius],
                    theta: [0, currentTime.y / 24.0 * 360],
                    type: "scatterpolar",
                    mode: "marker",
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
                }],
                showlegend: false,
                width,
                height,
                paper_bgcolor: BACKGROUND_COLOR,
                polar: {
                    width: window.innerWidth,
                    bgcolor: BACKGROUND_COLOR,
                    radialaxis: {
                        range: [1, outerRadius + 5],
                        showgrid: false,
                        showline: false,
                        showticklabels: false,
                        ticks: "",
                        // tickmode: "array",
                        // tickvals: [smallestRadius, nowRadius, 30, largestRadius],
                        // ticktext: ["solstice", "now", "eqinox", "solstice"],
                        // gridcolor: "white",
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
                        color: "white",
                    },

                },
            }}
            />
        </div>
    );
}

export default TimePlot;
