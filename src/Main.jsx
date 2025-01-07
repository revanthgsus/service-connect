import React from 'react';
import AppRouter from './routes/AppRouter';
import { BrowserRouter as Router } from 'react-router-dom';

const Main = () => {
  return (
    <>
      <Router>
        <AppRouter />
      </Router>
    </>
  )
}

export default Main;