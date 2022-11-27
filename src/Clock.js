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

    const markerColor = (degree) => {
        const index = Math.round(Math.cos(2 * degreesToRadians(degree)) + 1);
        const dayColors = ["#bb3e03", "#ca6702", "#E9D8A6"];
        const nightColors = ["#94d2bd", "#0a9396", "#023e4b"];
        if (isDay(degree)) {
            return dayColors[index];
        }
        return nightColors[index];
    };
    const radialAxisTicks = getRadialAxisMarkers(dayRadius);
    return (
        <div>
            <Plot data={[
                {
                    r: NIGHT_ARC.map(_ => EQUINOX_RADIUS),
                    theta: NIGHT_ARC,
                    type: "scatterpolar",
                    mode: "line",
                    line: { color: "#8a8165" },
                    name: "EquiLux circle",
                    hovertext: "EquiLux circle",
                    hoverinfo: "name",
                },
                {
                    r: NIGHT_ARC.map(_ => nightRadius),
                    theta: NIGHT_ARC,
                    type: "scatterpolar",
                    mode: "line",
                    fill: "tonext",
                    line: { color: "#0a9396" },
                    name: "Dark time",
                    hoverinfo: "name",
                },

                {
                    r: DAY_ARC.map(_ => EQUINOX_RADIUS),
                    theta: DAY_ARC,
                    type: "scatterpolar",
                    mode: "line",
                    line: { color: "#8a8165" },
                    name: "EquiLux circle",
                    hoverinfo: "name",
                },
                {
                    r: DAY_ARC.map(_ => dayRadius),
                    theta: DAY_ARC,
                    type: "scatterpolar",
                    mode: "line",
                    fill: "tonext",
                    line: { color: "#bb3e03" },
                    name: "Light time",
                    hoverinfo: "name",
                },
                {
                    r: FULL_CIRCLE.map(_ => 10),
                    theta: FULL_CIRCLE,
                    type: "scatterpolar",
                    mode: "line",
                    fill: "toself",
                    fillcolor: markerColor(currentTime.y / 24.0 * 360),
                    line: { color: markerColor(currentTime.y / 24.0 * 360) },
                    hoverinfo: "skip",
                },
                {
                    r: [0, isDay(currentTime.y / 24.0 * 360) ? dayRadius : nightRadius],
                    theta: [0, currentTime.y / 24.0 * 360],
                    type: "scatterpolar",
                    mode: "marker",
                    marker: { color: markerColor(currentTime.y / 24.0 * 360), size: 8 },
                    line: { width: 4 },
                    hoverinfo: "skip",
                },

            ]}
            layout={{
                modebar: {
                    remove: ["lasso", "zoom", "select"],
                },
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
                        range: [1, radialAxisTicks[radialAxisTicks.length - 1].radius + 5],
                        showgrid: true,
                        showline: false,
                        showticklabels: true,
                        tickmode: "array",
                        tickvals: radialAxisTicks.map(ele => ele.radius),
                        ticks: "",
                        ticktext: radialAxisTicks.map(ele => ele.name),
                        tickcolor: "#b6bac2",
                        gridcolor: "#6e6e6e",
                        rotation: -1590,
                        layer: "below traces",
                        tickangle: 27,
                        tickfont: {
                            color: "#b6bac2",
                        },
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
                        layer: "below traces",

                    },

                },
            }}
            />
        </div>
    );
}

export default TimePlot;
