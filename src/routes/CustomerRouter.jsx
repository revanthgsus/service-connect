import React from 'react'
import { Route, Routes } from 'react-router-dom';
import CustomerLayout from './../Layouts/CustomerLayout/CustomerLayout';
import Dashboard from './../pages/Customer/Modules/Dashboard/DashboardContainer/Dashboard';
import AppointmentList from './../pages/Customer/Modules/Appointment/AppointmentList/AppointmentList';
import RequestAppointment from './../pages/Customer/Modules/Appointment/RequestAppointment/RequestAppointment';
import QuoteList from './../pages/Customer/Modules/Quote/QuoteList/QuoteList';
import QuoteSummary from './../pages/Customer/Modules/Quote/QuoteSummary/QuoteSummary';
import ActivityList from './../pages/Customer/Modules/Activity/ActivityList/ActivityList';
import DailyActivity from './../pages/Customer/Modules/Activity/DailyActivity/DailyActivity';
import ViewInvoice from './../pages/Customer/Modules/Invoice/ViewInvoice/ViewInvoice';
import InvoiceList from './../pages/Customer/Modules/Invoice/InvoiceList/InvoiceList';
import PaymentList from '../pages/Customer/Modules/Payments/PaymentList/PaymentList';
import ViewPayment from './../pages/Customer/Modules/Payments/ViewPayment/ViewPayment';

const CustomerRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<CustomerLayout />}>
          <Route path="dashboard">
            <Route index element={<Dashboard />} />
          </Route>

          <Route path='appointments' >
            <Route index element={<AppointmentList />} />
            <Route path='request' element={<RequestAppointment />} />
          </Route>

          <Route path='quotes' >
            <Route index element={<QuoteList />} />
            <Route path='quotesummary' element={<QuoteSummary />} />
          </Route>

          <Route path='activity' >
            <Route index element={<ActivityList />} />
            <Route path='dailyactivity' element={<DailyActivity />} />
          </Route>

          <Route path='invoice' >
            <Route index element={<InvoiceList />} />
            <Route path='viewinvoice' element={<ViewInvoice />} />
          </Route>

          <Route path='payment' >
            <Route index element={<PaymentList />} />
            <Route path='viewpayment' element={<ViewPayment />} />
          </Route>

        </Route>
      </Routes>

    </>
  )
}

export default CustomerRouter;