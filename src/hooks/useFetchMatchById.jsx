import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchMatchById = (matchId) => {
  const [matchDetails, setMatchDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const MATCHES_URL = `/matches/${matchId}`; 

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getMatchDetails = async () => {
      try {
        const response = await axiosPrivate.get(MATCHES_URL, {
          signal: controller.signal,
        });
        if (isMounted) {
          setMatchDetails(response.data); 
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getMatchDetails();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [matchId, axiosPrivate]);

  return { matchDetails, isLoading, error };
};

export default useFetchMatchById;
