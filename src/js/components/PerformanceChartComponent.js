import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "../../styles/components/PerformanceChartComponent.css";

function PerformanceChart({ sessions }) {
  // sort the sessions by ascending date
  sessions = sessions.sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = {
    labels: sessions
      ? sessions.map((session) => new Date(session.date).toLocaleString())
      : [],
    datasets: [
      {
        label: "Median Score",
        data: sessions ? sessions.map((session) => session.medianScore) : [],
        fill: false,
        backgroundColor: "rgba(179,176,235,0.4)",
        borderColor: "rgba(88,75,242,1)",
      },
    ],
  };

  return (
    <div className="mt-5">
      <h3 className={"chart-header"}>Performance Chart</h3>
      <Line data={chartData} />
    </div>
  );
}

export default PerformanceChart;
