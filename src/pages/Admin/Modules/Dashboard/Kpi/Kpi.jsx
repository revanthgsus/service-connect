import React from 'react';
import "./Kpi.css";
import { ReactComponent as ManagerIcon } from "../../../../../assets/images/admin/service-manager.svg";
import { ReactComponent as AdvisorIcon } from "../../../../../assets/images/admin/service-advisor.svg";
import { ReactComponent as CustomerIcon } from "../../../../../assets/images/admin/customer.svg";
import { ReactComponent as AdminIcon } from "../../../../../assets/images/admin/admin.svg";

const Kpi = () => {
  const KpiData = [
    {
      "id": 1,
      "title": "Service Manager",
      "value": "3",
      "icon": <ManagerIcon />
    },
    {
      "id": 2,
      "title": "Service Advisor",
      "value": "12",
      "icon": <AdvisorIcon />
    },
    {
      "id": 3,
      "title": "Total Customers",
      "value": "35",
      "icon": <CustomerIcon />
    },
    {
      "id": 4,
      "title": "Total Admins",
      "value": "2",
      "icon": <AdminIcon />
    },
  ];

  return (
    <section className='dashboard-kpi'>
      <h5 className='dashboard-heading'>Admin Dashboard</h5>
      <div className='kpi-alignment'>
        {KpiData.map((data) => (
          <div key={data.id} className="kpi-item">
            <div className='kpi-icon'>{data.icon}</div>
            <div className="kpi-value">
              <h6>{data.title}</h6>
              <h2>{data.value}</h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Kpi;
