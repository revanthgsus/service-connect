import React, { useEffect, useMemo, useState } from 'react';
import './Kpi.css';
import { ReactComponent as ManagerIcon } from '../../../../../assets/images/admin/sidebar/manager.svg';
import { ReactComponent as AdvisorIcon } from '../../../../../assets/images/admin/sidebar/advisor.svg';
import { ReactComponent as CustomerIcon } from '../../../../../assets/images/admin/sidebar/customer.svg';
import { ReactComponent as AdminIcon } from '../../../../../assets/images/admin/sidebar/admin.svg';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import PreLoader from '../../../../../common/PreLoader/PreLoader';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../../../../contexts/AuthContext';

const Kpi = () => {
  const { setShowTokenModal, user } = useAuth();
  const [kpiCards, setKpiCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const kpiData = useMemo(() => {
    const data = [
      { key: 'totalManagers', title: 'Total Managers', value: '0', icon: <ManagerIcon /> },
      { key: 'totalAdvisors', title: 'Total Advisors', value: '0', icon: <AdvisorIcon /> },
      { key: 'totalCustomers', title: 'Total Customers', value: '0', icon: <CustomerIcon /> },
    ];

    if (user?.role === 'Super Admin' || user?.role === 'Chief Admin') {
      data.unshift({ key: 'totalAdmins', title: 'Total Admins', value: '0', icon: <AdminIcon /> });
    }

    return data;
  }, [user?.role]);


  // Fetch KPI data
  useEffect(() => {
    const fetchKpiData = async () => {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setShowTokenModal(true);
        return;
      }

      const getPayloadByRole = () => {
        switch (user?.role) {
          case 'Super Admin':
            return {};
          case 'Chief Admin':
            return { companyName: user.companyName };
          case 'Admin':
            return {
              companyName: user.companyName,
              companyLocation: user.companyLocation,
            };
          default:
            return {};
        }
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/userMaster/getAdminsDashboardCounts`,
          getPayloadByRole(),
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          });

        if (response?.status === 200 && response?.data) {
          const updatedData = kpiData.map((item, idx) => ({
            id: idx + 1,
            title: item.title,
            icon: item.icon,
            value: response.data[item.key] ?? 0,
          }));

          setKpiCards(updatedData);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error fetching counts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKpiData();
  }, [user, setShowTokenModal, kpiData]);


  return (
    <>
      {isLoading ? (
        <PreLoader />
      ) : (
        <section className="dashboard-kpi">
          <h5 className="dashboard-heading">Admin Dashboard</h5>
          <div className="kpi-alignment">
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
          </div>
        </section>
      )}

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
};

export default Kpi;
