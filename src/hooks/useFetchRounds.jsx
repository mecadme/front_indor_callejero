import { useState, useEffect } from "react";
import axios from "../api/axios";

const useFetchRounds = (selectedRoundId) => {
  const [RoundsData, setRoundsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ROUNDS_URL = "rounds/withMatches";

  const fetchRoundsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ROUNDS_URL);
      const data = response.data;

      // Agrupar por roundId y roundName
      const groupedData = data.reduce((acc, round) => {
        const key = `${round.roundId}-${round.roundName}`;
        if (!acc[key]) {
          acc[key] = {
            roundId: round.roundId,
            roundName: round.roundName,
            matches: [],
          };
        }
        acc[key].matches.push(round);
        return acc;
      }, {});

      const finalData = Object.values(groupedData);

      const filteredData = selectedRoundId
        ? finalData.filter((round) => round.roundId === selectedRoundId)
        : finalData;

      setRoundsData(filteredData);
      setLoading(false);
    } catch (error) {
      setError("No se pudo cargar la jornada");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoundsData();
  }, [selectedRoundId]); // Volver a buscar cuando cambia el roundId

  return { RoundsData, loading, error };
};

export default useFetchRounds;
