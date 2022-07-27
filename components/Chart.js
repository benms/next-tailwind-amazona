import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LinearScale
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChartComponent({ data, title }) {
  return (
    <>
      <h2 className="text-xl">{title}</h2>
      <Bar
        options={{
          legend: { display: true, position: 'right' }
        }}
        data={data}
      />
    </>
  )
}
