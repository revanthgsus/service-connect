import React from 'react';
import './CustomerDashboard.css';
import Banner from '../../../../../common/Banner/Banner';
import ServiceKpi from '../ServiceKpi/ServiceKpi';
// import ServiceRecords from '../ServiceRecords/ServiceRecords';
import { Row, Col } from 'react-bootstrap';

const CustomerDashboard = () => {
  return (
    <>
      <Row>
        <Col xxl={8} xl={8}>
          <Banner />
        </Col>
        <Col xxl={4} xl={4} className='mt-xl-0 mt-4'>
          <ServiceKpi />
        </Col>
      </Row >
      {/* <ServiceRecords /> */}
    </>
  )
}

export default CustomerDashboard