import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchMatchEventsById = (matchId) => {
  const [events, setEvents] = useState([]); // Ya es correcto
  const [isLoading, setIsLoading] = useState(true); // Correcto
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const MATCH_EVENTS_URL = `/player-statistics/matchEvents/${matchId}`; // URL correcta

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchMatchEvents = async () => {
      try {
        const response = await axiosPrivate.get(MATCH_EVENTS_URL, {
          signal: controller.signal,
        });
        if (isMounted) {
          setEvents(response.data); // Guardamos los eventos
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message); // Guardamos el error si lo hay
        }
      } finally {
        if (isMounted) {
          setIsLoading(false); // Terminamos la carga
        }
      }
    };

    fetchMatchEvents();

    return () => {
      isMounted = false;
      controller.abort(); // Cancelamos la solicitud si el componente se desmonta
    };
  }, [matchId, axiosPrivate]);

  return { events, isLoading, error }; // Devolvemos los eventos, el estado de carga y el error
};

export default useFetchMatchEventsById;
