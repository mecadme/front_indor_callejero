import { useState, useEffect } from "react";
import axios from "../api/axios"; 

const useSponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const SPONSORS_URL = "/sponsors"; // URL para obtener los sponsors

  useEffect(() => {
    let isMounted = true; // Evitar actualizaciones si el componente se desmonta
    const controller = new AbortController();

    const getSponsors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(SPONSORS_URL, {
          signal: controller.signal,
        });

        if (isMounted) {
          setSponsors(response.data); // Establecer los datos recibidos
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

    getSponsors();

    return () => {
      isMounted = false;
      controller.abort(); // Cancela la solicitud si el componente se desmonta
    };
  }, []); // Dependencia vacía para que se ejecute solo al montar

  return { sponsors, isLoading, error };
};

export default useSponsors;
