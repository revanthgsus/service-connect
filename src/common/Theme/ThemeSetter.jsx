import React, { useContext, useState, useEffect } from 'react';
import { BsSunFill } from 'react-icons/bs';
import { WiMoonAltWaningCrescent3 } from 'react-icons/wi';
import { ThemeContext } from './ThemeProvider';

const ThemeSetter = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [checked, setChecked] = useState(theme === 'dark');

  useEffect(() => {
    setChecked(theme === 'dark');
  }, [theme]);

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <div className="theme-toggle">
      {/* <label className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          aria-label="Toggle Theme"
        />
        <span className="slider">
          {checked ? <WiMoonAltWaningCrescent3 /> : <BsSunFill />}
        </span>
      </label> */}
    </div>
  );
};

export default ThemeSetter;
