import React from 'react';
import './CustomerDashboard.css';
import Banner from '../../../../../common/Banner/Banner';
import ServiceKpi from '../ServiceKpi/ServiceKpi';
import ServiceRecords from '../ServiceRecords/ServiceRecords';

const CustomerDashboard = () => {
  return (
    <>
      <Banner />
      <ServiceKpi />
      <ServiceRecords />
    </>
  )
}

export default CustomerDashboard