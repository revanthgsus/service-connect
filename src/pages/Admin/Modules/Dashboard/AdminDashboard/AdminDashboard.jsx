import React from 'react';
import "./AdminDashboard.css"
import Kpi from '../Kpi/Kpi';
import { Col, Row } from 'react-bootstrap';
import RevenueChart from '../RevenueChart/RevenueChart';
// import CustomerGraph from '../CustomerGraph/CustomerGraph';

const AdminDashboard = () => {
  return (
    <>
      <Kpi />
      <Row className='mt-4'>
        <Col xxl={8} xl={8} lg={8} md={12} sm={12}>
          <RevenueChart />
        </Col>
        <Col xxl={4} xl={4} lg={4} md={12} sm={12}>
          {/* <CustomerGraph /> */}
        </Col>
      </Row>
    </>
  )
}

export default AdminDashboard;