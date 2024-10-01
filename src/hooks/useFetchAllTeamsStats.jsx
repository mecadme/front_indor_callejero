import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchAllTeamsStats = (playerId) => {
  const axiosPrivate = useAxiosPrivate();

  const [allTeamsStats, setAllTeamsStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TEAMS_STATS_URL = "/player-statistics/allTeamsStats";

  useEffect(() => {
    let isMounted = true;

    const controller = new AbortController();

    const getAllTeamsStats = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(TEAMS_STATS_URL, {
          signal: controller.signal,
        });

        if (isMounted) {
          setAllTeamsStats(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getAllTeamsStats();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [playerId]);

  return { allTeamsStats, loading, error };
};

export default useFetchAllTeamsStats;
