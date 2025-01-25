import React from 'react';
import ReactECharts from 'echarts-for-react';
import './CustomerGraph.css'

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
        borderRadius: 5,
      },
    },
    color: ['#A6EFEB', '#91CDEE'],
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
      <ReactECharts
        option={option}
        className='piechart'
      />
    </>
  )
}

export default CustomerGraph