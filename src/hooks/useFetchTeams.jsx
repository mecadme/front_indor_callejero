import { useState, useEffect } from "react";
import axios from "../api/axios"; 

const useFetchTeams = () => {
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const TEAMS_URL = "/teams"; 

    useEffect(() => {
        let isMounted = true; 
        const controller = new AbortController(); 

        const getTeams = async () => {
            setIsLoading(true); 
            try {
                const response = await axios.get(TEAMS_URL, {
                    signal: controller.signal, 
                });
                if (isMounted) {
                    setTeams(response.data); 
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

        getTeams(); 

        return () => {
            isMounted = false; 
            controller.abort(); 
        };
    }, []); 

    return { teams, isLoading, error }; 
};

export default useFetchTeams;