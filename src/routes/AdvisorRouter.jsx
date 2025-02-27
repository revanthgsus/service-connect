import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PreLoader from '../common/PreLoader/PreLoader';
import MainLayout from '../Layouts/MainLayout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

const AdvisorDashboard = lazy(() => import('../pages/Advisor/Modules/Dashboard/AdvisorDashboard/AdvisorDashboard'));
const Reviews = lazy(() => import('../pages/Advisor/Modules/Reviews/Reviews'));

const AppointmentList = lazy(() => import('../pages/Advisor/Modules/Appointment/AppointmentsList/AppointmentsList'));
const ManageAppointment = lazy(() => import("../pages/Advisor/Modules/Appointment/ManageAppointment/ManageAppointment"));

const SendQuote = lazy(() => import("../pages/Advisor/Modules/Appointment/SendQuote/SendQuote"));
const QuotesList = lazy(() => import("../pages/Advisor/Modules/Quotes/QuotesList/QuotesList"));
const InitialQuote = lazy(() => import("../pages/Advisor/Modules/Quotes/InitialQuote/InitialQuote"));

const ActivityList = lazy(() => import("../pages/Advisor/Modules/Acitivity/ActivityLists/ActivityLists"));
const AddActivity = lazy(() => import("../pages/Advisor/Modules/Acitivity/AddActivity/AddActivity"));
const AddQuote = lazy(() => import("../pages/Advisor/Modules/Acitivity/AddQuote/AddQuote"));

const InvoiceLists = lazy(() => import("../pages/Advisor/Modules/Invoice/InvoiceLists/InvoiceLists"));
const CreateInvoice = lazy(() => import("../pages/Advisor/Modules/Invoice/CreateInvoice/CreateInvoice"));
const ViewInvoice = lazy(() => import("../pages/Advisor/Modules/Invoice/ViewInvoice/ViewInvoice"));

const TransactionList = lazy(() => import("../pages/Advisor/Modules/TransactionList/TransactionList"));
const AdvisorProfile = lazy(() => import("../pages/Advisor/Comman/AdvisorProfile/AdvisorProfile"));

const AdvisorRouter = () => {
  return (
    <>
      <Suspense fallback={<PreLoader />}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["Advisor"]} />}>
            <Route path='/' element={<MainLayout />}>
              <Route path="dashboard">
                <Route index element={<AdvisorDashboard />} />
                <Route path='ratings' element={<Reviews />} />
              </Route>

              <Route path='appointments' >
                <Route index element={<AppointmentList />} />
                <Route path='view' element={<ManageAppointment />} />
                <Route path='quote' element={<SendQuote />} />
              </Route>

              <Route path='quotes' >
                <Route index element={<QuotesList />} />
                <Route path='view' element={<InitialQuote />} />
              </Route>

              <Route path='activity' >
                <Route index element={<ActivityList />} />
                <Route path='addactivity' element={<AddActivity />} />
                <Route path='addquote' element={<AddQuote />} />
              </Route>

              <Route path='invoice' >
                <Route index element={<InvoiceLists />} />
                <Route path='generate' element={<CreateInvoice />} />
                <Route path='viewinvoice' element={<ViewInvoice />} />
              </Route>

              <Route path='transaction' >
                <Route index element={<TransactionList />} />
              </Route>

              <Route path="profile" element={<AdvisorProfile />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default AdvisorRouter;