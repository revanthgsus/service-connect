import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from '../services/AuthService';

const useCustomerProfile = (userId, setCustomer) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const token = localStorage.getItem("authToken");

  const handleSessionExpiration = useCallback(() => {
    toast.error('Session expired. Please sign in again.', { autoClose: 2000 });
    setTimeout(() => navigate('/'), 2000);
  }, [navigate]);

  // API Call: Fetch Customer Profile Details
  const fetchCustomerProfile = useCallback(async () => {
    if (!token || !userId) return handleSessionExpiration();

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewCustomerById/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response?.data) {
        setCustomer(response.data);
      } else {
        toast.error('No data found.');
      }
    } catch (error) {
      toast.error("Failed to fetch customer profile.");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, token, handleSessionExpiration, setCustomer])

  useEffect(() => {
    if (!hasFetched.current) {
      fetchCustomerProfile();
      hasFetched.current = true;
    }
  }, [fetchCustomerProfile]);

  return { isLoading, error };
};

export default useCustomerProfile;