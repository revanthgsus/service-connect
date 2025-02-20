import React, { useState } from 'react';
import "./RevenueChart.css";
import ReactApexChart from 'react-apexcharts';
import { IoIosArrowDown } from "react-icons/io";

const RevenueChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");

  const series = {
    Weekly: {
      prices: [0, 10, 20, 30, 20, 30, 40, 50],
      dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      revenue: "₹ 12,346"
    },
    Monthly: {
      prices: [10, 30, 40, 60, 50, 70, 90, 100],
      dates: ["Week 1", "Week 2", "Week 3", "Week 4"],
      revenue: "₹ 52,784"
    },
    Yearly: {
      prices: [100, 200, 300, 400, 500, 600, 700, 800],
      dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      revenue: "₹ 6,23,400"
    }
  };

  const handleSelectChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const chartData = {
    series: [
      {
        name: "Revenue",
        data: series[selectedPeriod].prices
      }
    ],
    options: {
      chart: {
        type: 'area',
        zoom: { enabled: false },
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: {
        text: series[selectedPeriod].revenue,
        align: 'left',
        style: { fontFamily: 'Be Vietnam Pro', color: 'var(--text-color)', fontSize: "18px" }
      },
      labels: series[selectedPeriod].dates,
      xaxis: {
        type: 'category',
        labels: {
          style: { fontFamily: 'Be Vietnam Pro', colors: 'var(--text-color)' }
        }
      },
      yaxis: {
        labels: {
          formatter: (value) => value === 0 ? "" : `${value}k`,
          style: { fontFamily: 'Be Vietnam Pro', colors: 'var(--text-color)' }
        }
      },
      legend: { horizontalAlign: 'left', labels: { style: { fontFamily: 'Be Vietnam Pro', color: 'var(--text-color)' } } },
      colors: ['#3498db']
    }
  };

  return (
    <>
      <div id="chart" className='revenuegraph'>
        <div className="chart-header">
          <h6>Total Revenue</h6>
          <div className="status-wrapper">
            <select value={selectedPeriod} onChange={handleSelectChange} className="chart-select">
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <IoIosArrowDown className="arrow-icon" />
          </div>
        </div>
        <ReactApexChart options={chartData.options} series={chartData.series} type="area" />
      </div >
    </>
  );
};

export default RevenueChart;
