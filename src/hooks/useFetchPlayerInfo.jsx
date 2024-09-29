import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchPlayerInfo = (playerId) => {
    const axiosPrivate = useAxiosPrivate();

    const [playerInfo, setPlayerInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const PLAYER_INFO_URL = `/players/${playerId}`;

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getPlayerInfo = async () => {
            setLoading(true);
            try {
                const response = await axiosPrivate.get(PLAYER_INFO_URL, {
                    signal: controller.signal,
                });

                if (isMounted) {
                    setPlayerInfo(response.data);
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

        getPlayerInfo();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [playerId, axiosPrivate]);

    return { playerInfo, loading, error };
};

export default useFetchPlayerInfo;
