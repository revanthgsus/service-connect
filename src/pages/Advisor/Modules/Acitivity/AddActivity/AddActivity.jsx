import React, { useState } from 'react';
import "./AddActivity.css";
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import PreLoader from './../../../../../common/PreLoader/PreLoader';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { IoIosArrowDown } from "react-icons/io";
import { HiPlus } from "react-icons/hi";

const AddActivity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const activityHeading = {
    advisorName: "John Doe",
    serviceId: "SRVC_00005",
  };

  const [steps, setSteps] = useState([
    { label: "Day 1", description: "Premium Exterior Wash...", status: null },
    { label: "Day 2", description: "Clay bar treatment...", status: null },
    { label: "Day 3", description: "Waxing or polishing...", status: null },
    { label: "Day 4", description: "", status: null },
    { label: "Day 5", description: "", status: null },
  ]);

  const [selectedStatuses, setSelectedStatuses] = useState(steps.map(() => ''));
  const [activeStep, setActiveStep] = useState(0);

  const handleBack = (e) => {
    e.preventDefault();
    setLoading(false);
    navigate(-1);
  };

  const handleChange = (index, event) => {
    const newSteps = [...steps];
    newSteps[index].description = event.target.value;
    setSteps(newSteps);
  };

  const handleChangeStatus = (index, event) => {
    const newStatuses = [...selectedStatuses];
    newStatuses[index] = event.target.value;
    setSelectedStatuses(newStatuses);
  };

  const handleUpdate = (index) => {
    const newSteps = [...steps];
    newSteps[index].status = selectedStatuses[index] || null;
    setSteps(newSteps);

    if (index === activeStep && index < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    navigate('/advisor/activity/addquote');
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
            <div className='add-quote-header' onClick={handleAdd}>
              <HiPlus />
              <h5> Add Quote</h5>
            </div>
          </div>

          <div className='activity-top'>
            <p>{activityHeading.advisorName}</p>
            <p>{activityHeading.serviceId}</p>
          </div>
          <div className='activity-status'>
            <Box>
              <Stepper activeStep={activeStep} orientation="vertical" className='stepper-container'>
                {steps.slice(0, activeStep + 1).map((step, index) => (
                  <Step key={index} expanded={true}>
                    <StepLabel>
                      <span>{step.label}</span>
                      {step.status && (
                        <span className={`status ${step.status === 'completed' ? 'completed' : 'inprogress'}`}>
                          {step.status === 'completed' ? 'Completed' : 'In Progress'}
                        </span>
                      )}
                    </StepLabel>
                    <StepContent>
                      <textarea
                        type="text"
                        value={step.description}
                        onChange={(e) => handleChange(index, e)}
                        rows={2}
                        placeholder="Enter description..."
                        className="description-textarea"
                        disabled={step.status !== null}
                      />
                      <div className='status-alignment'>
                        {step.status === null && (
                          <div className="status-wrapper">
                            <div className="select-container">
                              <select
                                name="status"
                                id="status-select"
                                className="status-select"
                                value={selectedStatuses[index]}
                                onChange={(e) => handleChangeStatus(index, e)}
                              >
                                <option value="">Status</option>
                                <option value="completed">Completed</option>
                                <option value="inprogress">In Progress</option>
                              </select>
                              <IoIosArrowDown className="arrow-icon" />
                            </div>
                          </div>
                        )}
                        {step.status === null && (
                          <button type='button' className='update-btn' onClick={() => handleUpdate(index)}>
                            Update
                          </button>
                        )}
                      </div>
                    </StepContent>

                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length && (
                <Paper square elevation={0}>
                  <Typography>Ready to Delivery</Typography>
                </Paper>
              )}
            </Box>
          </div>
        </section>
      )}
    </>
  );
};

export default AddActivity;
