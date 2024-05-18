'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({accounts}: DoughnutChartProps) => {
    const data = {
        datasets: [
            {
                label: "Account",
                data: [2387.62, 13784, 119814.61],
                backgroundColor: ["#0747b6", "#2265d8", "#2f91f8"]
            }
        ],
        labels: ["Checking", "Global", "Savings"]
    }
  return (
    <Doughnut data={data} />
  )
}

export default DoughnutChart