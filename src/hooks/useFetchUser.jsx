import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchUser = (userName) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const USER_URL = `/users/${userName}`;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(USER_URL, {
          signal: controller.signal,
        });
        if (isMounted) {
          setUser(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response ? err.response.data.message : err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [userName]);
  return { user, isLoading, error };
};

export default useFetchUser;
