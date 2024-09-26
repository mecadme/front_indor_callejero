import { useState, useEffect } from "react";
import axios from "../api/axios";

const useFetchMatches = () => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const MATCHES_URL = "/matches";

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getMatches = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(MATCHES_URL, {
          signal: controller.signal,
        });
        if (isMounted) {
          setMatches(response.data);
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

    getMatches();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return { matches, isLoading, error };
};

export default useFetchMatches;
