import React, { useEffect, useState } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/Standings.css";
import axios from '../../api/axios';

const Standings = () => {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const STANDINGS_URL = "/teams/standings_by_group";

  const fetchGroupsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(STANDINGS_URL);

      if (response.data && typeof response.data === 'object') {
        setGroups(response.data);
      } else {
        throw new Error('Formato de datos incorrecto');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar las tablas:', err);
      setError(err.message || 'No se pudo cargar las tablas');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsData();
  }, []);

  if (loading) {
    return <div>Cargando tablas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="standings container">
      <h2 className="standings-title">Tablas de Posiciones</h2>
      {Object.keys(groups).map((groupName, index) => (
        <div key={index} className="grupo mb-4">
          <h3>{groupName}</h3>
          <ul className="list-group">
            {groups[groupName].map((team, teamIndex) => (
              <li
                key={teamIndex}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{ backgroundColor: team.color }}
              >
                <span>{team.teamName}</span>
                <span className="rounded-pill">{team.points} puntos</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Standings;
