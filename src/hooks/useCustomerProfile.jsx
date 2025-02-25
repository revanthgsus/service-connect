import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from '../services/AuthService';
import UPLOAD_FILE_API from '../services/UploadFile';

const useCustomerProfile = (customerId) => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  const token = localStorage.getItem("authToken");
  const handleSessionExpiration = useCallback(() => {
    toast.error('Session expired. Please sign in again.', { autoClose: 2000 });
    setTimeout(() => navigate('/'), 2000);
  }, [navigate]);

  // API Call: Fetch Customer Profile
  const fetchCustomerProfile = useCallback(async () => {
    if (!token || !customerId) return handleSessionExpiration();

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewCustomerById/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response?.data) {
        let customerData = response.data;

        try {
          const mediaResponse = await axios.get(`${UPLOAD_FILE_API}/advisorMaster/viewMediaFile/${customerId}`);
          if (mediaResponse?.data) {
            customerData.profileImageUrl = mediaResponse.data;
          }
        } catch (mediaError) {
          console.warn('Failed to fetch media file:', mediaError);
        }
        setCustomer(customerData);
      } else {
        toast.error('No data found.');
      }
    } catch (error) {
      toast.error("Failed to fetch customer profile.");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [customerId, token, handleSessionExpiration])

  useEffect(() => {
    if (!hasFetched.current) {
      fetchCustomerProfile();
      hasFetched.current = true;
    }
  }, [fetchCustomerProfile]);

  // API Call: Upload Profile Image
  const uploadMediaFile = async (file, setSelectedImage) => {
    if (!file) return toast.error('Please select a file to upload.');
    if (!token || !customerId) return handleSessionExpiration();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${UPLOAD_FILE_API}/advisorMaster/uploadMediaFile/${customerId}`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

      if (response?.data?.profileImageUrl) {
        setCustomer((prev) => ({ ...prev, profileImageUrl: response.data.profileImageUrl }));
        setSelectedImage(response.data.profileImageUrl);
        toast.success("Profile picture updated successfully.");
      } else {
        toast.error("Failed to update profile picture.");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error(error?.response?.data?.message || "Failed to upload profile picture.");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  // API Call: Update Password
  const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
    if (!token || !customerId) return handleSessionExpiration();

    const payload = {
      confirmPassword,
      currentPassword,
      newPassword,
      userId: customerId,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/email/viewProfileChangePassword`,
        payload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response?.data?.status === "success") {
        toast.success("Password updated successfully.");
      } else {
        toast.error(response?.data?.message || "Failed to update password.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password.");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { customer, isLoading, error, uploadMediaFile, updatePassword };

};

export default useCustomerProfile;