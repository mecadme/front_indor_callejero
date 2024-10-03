import { useState } from "react";
import axios from "../api/axios";
import useAxiosPrivate from "./useAxiosPrivate";

const useAPI = (axiosType = "public") => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const axiosInstance = axiosType === "private" ? axiosPrivate : axios;

  const fetchData = async (method, url, body = null) => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const response = await axiosInstance(
        {
          method,
          url,
          data: body,
        },
        { signal: controller.signal }
      );
      setData(response.data);
    } catch (err) {
      if (err.name !== "CanceledError") {
        setError(err);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort(); // Abortar si se desmonta
  };

  return { data, error, loading, fetchData };
};

export default useAPI;
