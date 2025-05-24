import React, { useCallback, useEffect, useState } from 'react';
import "./RevenueChart.css";
import ReactApexChart from 'react-apexcharts';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';
import API_BASE_URL from '../../../../../services/AuthService';
import axios from 'axios';
import { ReactComponent as NoDataImage } from "../../../../../assets/images/comman/empty/appoint.svg";
import Skeleton from '@mui/material/Skeleton';

const RevenueChart = () => {
  const { setShowTokenModal } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    dates: {},
    totalAmount: "₹ 0",
    pricesRecord: []
  });


  const role = sessionStorage.getItem("userRole");
  const advisorId = sessionStorage.getItem("userId");
  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");


  // fetch revenue data from api
  const fetchRevenue = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    let endpoint = "";

    // Role-based endpoint selection
    switch (role) {
      case "Chief Admin":
        endpoint = `adminMaster/getTotalRevenueByCompanyName/${companyName}/${selectedPeriod}`;
        break;
      case "Advisor":
        endpoint = `advisorMaster/getTotalRevenueByAdvisorId/${advisorId}/${selectedPeriod}`;
        break;
      case "Admin":
      case "Manager":
        endpoint = `adminMaster/getTotalRevenueByCompanyNameAndLocation/${companyName}/${companyLocation}/${selectedPeriod}`;
        break;
      default:
        toast.error("Invalid user role");
        return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response?.data?.status === "success") {
        let revenueRecord = {};
        if (selectedPeriod === "Weekly") {
          revenueRecord = response?.data?.dayWiseRecord || {};
        } else if (selectedPeriod === "Monthly") {
          revenueRecord = response?.data?.weekWiseRecord || {};
        } else if (selectedPeriod === "Yearly") {
          revenueRecord = response?.data?.monthlyBreakdown || {};
        }

        const dates = Object.keys(revenueRecord);
        const pricesRecord = Object.values(revenueRecord);
        const total = pricesRecord.reduce((acc, val) => acc + Number(val), 0);
        const formattedRevenue = `₹ ${total.toLocaleString("en-IN")}`;

        setChartData({ dates, pricesRecord, totalAmount: formattedRevenue });
      } else {
        toast.error(response?.data?.message || "Failed to fetch revenue data");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [setShowTokenModal, selectedPeriod, companyName, companyLocation, advisorId, role]);


  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // tab change function
  const handleTabChange = (_, newValue) => {
    const periodNames = ["Weekly", "Monthly", "Yearly"];
    setSelectedPeriod(periodNames[newValue]);
  };


  // chart config for x-axis and y-axis
  const chartConfig = {
    series: [{ name: "Revenue", data: chartData.pricesRecord }],
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
      // responsive code
      responsive: [
        { breakpoint: 4000, options: { chart: { height: 600 } } },
        { breakpoint: 1930, options: { chart: { height: 450 } } },
        { breakpoint: 1400, options: { chart: { height: 350 } } },
        { breakpoint: 968, options: { chart: { height: 380 } } },
        { breakpoint: 768, options: { chart: { height: 280 } } }
      ],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: {
        text: chartData.totalAmount,
        align: 'left',
        style: { color: 'var(--text-color)', fontSize: "18px" }
      },
      labels: chartData.dates,
      xaxis: {
        type: 'category',
        labels: {
          show: true,
          style: { colors: 'var(--text-color)' }
        },
        tickAmount: chartData.dates.length
      },

      yaxis: {
        labels: {
          // formatter: (value) => value === 0 ? "0" : `₹${value}`,
          formatter: (value) => {
            if (value === 0) return "0";
            if (value >= 10000000) return `${Math.round(value / 10000000)}Cr`;
            if (value >= 100000) return `${Math.round(value / 100000)}L`;
            if (value >= 1000) return `${Math.round(value / 1000)}k`;
            return `₹${value}`;
          },

          style: { colors: 'var(--text-color)' }
        },
        tickAmount: chartData.dates.length
      },

      legend: {
        horizontalAlign: 'left',
        labels: {
          style: {
            color: 'var(--text-color)'
          }
        }
      },
      colors: ['#3498db']
    }
  };

  // Utility for responsive chart and skeleton height
  const getResponsiveHeight = () => {
    const width = window.innerWidth;
    if (width > 4000) return 580;
    if (width <= 1930 && width > 1620) return 430;
    if (width <= 1620 && width > 1200) return 430;
    if (width <= 1200 && width > 1200) return 320;
    if (width <= 968 && width > 768) return 360;
    if (width <= 768) return 260;
  };

  return (
    <>
      <div id="chart" className='revenuegraph'>
        <div className="chart-header">
          {loading ? (
            <Skeleton variant="text" animation="wave" width={150} height={50} />
          ) : (
            <h6>Total Revenue</h6>
          )}

          {loading ? (
            <Skeleton variant="text" animation="wave" width={200} height={60} />
          ) : (
            <Box className="chart-select">
              <Tabs value={["Weekly", "Monthly", "Yearly"].indexOf(selectedPeriod)}
                onChange={handleTabChange}
                TabIndicatorProps={{ style: { display: "none" } }}>
                <Tab label="Weekly" className='multi-tabs' />
                <Tab label="Monthly" className='multi-tabs' />
                <Tab label="Yearly" className='multi-tabs' />
              </Tabs>
            </Box>
          )}
        </div>


        {loading ? (
          <div className='skeleton-alignment'>
            <Skeleton variant="rounded" animation="wave" height={getResponsiveHeight()} />
          </div>
        ) : chartData.pricesRecord.length > 0 ? (
          <ReactApexChart
            options={chartConfig.options}
            series={chartConfig.series}
            type="area" />
        ) : (
          <div className="empty-chart">
            <NoDataImage />
            <p>No revenue data available for the selected period.</p>
          </div>
        )}
      </div>


      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default RevenueChart;
