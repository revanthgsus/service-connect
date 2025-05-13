import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import MainLayout from '../Layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../common/NotFound/NotFound';

const AdvisorDashboard = lazy(() => import('../pages/Advisor/Modules/Dashboard/AdvisorDashboard/AdvisorDashboard'));
const Reviews = lazy(() => import('../pages/Advisor/Modules/Reviews/Reviews'));
const AllNotification = lazy(() => import('../components/AllNotification/AllNotification'));

const AppointmentList = lazy(() => import("../pages/Advisor/Modules/Appointment/AdvisorAppointment/AdvisorAppointment"));
const ManageAppointment = lazy(() => import("../pages/Advisor/Modules/Appointment/ManageAppointment/ManageAppointment"));

const ServiceHistory = lazy(() => import("../pages/Customer/Modules/Appointment/ServiceHistory/ServiceHistory"));
const HistoryDetails = lazy(() => import("../pages/Customer/Modules/Appointment/HistoryDetails/HistoryDetails"));

const SendQuote = lazy(() => import("../pages/Advisor/Modules/Appointment/SendQuote/SendQuote"));
const QuotesList = lazy(() => import("../pages/Advisor/Modules/Quotes/AdvisorQuotes/AdvisorQuotes"));
const UpdateQuotes = lazy(() => import("../pages/Advisor/Modules/Quotes/UpdateQuotes/UpdateQuotes"));
const AdvisorQuoteSummary = lazy(() => import("../pages/Advisor/Modules/Quotes/AdvisorQuoteSummary/AdvisorQuoteSummary"));

const ActivityList = lazy(() => import("../pages/Advisor/Modules/Acitivity/AdvisorActivity/AdvisorActivity"));
const DailyActivtiy = lazy(() => import("../components/ActivityStepper/ActivityStepper"));
const AddQuote = lazy(() => import("../pages/Advisor/Modules/Acitivity/AddQuote/AddQuote"));

const InvoiceList = lazy(() => import("../pages/Advisor/Modules/Invoice/AdvisorInvoice/AdvisorInvoice"));
const GenerateInvoice = lazy(() => import("../pages/Advisor/Modules/Invoice/GenerateInvoice/GenerateInvoice"));
const ViewInvoice = lazy(() => import("../pages/Advisor/Modules/Invoice/ViewInvoice/ViewInvoice"));

const TransactionList = lazy(() => import("../pages/Advisor/Modules/AdvisorTransaction/AdvisorTransaction"));
const UserProfile = lazy(() => import("../components/UserProfile/UserProfile"));


const AdvisorRouter = () => {
  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["Advisor"]} />}>
            <Route path='/' element={<MainLayout />}>
              <Route path="dashboard">
                <Route index element={<AdvisorDashboard />} />
                <Route path='reviews' element={<Reviews />} />
              </Route>

              <Route path='appointments' >
                <Route index element={<AppointmentList />} />
                <Route path='view' element={<ManageAppointment />} />
                <Route path='quote' element={<SendQuote />} />
                <Route path='history' element={<ServiceHistory />} />
                <Route path='servicehistory' element={<HistoryDetails />} />
              </Route>

              <Route path='quotes' >
                <Route index element={<QuotesList />} />
                <Route path='updatequotes' element={<UpdateQuotes />} />
                <Route path='quotesummary' element={<AdvisorQuoteSummary />} />
              </Route>

              <Route path='activity' >
                <Route index element={<ActivityList />} />
                <Route path='dailyactivity' element={<DailyActivtiy />} />
                <Route path='addquote' element={<AddQuote />} />
              </Route>

              <Route path='invoice' >
                <Route index element={<InvoiceList />} />
                <Route path='generate' element={<GenerateInvoice />} />
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

export default AdvisorRouter;