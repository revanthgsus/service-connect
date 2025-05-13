import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import API_BASE_URL from '../services/AuthService';
import { useAuth } from '../contexts/AuthContext';
import UPLOAD_FILE_API from '../services/UploadFile';

const useUserProfile = (userId, setUser, setSelectedImage) => {
  const { setShowTokenModal } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  // API Call: Fetch User Profile Details
  const fetchUserProfile = useCallback(async () => {
    const token = sessionStorage.getItem("authToken");

    if (!token || !userId) {
      setShowTokenModal(true);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/userMaster/viewUserById/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

      if (response?.data?.status === "success") {
        setUser(response.data.data);

        const imageId = response.data.imageId;
        if (imageId) {
          const imageUrl = `${UPLOAD_FILE_API}/v1/view/${imageId}`;
          setUser((prev) => ({ ...prev, profileImageUrl: imageUrl }));
          setSelectedImage(imageUrl);
        }

      } else {
        toast.error(response.data.error || 'No profile details found.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, setUser, setShowTokenModal, setSelectedImage]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUserProfile();
      hasFetched.current = true;
    }
  }, [fetchUserProfile]);

  return { isLoading };
};

export default useUserProfile;