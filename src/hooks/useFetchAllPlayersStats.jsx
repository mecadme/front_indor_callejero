import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchAllPlayersStats = (playerId) => {
  const axiosPrivate = useAxiosPrivate();

  const [allPlayersStats, setAllPlayersStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const PLAYER_STATS_URL = "/player-statistics/allPlayersStats";

  useEffect(() => {
    let isMounted = true;

    const controller = new AbortController();

    const getAllPlayersStats = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(PLAYER_STATS_URL, {
          signal: controller.signal,
        });

        if (isMounted) {
          setAllPlayersStats(response.data);
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

    getAllPlayersStats();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [playerId]);

  return { allPlayersStats, loading, error };
};

export default useFetchAllPlayersStats;
