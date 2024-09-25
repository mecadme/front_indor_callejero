import React, { useEffect, useState } from "react";

import axios from "../../api/axios";

import "bootstrap/dist/css/bootstrap.min.css";

const Rounds = () => {
  const [RoundsData, setRoundsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ROUNDS_URL = "rounds/withMatches";

  const fetchRoundsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(ROUNDS_URL);

      console.log(response.data);

      const data = response.data;

      setRoundsData(data);
      setLoading(false);
    } catch (error) {
      setError("No se pudo cargar la jornada");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoundsData();
  }, []);

  if (loading) {
    return <div>Cargando jornada...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="Rounds container">
      <h2 className="Rounds-title">{RoundsData[0].roundName}</h2>
      {RoundsData.map((match, index) => (
        <div key={index} className="Rounds-card">
          <p className="Rounds-date">
            <strong>{new Date(match.date).toLocaleDateString()}</strong> -{" "}
            {match.place}
          </p>
          <ul className="list-group">
            <li className="list-group-item match-card d-flex flex-column align-items-center">
              <div className="match-details d-flex justify-content-between">
                <span className="team team1">{match.homeTeam}</span>
                <span className="score">
                  {match.goalsHomeTeam} - {match.goalsAwayTeam}
                </span>
                <span className="team team2">{match.awayTeam}</span>
              </div>
              <span className="match-time">
                {new Date(match.date).toLocaleTimeString()}
              </span>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Rounds;
