import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider from './common/Theme/ThemeProvider';
import { AuthProvider } from "./hooks/AuthProvider";
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
