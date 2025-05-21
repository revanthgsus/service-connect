import { useCallback, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import UPLOAD_FILE_API from '../services/UploadFile';
import API_BASE_URL from '../services/AuthService';

const useMediaUpload = (userId, setUser, setSelectedImage) => {
  const { setShowTokenModal } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  

  // API Call: Upload Profile Image
  const uploadMediaFile = useCallback(async (file) => {
    const token = sessionStorage.getItem("authToken");
    if (!token || !userId) {
      setShowTokenModal(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      // step 1
      const uploadResponse = await axios.post(`${UPLOAD_FILE_API}/v1/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fileName = uploadResponse?.data?.fileName || file.name;

      if (uploadResponse.status !== 200) {
        toast.error('Image upload failed.');
        return;
      }

      // step 2
      const updateResponse = await axios.put(`${API_BASE_URL}/userMaster/updateImageId/${userId}/${fileName}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (updateResponse?.data?.status === "success") {

        const imageUrl = `${UPLOAD_FILE_API}/v1/view/${fileName}`;
        setUser((prev) => ({ ...prev, profileImageUrl: imageUrl }));
        setSelectedImage(imageUrl);
        toast.success('Profile picture updated successfully.');
        return imageUrl;
      } else {
        toast.error('Failed to upload profile picture.');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong. Please try again later.");
    } finally {
      setIsUploading(false);
    }

  }, [userId, setUser, setShowTokenModal, setSelectedImage]);


  return { isUploading, uploadMediaFile };
}

export default useMediaUpload;