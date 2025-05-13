import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../components/Auth/LoginPage/LoginPage';
import ForgotPassword from '../components/Auth/ForgotPassword/ForgotPassword';
import GetOtp from '../components/Auth/GetOtp/GetOtp';
import NewPassword from '../components/Auth/NewPassword/NewPassword';
import NotFound from './../common/NotFound/NotFound';

const AuthRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/get-otp" element={<GetOtp />} />
      <Route path="/new-password" element={<NewPassword />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AuthRouter;
