import React from 'react'
import { Route, Routes } from 'react-router-dom';
import CustomerLayout from './../Layouts/CustomerLayout/CustomerLayout';

const CustomerRouter = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<CustomerLayout />}>
          <Route path='dashboard'>

          </Route>

        </Route>

      </Routes>

    </>
  )
}

export default CustomerRouter;