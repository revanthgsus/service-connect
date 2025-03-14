import React, { useEffect, useState } from 'react';
import './LocationModal.css';
import { Modal } from 'react-bootstrap';
import { CgSearch } from "react-icons/cg";
import { FaLocationArrow } from "react-icons/fa6";
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const LocationModal = ({ show, handleClose }) => {
  const defaultCenter = { lat: 20.5937, lng: 78.9629 };
  const [location, setLocation] = useState(defaultCenter);
  // const [address, setAddress] = useState('');

  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  const containerStyle = {
    width: "100%",
    height: "300px",
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });

          console.log("Latitude:", lat, "Longitude:", lng);
        },
        (error) => console.error(error.message),
        { enableHighAccuracy: true }
      );
    }
  }, [])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY || '',
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <>
      <Modal show={show} animation={false} onHide={handleClose} className='location-popup' >
        <Modal.Header className='border-0' closeButton>
          <h5>Preferred Location</h5>
        </Modal.Header>
        <Modal.Body >
          <div className='search-container'>
            <div className='search-field'><CgSearch />
              <input type="text" placeholder='Search location' className='search-input' />
            </div>
            <span className='find-icon'><FaLocationArrow /></span>
          </div>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={10}>
            <Marker position={location} />
          </GoogleMap>
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <div className='confirm-action-btn'>
            <button onClick={handleClose} className='confirm-btn'>Confirm</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default LocationModal;