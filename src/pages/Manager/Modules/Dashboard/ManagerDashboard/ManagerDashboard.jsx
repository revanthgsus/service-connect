import React from 'react'
import { Col, Row } from 'react-bootstrap'
import ServiceStatus from '../../../../Advisor/Modules/Dashboard/ServiceStatus/ServiceStatus'
import Banner from '../../../../../common/Banner/Banner'
import RevenueChart from '../../../../Admin/Modules/Dashboard/RevenueChart/RevenueChart'
import Ratings from '../../../../Advisor/Modules/Dashboard/Ratings/Ratings'
import EscalateRequest from '../EscalateRequest/EscalateRequest'

const ManagerDashboard = () => {
  return (
    <>
      <Row>
        <Col xxl={8} xl={8}>
          <Banner />
          <ServiceStatus />
          <RevenueChart />
        </Col>
        <Col xxl={4} xl={4}>
          <Ratings />
          <EscalateRequest />
        </Col>
      </Row >
    </>
  )
}

export default ManagerDashboard