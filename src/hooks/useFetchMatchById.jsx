import { useState, useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetchMatchById = (matchId) => {
  const [matchDetails, setMatchDetails] = useState(null); // Cambié a singular porque es solo un partido
  const [isLoading, setIsLoading] = useState(true); // Inicializamos en true
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const MATCHES_URL = `/matches/${matchId}`; // Asegurar que la URL use el ID correctamente

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getMatchDetails = async () => {
      try {
        const response = await axiosPrivate.get(MATCHES_URL, {
          signal: controller.signal,
        });
        if (isMounted) {
          console.log(response.data);
          setMatchDetails(response.data); // Almacenamos los detalles del partido
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false); // Una vez finalizada la solicitud, actualizamos el estado de carga
        }
      }
    };

    getMatchDetails();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [matchId, axiosPrivate]);

  return { matchDetails, isLoading, error }; // Asegúrate de devolver matchDetails y isLoading
};

export default useFetchMatchById;
