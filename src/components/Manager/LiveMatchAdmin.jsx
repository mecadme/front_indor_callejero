import React, { useState } from "react";
import { useStartMatch, usePauseMatch, useStopMatch } from "../../api/Service/MatchService";
import LineUpManager from "./LineUpManager";
import Countdown from "react-countdown"; // Para el contador regresivo

const LiveMatchAdmin = ({ matches }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { startMatch } = useStartMatch();
  const { pauseMatch } = usePauseMatch();
  const { stopMatch } = useStopMatch();
  console.log(matches);
  
  // Filtrar los partidos de hoy que aún no han comenzado
  // const todayMatches = matches.filter(match => match.status === "NOT_STARTED");
  const todayMatches = matches;

  return (
    <div className="live-match-admin">
      <h2>Administrar Partido en Vivo</h2>

      {/* Dropdown para seleccionar el partido */}
      <select onChange={(e) => setSelectedMatch(e.target.value)}>
        <option value="">Seleccionar Partido</option>
        {todayMatches.map((match) => (
          <option key={match.id} value={match.id}>
            {match.homeTeam} vs {match.awayTeam} - {match.date}
          </option>
        ))}
      </select>

      {/* Botones para iniciar, pausar y detener el partido */}
      {selectedMatch && (
        <div className="match-controls">
          <button onClick={() => startMatch(selectedMatch)}>Iniciar Partido</button>
          <button onClick={() => pauseMatch(selectedMatch)}>Pausar Partido</button>
          <button onClick={() => stopMatch(selectedMatch)}>Detener Partido</button>
        </div>
      )}

      {/* Componente para gestionar la alineación */}
      {selectedMatch && (
        <LineUpManager matchId={selectedMatch} />
      )}

      {/* Contador regresivo, seteado por la duración del partido */}
      {selectedMatch && (
        <Countdown
          date={Date.now() + selectedMatch.duration * 60 * 1000} // Duración en minutos
          renderer={({ hours, minutes, seconds }) => (
            <span>{hours}:{minutes}:{seconds}</span>
          )}
        />
      )}
    </div>
  );
};

export default LiveMatchAdmin;
