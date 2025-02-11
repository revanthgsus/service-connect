import React, { useEffect, useMemo, useState } from 'react';
import './Kpi.css';
import { ReactComponent as ManagerIcon } from '../../../../../assets/images/admin/service-manager.svg';
import { ReactComponent as AdvisorIcon } from '../../../../../assets/images/admin/service-advisor.svg';
import { ReactComponent as CustomerIcon } from '../../../../../assets/images/admin/customer.svg';
import { ReactComponent as AdminIcon } from '../../../../../assets/images/admin/admin.svg';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../../../../services/AuthService';
import PreLoader from '../../../../../common/PreLoader/PreLoader';

const Kpi = () => {
  const [kpiCards, setKpiCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const kpiData = useMemo(() => [
    { id: 1, title: 'Total Managers', value: '0', icon: <ManagerIcon /> },
    { id: 2, title: 'Total Advisors', value: '0', icon: <AdvisorIcon /> },
    { id: 3, title: 'Total Customers', value: '0', icon: <CustomerIcon /> },
    { id: 4, title: 'Total Admins', value: '0', icon: <AdminIcon /> },
  ], []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Session expired. Please sign in to continue.');
      navigate('/');
      return;
    }

    const fetchKpiData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/userMaster/getAdminDashboardCounts`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data) {
          setKpiCards([
            { ...kpiData[0], value: response.data.totalManagers || 0 },
            { ...kpiData[1], value: response.data.totalAdvisors || 0 },
            { ...kpiData[2], value: response.data.totalCustomers || 0 },
            { ...kpiData[3], value: response.data.totalAdmins || 0 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching total counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKpiData();
  }, [navigate, kpiData]);

  return (
    <>
      {isLoading ? (
        <PreLoader />
      ) : (
        <section className="dashboard-kpi">
          <h5 className="dashboard-heading">Admin Dashboard</h5>
          <div className="kpi-alignment">
            {isLoading ? (
              <PreLoader />
            ) : (
              <Row>
                {kpiCards.map((data) => (
                  <Col key={data.id} xl={3} sm={6} className="py-2">
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
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Kpi;
