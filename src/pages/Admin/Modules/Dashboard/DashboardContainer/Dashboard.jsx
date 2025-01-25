import React from 'react';
import './Dashboard.css'
import Kpi from './../Kpi/Kpi';
import RevenueChart from '../RevenueChart/RevenueChart';
import CustomerGraph from '../CustomerGraph/CustomerGraph';
import { Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <>
      <Kpi />
      <Row className='mt-4'>
        <Col xl={7} lg={7} md={6}>
          <RevenueChart />
        </Col>
        <Col xl={5} lg={5} md={6}>
          <CustomerGraph />
        </Col>
      </Row>
    </>
  )
}

export default Dashboard;