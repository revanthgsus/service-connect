import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './LocationModal.css';
import { Modal } from 'react-bootstrap';
import { CgSearch } from "react-icons/cg";
import { FaLocationArrow } from "react-icons/fa6";
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const libraries = ["places"];

const LocationModal = ({ show, handleClose, onSelectLocation }) => {
  const defaultCenter = useMemo(() => ({ lat: 20.5937, lng: 78.9629 }), []);
  const [location, setLocation] = useState(defaultCenter);
  const [searchInput, setSearchInput] = useState("");
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY || '',
    libraries,
  });

  // get live location lat long for this map api
  const fetchUserLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });

          console.log("Latitude:", lat, "Longitude:", lng);
          getAddressFromCoords(lat, lng);
        },
        (error) => {
          console.error(error.message);
          setLocation(defaultCenter);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      console.log("Geolocation not supported by this browser.")
    }
  }, [defaultCenter]);


  // change address format using Geocoding API
  const getAddressFromCoords = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  };

  useEffect(() => {
    if (show) {
      fetchUserLocation();
    }
  }, [show, fetchUserLocation]);


  // Handle Place Selection
  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLocation({ lat, lng });
        setAddress(place.formatted_address);
      }
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  console.log("Current Location:", location);

  return (
    <>
      <Modal show={show} animation={false} onHide={handleClose} className='location-popup' >
        <Modal.Header className='border-0' closeButton>
          <h5>Preferred Location</h5>
        </Modal.Header>
        <Modal.Body >
          <div className='search-container'>
            <div className='search-field'>
              <CgSearch />
              <input
                type="text"
                placeholder='Search location'
                className='search-input'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onPlaceChanged={handlePlaceChanged} />
            </div>
            <span className='find-icon' onClick={fetchUserLocation}><FaLocationArrow /></span>
          </div>

          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "250px",
              borderRadius: "5px"
            }}
            center={location}
            zoom={10}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}>
            <Marker position={location} />
          </GoogleMap>

          {location && (
            <div>
              <h6>Selected Location:</h6>
              <p>{address || "Fetching address..."}</p>
              <p>Latitude: {location.lat}</p>
              <p>Longitude: {location.lng}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className='border-0'>
          <div className='confirm-action-btn'>
            <button onClick={() => onSelectLocation({ ...location, address })} className='confirm-btn'>
              Confirm Location</button>
          </div>
        </Modal.Footer>
      </Modal >
    </>
  )
}

export default LocationModal;