import React, { useState } from 'react';
import "./DailyActivity.css";
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

const DailyActivity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const activityHeading = {
    advisorName: "John Doe",
    serviceId: "SRVC_00005",
  };

  const steps = [
    {
      label: "Day 1",
      description: "Premium Exterior Wash: We use high-quality, eco-friendly car wash soaps to remove dirt, grime, and environmental contaminants. This thorough wash ensures a clean and smooth surface.",
      status: "Completed",
    },
    {
      label: "Day 2",
      description: "Clay bar treatment for a smooth finish and removal of contaminants.",
      status: "Completed",
    },
    {
      label: "Day 3",
      description: "Waxing or polishing to protect and shine the car’s surface.",
      status: "In Progress",
    },
    {
      label: "Day 4",
      description: "",
      status: null,
    },
    {
      label: "Day 5",
      description: "",
      status: null,
    },
  ]

  const activeStep = 2

  const handleBack = (e) => {
    e.preventDefault();
    setLoading(false);
    navigate(-1);
  };

  return (
    <>
      {loading ? (<PreLoader />
      ) : (
        <section className='activity-container'>
          <div className="activity-header">
            <IoMdArrowRoundBack onClick={handleBack} />
            <h5>Service Activity</h5>
          </div>
          <div className='activity-top'>
            <p>{activityHeading.advisorName}</p>
            <p>{activityHeading.serviceId}</p>
          </div>
          <div className='activity-status'>
            <Box>
              <Stepper activeStep={activeStep} orientation="vertical" className='stepper-container'>
                {steps.map((step, index) => (
                  <Step key={index} expanded={true}>
                    <StepLabel>
                      <span>{step.label}</span>
                      {step.status && (
                        <span className={`status ${step.status === 'Completed' ? 'completed' : 'inprogress'}`}>
                          {step.status}
                        </span>
                      )}
                    </StepLabel>
                    <StepContent>{step.description}</StepContent>
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
        </section >
      )}
    </>
  )
}
export default DailyActivity;
