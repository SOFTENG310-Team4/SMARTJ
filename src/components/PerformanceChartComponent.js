import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

function PerformanceChart({ sessions }) {
  const chartData = {
    labels: sessions
      ? sessions.map((session) => new Date(session.date).toLocaleDateString())
      : [],
    datasets: [
      {
        label: "Median Score",
        data: sessions ? sessions.map((session) => session.medianScore) : [],
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div className="mt-5">
      <h3>Performance Chart</h3>
      <Line data={chartData} />
    </div>
  );
}

export default PerformanceChart;
