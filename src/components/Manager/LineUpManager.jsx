import React, { useState } from "react";
import { useSetLineUp, useRegisterMatchEvent, useChangePlayer, useInjurePlayer } from "../../hooks/useAPI";

const LineUpManager = ({ matchId }) => {
  const [homeLineUp, setHomeLineUp] = useState([]);
  const [awayLineUp, setAwayLineUp] = useState([]);
  const { setLineUp } = useSetLineUp();
  const { registerMatchEvent } = useRegisterMatchEvent();
  const { changePlayer } = useChangePlayer();
  const { injurePlayer } = useInjurePlayer();

  // Función para manejar el registro de eventos en vivo
  const handleEvent = (playerId, eventType, cardName = null) => {
    const payload = {
      playerId,
      eventType,
      ...(cardName && { cardName }),
    };
    registerMatchEvent(matchId, payload);
  };

  return (
    <div className="line-up-manager">
      <div className="team-lineup home">
        <h3>Equipo Local</h3>
        {homeLineUp.map(player => (
          <div key={player.id} className="player">
            {player.name}
            <div className="player-actions">
              <button onClick={() => handleEvent(player.id, "GOAL")}>Gol</button>
              <button onClick={() => handleEvent(player.id, "ASSIST")}>Asistencia</button>
              <button onClick={() => handleEvent(player.id, "CARD", "YELLOW")}>Amarilla</button>
              <button onClick={() => handleEvent(player.id, "CARD", "RED")}>Roja</button>
              <button onClick={() => handleEvent(player.id, "SUBSTITUTION")}>Sustitución</button>
              <button onClick={() => handleEvent(player.id, "INJURY")}>Lesión</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="team-lineup away">
        <h3>Equipo Visitante</h3>
        {awayLineUp.map(player => (
          <div key={player.id} className="player">
            {player.name}
            <div className="player-actions">
              <button onClick={() => handleEvent(player.id, "GOAL")}>Gol</button>
              <button onClick={() => handleEvent(player.id, "ASSIST")}>Asistencia</button>
              <button onClick={() => handleEvent(player.id, "CARD", "YELLOW")}>Amarilla</button>
              <button onClick={() => handleEvent(player.id, "CARD", "RED")}>Roja</button>
              <button onClick={() => handleEvent(player.id, "SUBSTITUTION")}>Sustitución</button>
              <button onClick={() => handleEvent(player.id, "INJURY")}>Lesión</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineUpManager;
