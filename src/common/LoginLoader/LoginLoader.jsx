import React from 'react';
import "./LoginLoader.css";
import MoonLoader from 'react-spinners/MoonLoader';

const LoginLoader = () => {
  return (
    <>
      <div className='loginloader-container'>
        <MoonLoader
          loading={true}
          margin={10}
          size={15}
          speedMultiplier={1}
          color="#007D85"
        />
      </div>
    </>
  )
}

export default LoginLoader