import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-awesome-lightbox/build/style.css";
import Main from './Main';
import ThemeProvider from './common/Theme/ThemeProvider';
import { AuthProvider } from "./hooks/AuthProvider";

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
