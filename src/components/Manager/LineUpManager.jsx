import React, { useState } from "react";
import { Modal, Button, Dropdown, DropdownButton, Container } from "react-bootstrap";
import {
  useSetLineUp,
  useRegisterMatchEvent,
  useChangePlayer,
} from "../../api/Service/MatchService";
import { useInjurePlayer } from "../../api/Service/PlayerService";

const LineUpManager = ({ matchId, homeTeam, awayTeam }) => {
  const [homeLineUp, setHomeLineUp] = useState([]);
  const [awayLineUp, setAwayLineUp] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [subPlayerId, setSubPlayerId] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);
  
  const { setLineUp } = useSetLineUp();
  const { registerMatchEvent } = useRegisterMatchEvent();
  const { changePlayer } = useChangePlayer();
  const { injurePlayer } = useInjurePlayer();

  const MAX_PLAYERS = 6;

  const handleEvent = (playerId, eventType, cardName = null) => {
    const payload = {
      playerId,
      eventType,
      ...(cardName && { cardName }),
    };
    registerMatchEvent(matchId, payload);
  };

  const handleSubstitution = (team, playerId) => {
    setCurrentTeam(team);
    setSubPlayerId(playerId);
    setShowModal(true);
  };

  const confirmSubstitution = (newPlayerId) => {
    changePlayer(matchId, subPlayerId, newPlayerId);
    setShowModal(false);
  };

  const handleInjury = (team, playerId) => {
    if (window.confirm("¿Confirmas que el jugador está lesionado?")) {
      injurePlayer(matchId, playerId);
      handleSubstitution(team, playerId);
    }
  };

  // Validar que no haya más de 6 jugadores en cada equipo
  const addPlayerToLineUp = (team, player) => {
    if (team === "home") {
      if (homeLineUp.length >= MAX_PLAYERS) {
        alert("No puedes añadir más de 6 jugadores en el equipo local.");
        return;
      }
      setHomeLineUp([...homeLineUp, player]);
    } else {
      if (awayLineUp.length >= MAX_PLAYERS) {
        alert("No puedes añadir más de 6 jugadores en el equipo visitante.");
        return;
      }
      setAwayLineUp([...awayLineUp, player]);
    }
  };

  // Enviar las alineaciones al backend
  const submitLineUp = () => {
    if (homeLineUp.length > MAX_PLAYERS || awayLineUp.length > MAX_PLAYERS) {
      alert("Cada equipo debe tener un máximo de 6 jugadores.");
      return;
    }
    
    const payload = {
      homePlayers: homeLineUp.map(player => ({ playerId: player.id })),
      awayPlayers: awayLineUp.map(player => ({ playerId: player.id })),
    };

    setLineUp(matchId, payload)
      .then(() => alert("Alineación enviada correctamente"))
      .catch(err => alert("Error al enviar la alineación"));
  };

  const renderPlayerActions = (player, team) => (
    <Container className={`d-flex ${team === "home" ? "justify-content-start" : "justify-content-end"}`}>
      <Button variant="primary" size="sm" onClick={() => handleEvent(player.id, "GOAL")}>
        Gol
      </Button>
      <Button variant="secondary" size="sm" onClick={() => handleEvent(player.id, "ASSIST")}>
        Asistencia
      </Button>
      <DropdownButton
        variant="warning"
        title="Tarjeta"
        size="sm"
        className="mx-1"
      >
        <Dropdown.Item onClick={() => handleEvent(player.id, "CARD", "YELLOW")}>
          Amarilla
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleEvent(player.id, "CARD", "RED")}>
          Roja
        </Dropdown.Item>
      </DropdownButton>
      <Button
        variant="info"
        size="sm"
        onClick={() => handleSubstitution(team, player.id)}
      >
        Sustitución
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => handleInjury(team, player.id)}
      >
        Lesión
      </Button>
    </Container>
  );

  return (
    <Container className="container line-up-manager">
      <div className="row">
        {/* Equipo Local */}
        <div className="col-md-6">
          <h3 className="text-center">Equipo Local - {homeTeam.name}</h3>
          {homeLineUp.map((player) => (
            <div key={player.id} className="player d-flex align-items-center">
              <img src={player.photoUrl} alt={player.name} className="player-photo mr-3" />
              <div>
                <strong>{player.firstName} {player.lastName}</strong>
                <p>{player.position}</p>
              </div>
              {renderPlayerActions(player, "home")}
            </div>
          ))}
        </div>

        {/* Equipo Visitante */}
        <div className="col-md-6">
          <h3 className="text-center">Equipo Visitante - {awayTeam.name}</h3>
          {awayLineUp.map((player) => (
            <div key={player.id} className="player d-flex align-items-center">
              {renderPlayerActions(player, "away")}
              <div className="ml-3">
                <strong>{player.firstName} {player.lastName}</strong>
                <p>{player.position}</p>
              </div>
              <img src={player.photoUrl} alt={player.name} className="player-photo ml-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Botón para enviar la alineación */}
      <div className="text-center my-4">
        <Button variant="success" onClick={submitLineUp}>
          Enviar Alineación
        </Button>
      </div>

      {/* Modal para sustituciones */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sustitución de Jugador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Selecciona el nuevo jugador</h5>
          {(currentTeam === "home" ? homeTeam.players : awayTeam.players)
            .filter((p) => p.status === "ACTIVE")
            .map((player) => (
              <Button
                key={player.playerId}
                variant="outline-primary"
                onClick={() => confirmSubstitution(player.playerId)}
                className="d-block w-100 mb-2"
              >
                {player.firstName} {player.lastName} - {player.position}
              </Button>
            ))}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default LineUpManager;
