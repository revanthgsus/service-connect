import React, { useEffect, useState, } from 'react';
import ThemeContext from '../../contexts/ThemeContext';

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedtheme = sessionStorage.getItem('theme');
    if (savedtheme) {
      setTheme(savedtheme)
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevtheme) => (prevtheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className={`theme--${theme}`}>{children}</div>
      </ThemeContext.Provider>
    </>
  )
}

export default ThemeProvider