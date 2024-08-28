import './graph.css';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const Graph = ({
  className,
  title = 'Dynamic Data Updates',
  xAxisLabel = 'X-Axis',
  yAxisLabel = 'Y-Axis',
  xScale = { min: 0, max: 10 },
  yScale = { min: 0, max: 100 },
  windowSize = 10, 
  updateInterval = 2000, 
  lineColor = 'rgba(75,192,192,1)'
}) => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Dynamic Data',
        data: [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: lineColor,
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.datasets[0].data, Math.floor(Math.random() * 100)];
        const newLabels = [...prevData.labels, `${prevData.labels.length + 1}`];

        if (newData.length > windowSize) {
          newData.shift();
          newLabels.shift();
        }

        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        };
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [windowSize, updateInterval]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel,
        },
        min: xScale.min,
        max: xScale.max,
        ticks: {
          callback: function(value) {
            return value >= xScale.min && value <= xScale.max ? value : '';
          }
        }
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
        },
        min: yScale.min,
        max: yScale.max,
      },
    },
  };

  return (
    <div className={className}>
      <Line data={data} options={options} />
    </div>
  );
};

export default Graph;
