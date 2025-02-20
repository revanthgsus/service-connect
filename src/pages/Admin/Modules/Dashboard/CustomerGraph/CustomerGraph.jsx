import React from 'react';
import ReactECharts from 'echarts-for-react';
import './CustomerGraph.css';
import { IoIosArrowDown } from "react-icons/io";

const CustomerGraph = () => {
  const option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'center',
      bottom: 0,
      itemWidth: 20,
      itemHeight: 20,
      itemStyle: {
        borderWidth: 2,
        borderRadius: 10,
      },
    },
    color: ['#57E5A9', '#28BDC4'],
    series: [
      {
        name: 'Customers Chart',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1050, name: 'New Customers' },
          { value: 700, name: 'Previous Customers' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(49, 49, 49, 0.5)',
          },
        },
        label: {
          show: false,
        },
      },
    ],
  };

  return (
    <>
      <div id="chart" className='piechart'>
        <div className="chart-header">
          <h6>Cutomer Overview</h6>
          <div className="status-wrapper">
            <select className="chart-select">
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <IoIosArrowDown className="arrow-icon" />
          </div>
        </div>
        <ReactECharts option={option} />
      </div >
    </>
  )
}

export default CustomerGraph