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
      revenue: "₹ 0"
    },
    Monthly: {
      prices: [10, 30, 40, 60, 50, 70, 90, 100],
      dates: ["Week 1", "Week 2", "Week 3", "Week 4"],
      revenue: "₹ 0"
    },
    Yearly: {
      prices: [100, 200, 300, 400, 500, 600],
      dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      revenue: "₹ 0"
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
        height: window.innerWidth > 4000 ? 600 :
          window.innerWidth <= 1930 ? 450 :
            window.innerWidth <= 1400 ? 350 :
              window.innerWidth >= 968 ? 380 :
                window.innerWidth < 768 ? 280 : 400,
      },
      // response code
      responsive: [
        {
          breakpoint: 4000,
          options: {
            chart: { height: 600 }
          }
        },
        {
          breakpoint: 1930,
          options: {
            chart: { height: 450 }
          }
        },
        {
          breakpoint: 1400,
          options: {
            chart: { height: 350 }
          }
        },
        {
          breakpoint: 968,
          options: {
            chart: { height: 380 }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: { height: 280 }
          }
        }
      ],
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
          show: true,
          style: { fontFamily: 'Be Vietnam Pro', colors: 'var(--text-color)' }
        },
        // tickAmount: series[selectedPeriod].dates.length
      },
      yaxis: {
        labels: {
          formatter: (value) => value === 0 ? "" : `${value}k`,
          style: { fontFamily: 'Be Vietnam Pro', colors: 'var(--text-color)' }
        },
        tickAmount: series[selectedPeriod].dates.length
      },
      legend: {
        horizontalAlign: 'left', labels: {
          style: {
            fontFamily: 'Be Vietnam Pro',
            color: 'var(--text-color)'
          }
        }
      },
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
              TabIndicatorProps={{ style: { display: "none" } }}>
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
