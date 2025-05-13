import React, { useEffect, useState } from 'react';
import './ServiceStatus.css';
import { Col, Row } from 'react-bootstrap';
import { ReactComponent as CompleteIcon } from '../../../../../assets/images/comman/dashboard/completed.svg';
import { ReactComponent as InprogressIcon } from '../../../../../assets/images/comman/dashboard/inprogress.svg';
import { ReactComponent as CancelIcon } from '../../../../../assets/images/comman/dashboard/total.svg';
import { useAuth } from '../../../../../contexts/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../../../../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify';

const ServiceStatus = () => {
  const { setShowTokenModal } = useAuth();
  const [counts, setCounts] = useState({
    completed: 0,
    inprogress: 0,
    total: 0
  });

  const companyName = sessionStorage.getItem("companyName");
  const companyLocation = sessionStorage.getItem("companyLocation");

  useEffect(() => {
    const fetchServiceCounts = async () => {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setShowTokenModal(true);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/managerMaster/getManagerServiceRecordsCounts/${companyName}/${companyLocation}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        if (response?.status === 200 && response.data) {
          setCounts({
            completed: response.data.completedServices,
            inprogress: response.data.inProgressServices,
            total: response.data.totalServices
          });
        } else {
          toast.error("Failed to fetch service records.")
        }
      } catch {
        toast.error("Something went wrong. Please try again later.")
      }
    }
    fetchServiceCounts();

  }, [companyName, companyLocation, setShowTokenModal]);


  return (
    <>
      <section className='service-kpi'>
        <Row>
          <Col xxl={4} xl={4} lg={4} md={4} sm={6} className='mb-3 mb-md-0'>
            <div className='service-container completed'>
              <div className='service-value'>
                <h6>Completed Services</h6>
                <h3>{counts.completed}</h3>
              </div>
              <div className='service-icon'>
                <CompleteIcon />
              </div>
            </div>
          </Col>

          <Col xxl={4} xl={4} lg={4} md={4} sm={6} className='mb-3 mb-md-0'>
            <div className='service-container inprogress'>
              <div className='service-value'>
                <h6>In Progress Services</h6>
                <h3>{counts.inprogress}</h3>
              </div>
              <div className='service-icon'>
                <InprogressIcon />
              </div>
            </div>
          </Col>

          <Col xxl={4} xl={4} lg={4} md={4} sm={6}>
            <div className='service-container total'>
              <div className='service-value'>
                <h6 className='custom-align'>Total Services</h6>
                <h3>{counts.total}</h3>
              </div>
              <div className='service-icon'>
                <CancelIcon />
              </div>
            </div>
          </Col>
        </Row>
      </section >

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  )
}

export default ServiceStatus