import { useState, useEffect } from "react";
import axios from "../api/axios"; 

const useWeekAward = (date) => {
    const [weekAward, setWeekAward] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const WEEKAWARD_URL = `/weekly-awards?date=${date}`;

    useEffect(() => {
        let isMounted = true; // Evita actualizar el estado si el componente se desmonta
        const controller = new AbortController();

        const getWeekAward = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(WEEKAWARD_URL, {
                    signal: controller.signal,
                });
                if (isMounted) {
                    setWeekAward(response.data);
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

        getWeekAward();

        return () => {
            isMounted = false; 
            controller.abort(); 
        };
    }, [date]); 

    return { weekAward, isLoading, error };
};

export default useWeekAward;
