/* eslint-disable react/prop-types */
import React, { useMemo } from "react";
import Plot from "react-plotly.js";

import {
    BACKGROUND_COLOR,
    DAY_ARC,
    NIGHT_ARC,
    EQUINOX_RADIUS,
    FULL_CIRCLE,
} from "../constants";
import {
    convertEventToDate,
    getRadialAxisMarkers,
    isDay,
    getMarkerColor,
} from "./selectors";
import {
    GRID_COLOR,
    EQUILUX_COLOR,
    NIGHT_COLOR,
    DAY_COLOR,
    TICK_FONT_COLOR,
} from "./constants";

function Clock({ y, currentTime, height, width, time, seasons }) {
    const degrees = y.map((yValue) => (yValue / 24.0) * 360);
    const dayDegrees = degrees.filter(isDay);
    const changeInDay = dayDegrees[1] - dayDegrees[0];
    const nightDegrees = degrees.filter(
        (degree) => dayDegrees.indexOf(degree) === -1
    );
    const changeInNight = nightDegrees[1] - nightDegrees[0];
    const thetaFactor = changeInNight / changeInDay;
    const dayRadius =
        EQUINOX_RADIUS -
        (EQUINOX_RADIUS * (1 - thetaFactor)) / (thetaFactor + 1);
    const nightRadius =
        EQUINOX_RADIUS +
        (EQUINOX_RADIUS * (1 - thetaFactor)) / (thetaFactor + 1);

    const equinox = useMemo(() => {
        if (!seasons.length) {
            return null;
        }
        return convertEventToDate(
            seasons.filter((seasonData) => seasonData.phenom === "Equinox")[1]
        );
    }, [seasons]);
    const solstices = useMemo(() => {
        if (!seasons.length) {
            return [];
        }
        return seasons.filter((seasonData) => seasonData.phenom === "Solstice");
    }, [seasons]);
    const radialAxisTicks = useMemo(() => {
        if (!equinox || !solstices.length) {
            return [];
        }
        return getRadialAxisMarkers(dayRadius, equinox, solstices);
    }, [dayRadius, equinox, solstices]);
    return (
        radialAxisTicks.length && (
            <div>
                <Plot
                    data={[
                        {
                            r: NIGHT_ARC.map((_) => EQUINOX_RADIUS),
                            theta: NIGHT_ARC,
                            type: "scatterpolar",
                            mode: "line",
                            line: { color: EQUILUX_COLOR, width: 1 },
                            name: "EquiLux circle",
                            hovertext: "EquiLux circle",
                            hoverinfo: "name",
                        },
                        {
                            r: NIGHT_ARC.map((_) => nightRadius),
                            theta: NIGHT_ARC,
                            type: "scatterpolar",
                            mode: "line",
                            fill: "tonext",
                            line: { color: NIGHT_COLOR, width: 4 },
                            name: "Dark time",
                            hoverinfo: "name",
                        },

                        {
                            r: DAY_ARC.map((_) => EQUINOX_RADIUS),
                            theta: DAY_ARC,
                            type: "scatterpolar",
                            mode: "line",
                            line: { color: EQUILUX_COLOR, width: 1 },
                            name: "EquiLux circle",
                            hoverinfo: "name",
                        },
                        {
                            r: DAY_ARC.map((_) => dayRadius),
                            theta: DAY_ARC,
                            type: "scatterpolar",
                            mode: "line",
                            fill: "tonext",
                            line: { color: DAY_COLOR, width: 4 },
                            name: "Light time",
                            hoverinfo: "name",
                        },
                        {
                            r: FULL_CIRCLE.map((_) => 10),
                            theta: FULL_CIRCLE,
                            type: "scatterpolar",
                            mode: "line",
                            fill: "toself",
                            fillcolor: getMarkerColor(
                                (currentTime.y / 24.0) * 360
                            ),
                            line: {
                                color: getMarkerColor(
                                    (currentTime.y / 24.0) * 360
                                ),
                            },
                            hoverinfo: "skip",
                        },
                        {
                            r: [
                                0,
                                isDay((currentTime.y / 24.0) * 360)
                                    ? dayRadius
                                    : nightRadius,
                            ],
                            theta: [0, (currentTime.y / 24.0) * 360],
                            type: "scatterpolar",
                            mode: "marker",
                            marker: {
                                color: getMarkerColor(
                                    (currentTime.y / 24.0) * 360
                                ),
                                size: 8,
                            },
                            line: { width: 4 },
                            hoverinfo: "skip",
                        },
                    ]}
                    layout={{
                        modebar: {
                            remove: ["lasso", "zoom", "select"],
                        },
                        annotations: [
                            {
                                text: time,
                                font: {
                                    color: "white",
                                },
                                showarrow: false,
                            },
                        ],
                        showlegend: false,
                        width,
                        height,
                        paper_bgcolor: BACKGROUND_COLOR,
                        polar: {
                            width: window.innerWidth,
                            bgcolor: BACKGROUND_COLOR,
                            radialaxis: {
                                range: [
                                    1,
                                    radialAxisTicks[radialAxisTicks.length - 1]
                                        ?.radius + 5,
                                ],
                                showgrid: true,
                                showline: false,
                                showticklabels: true,
                                tickmode: "array",
                                tickvals: radialAxisTicks.map(
                                    (ele) => ele.radius
                                ),
                                ticks: "",
                                ticktext: radialAxisTicks.map(
                                    (ele) => ele.name
                                ),
                                tickcolor: "#b6bac2",
                                gridcolor: "#6e6e6e",
                                layer: "below traces",
                                tickangle: 45,
                                tickfont: {
                                    color: TICK_FONT_COLOR,
                                },
                            },
                            angularaxis: {
                                direction: "clockwise",
                                gridwidth: 0.1,
                                linecolor: GRID_COLOR,
                                tickcolor: GRID_COLOR,
                                period: 8,
                                rotation: 270,
                                tickmode: "array",
                                tickvals: [0, 45, 90, 135, 180, 225, 270, 315],
                                ticktext: [
                                    "midnight",
                                    "3 am",
                                    "6 am",
                                    "9 am",
                                    "noon",
                                    "3 pm",
                                    "6 pm",
                                    "9 pm",
                                ],
                                color: TICK_FONT_COLOR,
                                layer: "below traces",
                            },
                        },
                    }}
                />
            </div>
        )
    );
}

export default Clock;
