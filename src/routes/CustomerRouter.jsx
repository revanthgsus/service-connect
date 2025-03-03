import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import MainLayout from '../Layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../common/NotFound/NotFound';

const CustomerDashboard = lazy(() => import('../pages/Customer/Modules/Dashboard/CustomerDashboard/CustomerDashboard'));

const AppointmentList = lazy(() => import("../pages/Customer/Modules/Appointment/AppointmentList/AppointmentList"));
const RequestAppointment = lazy(() => import("../pages/Customer/Modules/Appointment/RequestAppointment/RequestAppointment"));
const ViewAppointment = lazy(() => import("../pages/Customer/Modules/Appointment/ViewAppointment/ViewAppointment"));

const QuoteList = lazy(() => import("../pages/Customer/Modules/Quote/QuoteList/QuoteList"));
const QuoteSummary = lazy(() => import("../pages/Customer/Modules/Quote/QuoteSummary/QuoteSummary"));
const AdditionalQuote = lazy(() => import("../pages/Customer/Modules/Quote/AdditionalQuote/AdditionalQuote"));

const ActivityList = lazy(() => import("../pages/Customer/Modules/Activity/ActivityList/ActivityList"));
const DailyActivity = lazy(() => import("../pages/Customer/Modules/Activity/DailyActivity/DailyActivity"));

const InvoiceList = lazy(() => import("../pages/Customer/Modules/Invoice/InvoiceList/InvoiceList"));
const ViewInvoice = lazy(() => import("../pages/Customer/Modules/Invoice/ViewInvoice/ViewInvoice"));

const TransactionList = lazy(() => import("../pages/Advisor/Modules/TransactionList/TransactionList"));
const CustomerProfile = lazy(() => import("../pages/Customer/Common/CustomerProfile/CustomerProfile"));

const CustomerRouter = () => {
  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["Customer"]} />}>
            <Route path='/' element={<MainLayout />}>
              <Route path="dashboard">
                <Route index element={<CustomerDashboard />} />
              </Route>

              <Route path='appointments' >
                <Route index element={<AppointmentList />} />
                <Route path='request' element={<RequestAppointment />} />
                <Route path='View' element={<ViewAppointment />} />
              </Route>

              <Route path='quotes' >
                <Route index element={<QuoteList />} />
                <Route path='quotesummary' element={<QuoteSummary />} />
                <Route path='additionalquote' element={<AdditionalQuote />} />
              </Route>

              <Route path='activity' >
                <Route index element={<ActivityList />} />
                <Route path='dailyactivity' element={<DailyActivity />} />
              </Route>

              <Route path='invoice' >
                <Route index element={<InvoiceList />} />
                <Route path='viewinvoice' element={<ViewInvoice />} />
              </Route>

              <Route path='transaction' >
                <Route index element={<TransactionList />} />
              </Route>

              <Route path="profile" element={<CustomerProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default CustomerRouter;