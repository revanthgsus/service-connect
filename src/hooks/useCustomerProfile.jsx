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

  const fetchCustomerProfile = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !customerId) {
      toast.error("Session expired. Please sign in again.", { autoClose: 2000, });
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/customerMaster/viewCustomerById/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (response?.data) {
        setCustomer(response.data);
      } else {
        toast.error("No data found.");
      }
    } catch (error) {
      toast.error("Failed to fetch customer profile.");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [customerId, navigate])

  useEffect(() => {
    if (!hasFetched.current) {
      fetchCustomerProfile();
      hasFetched.current = true;
    }
  }, [fetchCustomerProfile]);

  const uploadMediaFile = async (file, setSelectedImage) => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token || !customerId) {
      toast.error("Session expired. Please sign in again.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log('File:', file);
      console.log('Form Data:', formData);

      const response = await axios.post(`${UPLOAD_FILE_API}/advisorMaster/uploadMediaFile/${customerId}`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

      console.log("Upload Response:", response);

      if (response?.data?.profileImageUrl) {
        setCustomer((prev) => ({ ...prev, profileImageUrl: response.data.profileImageUrl }));
        setSelectedImage(response.data.profileImageUrl);
        toast.success("Profile picture updated successfully.");
      }
      else {
        toast.error("Failed to update profile picture.");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error(error?.response?.data || "Failed to upload profile picture.");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
    const token = localStorage.getItem("authToken");
    if (!token || !customerId) {
      toast.error("Session expired. Please sign in again.", { autoClose: 2000 });
      setTimeout(() => navigate("/"), 2000);
      return;
    }

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