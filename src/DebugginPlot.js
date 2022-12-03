/* eslint-disable react/prop-types */
import React from "react";
import Plot from "react-plotly.js";

function DebuggingPlot ({ x, y, currentTime }) {
    return (
        <Plot
            data={[
                {
                    x,
                    y,
                    type: "scatter",
                    mode: "markers",
                    marker: { color: "blue" },
                },
                {
                    x: [currentTime.x],
                    y: [currentTime.y],
                    type: "scatter",
                    mode: "markers",
                    marker: { color: "magenta" },
                },

            ]}
            layout={{ width: 600, height: 400, title: "Time" }}
            config={{ responsive: true }}
        />
    );
}

export default DebuggingPlot;
