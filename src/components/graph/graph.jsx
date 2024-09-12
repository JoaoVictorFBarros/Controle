import './graph.css';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const CircleBackgroundPlugin = {
  id: 'circleBackground',
  beforeDraw: (chart, args, options) => { 
    if (!options.radius) return;

    const { ctx, chartArea } = chart;
    const { left, top, right, bottom } = chartArea;
    const width = right - left;
    const height = bottom - top;
    const radius = Math.min(width, height) / (options.lgr_limit*2);
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 2; 
    ctx.stroke();
    ctx.restore();
  },
};

const CustomPointLabelsPlugin = {
  id: 'customPointLabels',
  afterDatasetsDraw: (chart, args, options) => {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    const points = meta.data;
    const { pointLabels } = options; 

    if (pointLabels && pointLabels.length === points.length) {
      points.forEach((point, index) => {
        const label = pointLabels[index];
        if (label) {
          ctx.save();
          ctx.font = '10px Arial';
          ctx.fillStyle = 'rgba(237,156,33,1)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, point.x, point.y);
          ctx.restore();
        }
      });
    }
  },
};

function Graph({
  className,
  title = 'Dynamic Data Updates',
  xAxisLabel = 'X-Axis',
  yAxisLabel = 'Y-Axis',
  lineColor = 'rgba(0,0,0,1)',
  xData = [],
  yData = [],
  xDecimalPlaces = 2,
  yDecimalPlaces = 4,
  printLine = true,
  xlabel = [],
  scale = true,
  radius,
  pointLabels = [], 
  lgr_limit,
}) {
  const truncateToDecimals = (num, decimals) => parseFloat(num.toFixed(decimals));

  const [data, setData] = useState({
    labels: xlabel.length > 0 ? xlabel : xData.map(value => truncateToDecimals(value, xDecimalPlaces)),
    datasets: [
      {
        label: 'Dynamic Data',
        data: yData.length > 0 ? yData.map(value => truncateToDecimals(value, yDecimalPlaces)) : [],
        fill: false,
        backgroundColor: 'transparent',
        borderColor: lineColor,
        pointRadius: 0,
        borderWidth: printLine ? 2 : 0,
      },
    ],
  });

  useEffect(() => {
    const truncatedXData = xData.map(value => truncateToDecimals(value, xDecimalPlaces));
    const truncatedYData = yData.map(value => truncateToDecimals(value, yDecimalPlaces));
  
    const hasDataChanged = JSON.stringify(truncatedXData) !== JSON.stringify(data.labels) ||
                           JSON.stringify(truncatedYData) !== JSON.stringify(data.datasets[0]?.data);
  
    if (hasDataChanged) {
      setData({
        labels: xlabel.length > 0 ? xlabel : truncatedXData,
        datasets: [
          {
            label: 'Dynamic Data',
            data: truncatedYData,
            fill: false,
            backgroundColor: 'transparent',
            borderColor: lineColor,
            pointRadius: 0,
            borderWidth: printLine ? 2 : 0,
          },
        ],
      });
    }
  }, [xData, yData, lineColor, xDecimalPlaces, yDecimalPlaces, printLine, xlabel, data]);
  
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
      customPointLabels: {
        pointLabels: pointLabels.length === xData.length ? pointLabels : null,
      },
      circleBackground: radius ? { radius, lgr_limit } : null,
    },
    scales: {
      x: {
        type: scale === false ? 'linear' : 'category', 
        title: {
          display: true,
          text: xAxisLabel,
        },
        min: scale === false ? lgr_limit ? -lgr_limit: -2 : undefined, 
        max: scale === false ? lgr_limit ? lgr_limit: 2 : undefined,  
      },
      y: {
        type: scale === false ? 'linear' : 'linear', 
        title: {
          display: true,
          text: yAxisLabel,
        },
        min: scale === false ?  lgr_limit ? -lgr_limit: -2 : undefined, 
        max: scale === false ?  lgr_limit ? lgr_limit: 2 : undefined,  
      },
    },
  };

  const plugins = [CustomPointLabelsPlugin];
  if (radius) {    
    plugins.push(CircleBackgroundPlugin);
  }

  return (
    <div className={className}>
      <Line
        data={data}
        options={options}
        plugins={plugins}
      />
    </div>
  );
}

export default Graph;
