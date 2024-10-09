import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchLineUp = (matchId) => {
  const [lineUp, setLineUp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const LINE_UP_URL = `/matches/${matchId}/line_up`;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getLineUp = async () => {
      try {
        const response = await axiosPrivate.get(LINE_UP_URL, {
          signal: controller.signal,
        });
        if (isMounted) {
          setLineUp(response.data);
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

    getLineUp();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [matchId]); 
  return { lineUp, isLoading, error };
};

export default useFetchLineUp;
