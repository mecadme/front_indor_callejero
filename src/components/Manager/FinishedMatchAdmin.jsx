import React, { useEffect } from "react";
import { useGetMatches } from "../../hooks/useAPI";

const FinishedMatchAdmin = () => {
  const { data: matches, error, loading, getMatches } = useGetMatches();

  useEffect(() => {
    getMatches(); // Cargar los partidos cuando el componente se monta
  }, [getMatches]);

  if (loading) return <p>Cargando partidos...</p>;
  if (error) return <p>Error al cargar los partidos: {error.message}</p>;

  // Filtrar los partidos finalizados
  const finishedMatches = matches?.filter(match => match.status === "finished") || [];

  return (
    <div className="finished-match-admin">
      <h2>Partidos Finalizados</h2>
      {finishedMatches.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Equipos</th>
              <th>Resultado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {finishedMatches.map(match => (
              <tr key={match.id}>
                <td>{new Date(match.date).toLocaleDateString()}</td>
                <td>{match.homeTeam.name} vs {match.awayTeam.name}</td>
                <td>{match.homeTeamGoals} - {match.awayTeamGoals}</td>
                <td>
                  <button onClick={() => console.log(`Agregar eventos para el partido ${match.id}`)}>
                    Agregar Eventos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay partidos finalizados disponibles.</p>
      )}
    </div>
  );
};

export default FinishedMatchAdmin;
