import React, { useState, useEffect } from "react";
import {
  useGetMatches,
  useStartMatch,
  usePauseMatch,
  useResumeMatch,
  useStopMatch,
  useSetLineUp,
  useRegisterMatchEvent,
  useChangePlayer,} from "../../api/Service/MatchService";
import {
  useAddRefereeToMatch,
} from "../../api/Service/RefereeService";

import LiveMatchAdmin from "./LiveMatchAdmin";
import LineUpManager from "./LineUpManager";

const MatchManager = () => {
  const [currentTab, setCurrentTab] = useState("live");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [homeTeamLineup, setHomeTeamLineup] = useState([]);
  const [awayTeamLineup, setAwayTeamLineup] = useState([]);
  const [referee, setReferee] = useState(null);
  const [matchTimer, setMatchTimer] = useState(0);
  const { data: matches, getMatches } = useGetMatches();
  const { startMatch } = useStartMatch();
  const { pauseMatch } = usePauseMatch();
  const { resumeMatch } = useResumeMatch();
  const { stopMatch } = useStopMatch();
  const { setLineUp } = useSetLineUp();
  const { registerMatchEvent } = useRegisterMatchEvent();
  const { changePlayer } = useChangePlayer();
  const { addRefereeToMatch } = useAddRefereeToMatch();

  // Fetch matches when component mounts
  useEffect(() => {
    getMatches();
  }, []);

  // Handle Timer
  useEffect(() => {
    let timer;
    if (matchTimer > 0) {
      timer = setTimeout(() => setMatchTimer(matchTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [matchTimer]);

  const handleMatchStart = (matchId) => {
    startMatch(matchId);
    setMatchTimer(selectedMatch.duration * 60); // Set timer based on match duration in minutes
  };

  const handleMatchPause = (matchId) => pauseMatch(matchId);

  const handleMatchResume = (matchId) => resumeMatch(matchId);

  const handleMatchStop = (matchId) => stopMatch(matchId);

  const handleLineupChange = (teamType, playerId) => {
    if (teamType === "home") {
      setHomeTeamLineup((prev) => [...prev, playerId]);
    } else {
      setAwayTeamLineup((prev) => [...prev, playerId]);
    }
  };

  const handlePlayerSubstitution = (teamType, playerOut, playerIn) => {
    changePlayer(selectedMatch.id, { playerOut, playerIn });
  };

  const handleRegisterEvent = (playerId, eventType, cardName = null) => {
    const eventPayload = {
      playerId,
      eventType,
      cardName,
    };
    registerMatchEvent(selectedMatch.id, eventPayload);
  };

  const handleAddReferee = (refereeId) =>
    addRefereeToMatch(refereeId, selectedMatch.id);

  

  const openSubstitutionModal = (teamType, playerOut) => {
    const playerIn = prompt("Selecciona jugador de cambio: ");
    handlePlayerSubstitution(teamType, playerOut, playerIn);
  };

  return (
    <div className="match-manager">
      <button onClick={() => (window.location.href = "/")}>Home</button>
      <div className="tabs">
        <button onClick={() => setCurrentTab("live")}>
          Administrar Partido en Vivo
        </button>
        <button onClick={() => setCurrentTab("finished")}>
          Partidos Finalizados
        </button>
      </div>

      {currentTab === "live" && (
        <div className="live-match">
          <h2>Partidos de Hoy</h2>
          <ul>
            {matches &&
              matches
                .filter((match) => match.status === "NOT_STARTED")
                .map((match) => (
                  <li key={match.id} onClick={() => setSelectedMatch(match)}>
                    {match.homeTeam.name} vs {match.awayTeam.name} -{" "}
                    {match.schedule.date}
                  </li>
                ))}
          </ul>

          {selectedMatch && (
            <div>
              <h3>
                {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}
              </h3>
              <p>Duración: {matchTimer} segundos restantes</p>
              <button onClick={() => handleMatchStart(selectedMatch.matchId)}>
                Iniciar
              </button>
              <button onClick={() => handleMatchPause(selectedMatch.matchId)}>
                Pausar
              </button>
              <button onClick={() => handleMatchResume(selectedMatch.matchId)}>
                Reanudar
              </button>
              <button onClick={() => handleMatchStop(selectedMatch.matchId)}>
                Detener
              </button>

              <div className="lineups">
                <LineUpManager matchId={selectedMatch.matchId} homeTeam={selectedMatch.homeTeam}  awayTeam={selectedMatch.awayTeam}/>
              </div>

              <div className="referee-selection">
                <label>Selecciona Árbitro:</label>
                <select onChange={(e) => handleAddReferee(e.target.value)}>
                  <option value="1">Árbitro 1</option>
                  <option value="2">Árbitro 2</option>
                  {/* Los valores y opciones vendrían de tu API */}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {currentTab === "finished" && (
        <div className="finished-matches">
          <h2>Partidos Finalizados</h2>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Equipo Local</th>
                <th>Equipo Visitante</th>
                <th>Resultado</th>
                <th>Eventos</th>
              </tr>
            </thead>
            <tbody>
              {matches &&
                matches
                  .filter((match) => match.status === "FINISHED")
                  .map((match) => (
                    <tr key={match.id}>
                      <td>{match.date}</td>
                      <td>{match.homeTeam.name}</td>
                      <td>{match.awayTeam.name}</td>
                      <td>
                        {match.homeTeamGoals} - {match.awayTeamGoals}
                      </td>
                      <td>
                        <button onClick={() => setSelectedMatch(match)}>
                          Agregar Eventos
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {selectedMatch && (
            <div className="post-match-events">
              <h3>
                Agregar Eventos para {selectedMatch.homeTeam.name} vs{" "}
                {selectedMatch.awayTeam.name}
              </h3>
              {/* Aquí podrías agregar los eventos como Porterías Imbatidas, Duelos Aéreos, etc. */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchManager;
