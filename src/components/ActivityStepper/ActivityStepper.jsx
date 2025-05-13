import React, { useEffect, useState } from 'react';
import "./ActivityStepper.css";
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import PreLoader from '../../common/PreLoader/PreLoader';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { IoIosArrowDown } from "react-icons/io";
import { HiPlus } from "react-icons/hi";
import { useAuth } from '../../contexts/AuthContext';
import API_BASE_URL from '../../services/AuthService';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const ActivityStepper = () => {
  const navigate = useNavigate();
  const { setShowTokenModal, user } = useAuth();
  const location = useLocation();
  const { activityData } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [isDeliveryDisabled, setIsDeliveryDisabled] = useState(false);

  const isCompleted = activityData?.data?.serviceStatus === 'Completed';

  const activityHeading = {
    userName: user?.role === 'Advisor'
      ? activityData?.data?.customerName || 'Customer Name'
      : activityData?.data?.advisorName || 'Advisor Name',
    serviceId: activityData?.data?.serviceId || 'Service ID',
  };

  // get current date on component mount
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    setCurrentDate(today);
  }, [activityData]);


  useEffect(() => {
    const fetchActivity = async () => {
      const serviceId = activityData?.data?.serviceId;

      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setShowTokenModal(true);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/advisorMaster/viewActivitiesByServiceId/${serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        if (response?.data?.status === "success") {
          const activityList = response.data?.data?.activities || [];

          const updatedSteps = activityList.map((step, idx) => ({
            label: `Day ${idx + 1}`,
            description: step.description || "",
            status: step.status || null,
          }));

          if (user?.role === "Advisor" && activityData?.data?.serviceStatus !== "Completed") {
            updatedSteps.push({
              label: `Day ${updatedSteps.length + 1}`,
              description: "",
              status: null,
            });
          }

          setSteps(updatedSteps);
          setSelectedStatus(updatedSteps.map((s) => s.status || ""));

          const firstStepIndex = updatedSteps.findIndex(step => step.status === null);
          setActiveStep(firstStepIndex !== -1 ? firstStepIndex : updatedSteps.length - 1);

        } else {
          toast.error(response?.data?.message || "Unable to fetch activity data.");
        }
      } catch {
        setLoading(true);
        toast.error("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchActivity();
  }, [setShowTokenModal, activityData, user]);


  const handleUpdate = async (index) => {
    const description = steps[index]?.description;
    const status = selectedStatus[index];

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    if (!description?.trim()) {
      toast.error("Please provide description");
      return;
    }

    if (!status) {
      toast.error("Please select a status");
      return;
    }

    const payload = {
      day: steps[index]?.label,
      description: description,
      status: status,
      activityDate: currentDate,
      advisorId: activityData?.data?.advisorId,
      customerName: activityData?.data?.customerName,
      serviceId: activityData?.data?.serviceId,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/advisorMaster/addServiceActivity`,
        payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response?.data?.status === "success") {
        handleSuccessUpdate(index, status);
      } else {
        toast.error(response?.data?.message || "Unable to update activity.");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessUpdate = (index, status) => {
    const updatedSteps = [...steps];
    updatedSteps[index].status = status;

    updatedSteps.push({
      label: `Day ${updatedSteps.length + 1}`,
      description: "",
      status: null,
      readonly: false,
    });

    setSteps(updatedSteps);
    setSelectedStatus(prev => [...prev, ""]);
    setActiveStep(index + 1);
  };

  const handleChangeDescription = (index, event) => {
    const updatedSteps = [...steps];
    updatedSteps[index].description = event.target.value;
    setSteps(updatedSteps);
  };

  const handleChangeStatus = (index, event) => {
    const updateStatus = [...selectedStatus];
    updateStatus[index] = event.target.value;
    setSelectedStatus(updateStatus);
  };

  const handleBack = () => { navigate(-1) };
  const handleAdd = (e) => {
    e.preventDefault();
    navigate('/advisor/activity/addquote', { state: { activityData } });
  };


  const handleDelivery = async () => {
    const serviceId = activityData?.data?.serviceId;
    const status = "Completed";

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/advisorMaster/readyToDelivery/${serviceId}/${status}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data?.status === "success") {
        toast.success("Ready to delivery successfully!");
        setIsDeliveryDisabled(true);
        setTimeout(() => { navigate("/advisor/activity") }, 1000);
      } else {
        toast.error(response?.data?.message || "Failed to update delivery status.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className='activity-container'>
          <div className='heading-container'>
            <div className="activity-header">
              <IoMdArrowRoundBack onClick={handleBack} />
              <h5>Service Activity</h5>
            </div>

            {user?.role === "Advisor" && !isCompleted && (
              <div className='add-quote-header' onClick={handleAdd}>
                <HiPlus />
                <h5> Add Quote</h5>
              </div>
            )}
          </div>

          {/* activity top aligmennt */}
          <div className='activity-top'>
            <p>{activityHeading.userName}</p>
            <p>{activityHeading.serviceId}</p>
          </div>

          <div className='activity-status'>
            <Box>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((step, index) => (
                  <Step key={index} expanded={true}>
                    <StepLabel>
                      <div className='step-label'>
                        <span>{step.label}</span>
                        <span className='date-label'>{currentDate} </span>
                      </div>

                      {step.status && (
                        <span className={`status 
                        ${step.status === 'completed' ? 'completed' : 'inprogress'}`}>
                          {step.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      )}
                    </StepLabel>

                    <StepContent>
                      {user?.role === "Advisor" && step.status === null && !isCompleted ? (
                        <textarea
                          type="text"
                          value={step.description}
                          onChange={(e) => handleChangeDescription(index, e)}
                          rows={2}
                          placeholder="Enter description..."
                          className="description-textarea"
                        />
                      ) : (
                        <span className="description-text">
                          {step.description}</span>
                      )}

                      {user?.role === "Advisor" && step.status === null && !isCompleted && (
                        <div className='status-alignment'>
                          <div className="status-wrapper">
                            <div className="select-container">
                              <select
                                name="status"
                                id="status-select"
                                className="status-select"
                                value={selectedStatus[index]}
                                onChange={(e) => handleChangeStatus(index, e)}>
                                <option value="" >Status</option>
                                <option value="completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                              </select>
                              <IoIosArrowDown className="arrow-icon" />
                            </div>
                          </div>
                          <button
                            type='button'
                            className='update-btn'
                            onClick={() => handleUpdate(index)}>Update</button>
                        </div>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              <div className='delivery-btn-container'>
                {steps.length > 1 && user?.role === "Advisor" && !isCompleted && (
                  <button type='button'
                    className='delivery-button'
                    onClick={handleDelivery}
                    disabled={isDeliveryDisabled}>
                    {isDeliveryDisabled ? "Marked as Delivered" : "Ready to Delivery"}</button>
                )}
              </div>
            </Box>
          </div>
        </section >
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

export default ActivityStepper;
