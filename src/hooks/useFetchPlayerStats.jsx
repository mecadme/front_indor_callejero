import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchPlayerStats = (playerId) => {
    const axiosPrivate = useAxiosPrivate();

    const [playerStats, setPlayerStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const PLAYER_STATS_URL = (playerId) => `/player-statistics/allPlayersStats/${playerId}`;

    useEffect(() => {
        let isMounted = true;

        const controller = new AbortController();

        const getPlayerStats = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get(PLAYER_STATS_URL(playerId), {
                    signal: controller.signal,
                });

                if (isMounted) {
                    setPlayerStats(response.data);
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

        getPlayerStats();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [playerId]);

    return { playerStats, loading, error };





}
  

export default useFetchPlayerStats