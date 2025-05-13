import React, { useEffect, useRef, useState } from 'react';
import "./ComplaintDetails.css";
import { MdKeyboardVoice } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import { IoClose } from 'react-icons/io5';

const ComplaintDetails = ({ selectedAdvisor, onUpdate }) => {
  const [complaints, setComplaints] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (selectedAdvisor) {
      onUpdate({
        complaintDescription: debouncedSearch,
      });
    }
  }, [debouncedSearch, selectedAdvisor, onUpdate]);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(complaints);
    }, 500);
    return () => clearTimeout(handler);
  }, [complaints]);


  // speech recognition functionality
  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech Recognition is not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setComplaints(prev => prev + ' ' + speechToText);
    };

    recognition.onerror = (event) => {
      toast.error(event.error);
      stopRecognition();
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart if user hasn't manually stopped
      } else {
        setIsListening(false); // Update UI if recognition ended naturally
      }
    };

    return recognition;
  };

  const startRecognition = () => {
    const recognition = initRecognition();
    if (recognition) {
      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleRecognition = () => {
    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  return (
    <>
      {selectedAdvisor && (
        <div className='mt-4 complaint-section'>
          <h5 className="complaint-heading">Complaint Description</h5>
          <div className='complaint-item'>
            <textarea
              placeholder='Enter complaint description'
              type="text"
              rows={5}
              className="form-control"
              value={complaints}
              onChange={(e) => setComplaints(e.target.value)}
            />

            <span className='speech-icon' onClick={toggleRecognition}>
              {isListening ? <IoClose /> : <MdKeyboardVoice />}
            </span>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        theme="light"
      />
    </>
  );
}

export default ComplaintDetails;
