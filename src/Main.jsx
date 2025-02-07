import React from 'react';
import AppRouter from './routes/AppRouter';
import { HashRouter as Router } from 'react-router-dom';

const Main = () => {
  return (
    <Router>
      <AppRouter />
    </Router>
  )
}

export default Main;