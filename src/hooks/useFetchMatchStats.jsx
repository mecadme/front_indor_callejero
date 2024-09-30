import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchMatchStats = (matchId) => {
  const axiosPrivate = useAxiosPrivate();

  const [matchStats, setMatchStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const controller = new AbortController();
    const MATCH_StATS_URL = (matchId) =>
      `/player-statistics/matchStats/${matchId}`;

    const getMatchStats = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(MATCH_StATS_URL(matchId), {
          signal: controller.signal,
        });
        console.log(response.data);

        isMounted && setMatchStats(response.data);
      } catch (err) {
        isMounted && setMatchStats(response.data);
      } finally {
        isMounted && setLoading(false);
      }
    };

    getMatchStats();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [matchId]);

  return { matchStats, loading, error };
};

export default useFetchMatchStats;
