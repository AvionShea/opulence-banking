'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({accounts}: DoughnutChartProps) => {
    const data = {
        datasets: [
            {
                label: "Account",
                data: [9548.84, 5622.78, 119814.61],
                backgroundColor: ["#9FFFCB", "#25A18E", "#004E64"]
            }
        ],
        labels: ["Checking", "Global", "Savings"]
    }
  return (
    <Doughnut data={data} />
  )
}

export default DoughnutChart