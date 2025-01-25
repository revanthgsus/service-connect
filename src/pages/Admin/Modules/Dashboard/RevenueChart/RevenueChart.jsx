import React from 'react';
import "./RevenueChart.css";
import ReactApexChart from 'react-apexcharts';

const RevenueChart = () => {
  const series = {
    monthDataSeries1: {
      prices: [190, 200, 190, 240, 290, 340],
      dates: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
    }
  };

  const chartData = {
    series: [
      {
        name: "Revenue Chart",
        data: series.monthDataSeries1.prices
      }
    ],
    options: {
      chart: {
        type: 'area',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Total Revenue',
        align: 'left'
      },
      subtitle: {
        text: '₹12346',
        align: 'left'
      },
      labels: series.monthDataSeries1.dates,
      xaxis: {
        type: 'category',
      },
      yaxis: {},
      legend: {
        horizontalAlign: 'left'
      },
      colors: ['#3498db']
    }
  };

  return (
    <div id="chart" className='revenuegraph'>
      <ReactApexChart options={chartData.options} series={chartData.series} type="area" />
    </div>
  );
};

export default RevenueChart;
