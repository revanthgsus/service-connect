import { useCallback, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE_URL from '../services/AuthService';

const usePasswordUpdate = (userId) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = sessionStorage.getItem("authToken");

  const handleSessionExpiration = useCallback(() => {
    toast.error('Session expired. Please sign in again.', { autoClose: 2000 });
    setTimeout(() => navigate('/'), 2000);
  }, [navigate]);

  // API Call: Update Password
  const updatePassword = async (currentPassword, newPassword, confirmPassword) => {
    if (!token || !userId) return handleSessionExpiration();

    const payload = {
      confirmPassword,
      currentPassword,
      newPassword,
      userId: userId,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/email/viewProfileChangePassword`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      if (response?.data?.status === "success") {
        toast.success("Password updated successfully.");
      } else {
        toast.error(response?.data?.error || "Failed to update password.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to update password.");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, updatePassword };
}

export default usePasswordUpdate;