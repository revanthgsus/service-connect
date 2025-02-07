import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import MainLayout from '../Layouts/MainLayout/MainLayout';

const CustomerDashboard = lazy(() => import('../pages/Customer/Modules/Dashboard/CustomerDashboard/CustomerDashboard'));
const AppointmentList = lazy(() => import("../pages/Customer/Modules/Appointment/AppointmentList/AppointmentList"));
const RequestAppointment = lazy(() => import("../pages/Customer/Modules/Appointment/RequestAppointment/RequestAppointment"));
const QuoteList = lazy(() => import("../pages/Customer/Modules/Quote/QuoteList/QuoteList"));
const QuoteSummary = lazy(() => import("../pages/Customer/Modules/Quote/QuoteSummary/QuoteSummary"));
const ActivityList = lazy(() => import("../pages/Customer/Modules/Activity/ActivityList/ActivityList"));
const DailyActivity = lazy(() => import("../pages/Customer/Modules/Activity/DailyActivity/DailyActivity"));
const InvoiceList = lazy(() => import("../pages/Customer/Modules/Invoice/InvoiceList/InvoiceList"));
const ViewInvoice = lazy(() => import("../pages/Customer/Modules/Invoice/ViewInvoice/ViewInvoice"));
const PaymentList = lazy(() => import("../pages/Customer/Modules/Payments/PaymentList/PaymentList"));
const ViewPayment = lazy(() => import("../pages/Customer/Modules/Payments/ViewPayment/ViewPayment"));

const CustomerRouter = () => {
  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route path="dashboard">
              <Route index element={<CustomerDashboard />} />
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
      </Suspense>
    </>
  )
}

export default CustomerRouter;