import React from 'react';
import "./AdvisorDashboard.css";
import { Col, Row } from 'react-bootstrap';
import Banner from '../../../../../common/Banner/Banner';
import Ratings from '../Ratings/Ratings';
import ServiceStatus from './../ServiceStatus/ServiceStatus';
import RevenueChart from '../../../../Admin/Modules/Dashboard/RevenueChart/RevenueChart';
import RecentRequest from '../RecentRequest/RecentRequest';

const AdvisorDashboard = () => {
  return (
    <>
      <Row>
        <Col xxl={8} xl={8}>
          <Banner />
          <ServiceStatus />
          <RevenueChart />
        </Col>
        <Col xxl={4} xl={4} className='mt-xl-0 mt-4'>
          <Ratings />
          <RecentRequest />
        </Col>
      </Row >
    </>
  )
}

export default AdvisorDashboard