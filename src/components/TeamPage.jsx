import React from "react";
import { useParams } from "react-router-dom";

const TeamPage = ({ teams }) => {
  const { teamId } = useParams();

  // Encontrar el equipo seleccionado en la lista de equipos
  const team = teams.find((team) => team.teamId === parseInt(teamId));

  return (
    <div>
      <h1>{team?.name}</h1>
      <h2>Barrio: {team?.neighborhood}</h2>
      <h3>Grupo: {team?.teamGroup}</h3>

      {team?.players.length ? (
        <div>
          <h3>Jugadores:</h3>
          <ul>
            {team.players.map((player) => (
              <li key={player.playerId}>
                <img src={player.photoUrl} alt={player.firstName} style={{ width: "50px" }} />
                <p>{player.firstName} {player.lastName}</p>
                <p>Número: {player.jerseyNumber}</p>
                <p>Posición: {player.position}</p>
                <p>Estado: {player.status}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No hay jugadores en este equipo.</p>
      )}
    </div>
  );
};

export default TeamPage;
