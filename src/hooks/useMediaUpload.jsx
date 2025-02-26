import { useCallback, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UPLOAD_FILE_API from '../services/UploadFile';

const useMediaUpload = (userId, setCustomer) => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const token = localStorage.getItem("authToken");

  const handleSessionExpiration = useCallback(() => {
    toast.error('Session expired. Please sign in again.', { autoClose: 2000 });
    setTimeout(() => navigate('/'), 2000);
  }, [navigate]);


  // API Call : view Profile Image
  const viewMedia = useCallback(async () => {
    if (!token || !userId) return handleSessionExpiration();

    try {
      const mediaResponse = await axios.get(`${UPLOAD_FILE_API}/advisorMaster/viewMediaFile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (mediaResponse?.data?.profileImageUrl) {
        setCustomer((prev) => ({ ...prev, profileImageUrl: mediaResponse.data.profileImageUrl }));
      }
      else {
        toast.error("Profile image not found.");
      }
    } catch (mediaError) {
      console.error('Failed to fetch media file:', mediaError);
      toast.error('Failed to fetch media file');
    }
  }, [userId, token, setCustomer, handleSessionExpiration]);


  // API Call: Upload Profile Image
  const uploadMediaFile = useCallback(async (file, setSelectedImage) => {
    if (!file) return toast.error('Please select a file to upload.');
    if (!token || !userId) return handleSessionExpiration();

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const response = await axios.post(`${UPLOAD_FILE_API}/advisorMaster/uploadMediaFile/${userId}`, formData, {
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
      setUploadError(error);
    } finally {
      setIsUploading(false);
    }
  }, [userId, token, setCustomer, handleSessionExpiration]);

  return { isUploading, uploadError, uploadMediaFile, viewMedia };
}

export default useMediaUpload