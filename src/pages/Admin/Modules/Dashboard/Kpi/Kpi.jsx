import React from 'react';
import './Kpi.css';
import { ReactComponent as ManagerIcon } from '../../../../../assets/images/admin/service-manager.svg';
import { ReactComponent as AdvisorIcon } from '../../../../../assets/images/admin/service-advisor.svg';
import { ReactComponent as CustomerIcon } from '../../../../../assets/images/admin/customer.svg';
import { ReactComponent as AdminIcon } from '../../../../../assets/images/admin/admin.svg';
import { Row, Col } from 'react-bootstrap';

const Kpi = () => {
  const KpiData = [
    {
      id: 1,
      title: 'Total Managers',
      value: '3',
      icon: <ManagerIcon />,
    },
    {
      id: 2,
      title: 'Total Advisors',
      value: '12',
      icon: <AdvisorIcon />,
    },
    {
      id: 3,
      title: 'Total Customers',
      value: '35',
      icon: <CustomerIcon />,
    },
    {
      id: 4,
      title: 'Total Admins',
      value: '2',
      icon: <AdminIcon />,
    },
  ];

  return (
    <section className="dashboard-kpi">
      <h5 className="dashboard-heading">Admin Dashboard</h5>
      <div className="kpi-alignment">
        <Row>
          {KpiData.map((data) => (
            <Col key={data.id} xl={3} sm={6} className='py-2'>
              <div className="kpi-item">
                <div className="kpi-icon">{data.icon}</div>
                <div className="kpi-value">
                  <h6>{data.title}</h6>
                  <h3>{data.value}</h3>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default Kpi;
