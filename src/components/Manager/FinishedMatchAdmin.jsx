import React, { useEffect } from "react";
import { useGetMatches } from "../../api/Service/MatchService";

const FinishedMatchAdmin = () => {
  const { data: matches, loading, error, getMatches } = useGetMatches();

  useEffect(() => {
    getMatches();
  }, []);

  if (loading) return <p>Cargando partidos...</p>;
  if (error) return <p>Error al cargar los partidos: {error.message}</p>;

  const finishedMatches = matches?.filter((match) => match.status === "FINISHED") || [];

  return (
    <div className="finished-match-admin">
      <h2>Partidos Finalizados</h2>
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
          {finishedMatches.map((match) => (
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
    </div>
  );
};

export default FinishedMatchAdmin;
