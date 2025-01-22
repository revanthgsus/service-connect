import React from 'react';
import "../PreLoader/PreLoader.css";
import PulseLoader from 'react-spinners/PulseLoader';

const PreLoader = () => {
  return (
    <>
      <div className='preloader-container'>
        <PulseLoader
          loading={true}
          margin={10}
          size={10}
          speedMultiplier={1}
          color="#007D85"
        />
      </div>
    </>
  )
}

export default PreLoader;