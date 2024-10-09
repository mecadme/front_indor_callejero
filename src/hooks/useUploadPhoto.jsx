import { useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useUploadPhoto = (entity, endpointUrl) => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const uploadPhoto = async (file) => {
    setLoading(true);
    setError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append(entity.key, entity.value); 
    formData.append("file", file);

    try {
      const response = await axiosPrivate.put(endpointUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess(response.data); 
    } catch (err) {
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  return { uploadPhoto, loading, error, uploadSuccess };
};

export default useUploadPhoto;
