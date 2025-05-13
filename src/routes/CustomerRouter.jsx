import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import MainLayout from '../Layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../common/NotFound/NotFound';

const CustomerDashboard = lazy(() => import('../pages/Customer/Modules/Dashboard/CustomerDashboard/CustomerDashboard'));
const AllNotification = lazy(() => import('../components/AllNotification/AllNotification'));

const AppointmentList = lazy(() => import("../pages/Customer/Modules/Appointment/CustomerAppointment/CustomerAppointment"));
const RequestAppointment = lazy(() => import("../pages/Customer/Modules/Appointment/RequestAppointment/RequestAppointment"));
const ViewAppointment = lazy(() => import("../pages/Customer/Modules/Appointment/ViewAppointment/ViewAppointment"));

const ServiceHistory = lazy(() => import("../pages/Customer/Modules/Appointment/ServiceHistory/ServiceHistory"));
const HistoryDetails = lazy(() => import("../pages/Customer/Modules/Appointment/HistoryDetails/HistoryDetails"));

const QuotesList = lazy(() => import("../pages/Customer/Modules/Quote/CustomerQuotes/CustomerQuotes"));
const CustomerQuoteSummary = lazy(() => import("../pages/Customer/Modules/Quote/CustomerQuoteSummary/CustomerQuoteSummary"));
const AdditionalQuote = lazy(() => import("../pages/Customer/Modules/Quote/AdditionalQuote/AdditionalQuote"));

const ActivityList = lazy(() => import("../pages/Customer/Modules/Activity/CustomerActivity/CustomerActivity"));
const DailyActivity = lazy(() => import("../components/ActivityStepper/ActivityStepper"));

const InvoiceList = lazy(() => import("../pages/Customer/Modules/Invoice/CustomerInvoice/CustomerInvoice"));
const ViewInvoice = lazy(() => import("../pages/Advisor/Modules/Invoice/ViewInvoice/ViewInvoice"));

const TransactionList = lazy(() => import("../pages/Customer/Modules/CustomerTransaction/CustomerTransaction"));
const UserProfile = lazy(() => import("../components/UserProfile/UserProfile"));

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
                <Route path='view' element={<ViewAppointment />} />
                <Route path='history' element={<ServiceHistory />} />
                <Route path='servicehistory' element={<HistoryDetails />} />
              </Route>

              <Route path='quotes' >
                <Route index element={<QuotesList />} />
                <Route path='quotesummary' element={<CustomerQuoteSummary />} />
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

              <Route path='notifications' element={<AllNotification />} />

              <Route path="profile" element={<UserProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default CustomerRouter;