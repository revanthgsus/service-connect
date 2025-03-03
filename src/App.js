import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './Main';
import ThemeProvider from './common/Theme/ThemeProvider';
import { AuthProvider } from "./hooks/AuthProvider";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
