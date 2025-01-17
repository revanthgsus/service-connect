import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from './Main';
import ThemeProvider from './common/Theme/ThemeProvider';
import ThemeSetter from './common/Theme/ThemeSetter';

function App() {
  return (
    <ThemeProvider>
      <ThemeSetter />
      <Main />
    </ThemeProvider>
  );
}

export default App;
