import React, { useState } from 'react';
import "./RevenueChart.css";
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

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

  const handleTabChange = (event, newValue) => {
    const periodNames = ["Weekly", "Monthly", "Yearly"];
    setSelectedPeriod(periodNames[newValue]);
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
          <Box className="chart-select">
            <Tabs value={["Weekly", "Monthly", "Yearly"].indexOf(selectedPeriod)}
              onChange={handleTabChange}
              TabIndicatorProps={{ style: { display: "none" } }} >
              <Tab label="Weekly" className='multi-tabs' />
              <Tab label="Monthly" className='multi-tabs' />
              <Tab label="Yearly" className='multi-tabs' />
            </Tabs>
          </Box>
        </div>
        <ReactApexChart options={chartData.options} series={chartData.series} type="area" />
      </div >
    </>
  );
};

export default RevenueChart;
