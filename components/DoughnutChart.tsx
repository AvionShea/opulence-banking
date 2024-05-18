'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({accounts}: DoughnutChartProps) => {
    const data = {
        datasets: [
            {
                label: "Account",
                data: [12048.84, 8122.78, 114814.61],
                backgroundColor: ["#9FFFCB", "#25A18E", "#004E64"]
            }
        ],
        labels: ["Checking", "Global", "Savings"]
    }
  return (
    <Doughnut 
    data={data}
    options={{
        cutout: '60%',
        plugins: {
            legend: {
                display: false
            }
        }
    }} 
    />
  )
}

export default DoughnutChart