import React, { useState, useEffect } from "react";
import { Modal, Button, Dropdown, DropdownButton, Container } from "react-bootstrap";
import { useSetLineUp, useRegisterMatchEvent, useChangePlayer } from "../../api/Service/MatchService";
import { useInjurePlayer } from "../../api/Service/PlayerService";

const LineUpManager = ({ matchId, homeTeam, awayTeam }) => {
  const [homeLineUp, setHomeLineUp] = useState([]);
  const [awayLineUp, setAwayLineUp] = useState([]);
  const [lineUpSubmitted, setLineUpSubmitted] = useState(false); // Estado para controlar si se ha enviado la alineación
  const [showModal, setShowModal] = useState(false);
  const [subPlayerId, setSubPlayerId] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);

  const { setLineUp } = useSetLineUp();
  const { registerMatchEvent } = useRegisterMatchEvent();
  const { changePlayer } = useChangePlayer();
  const { injurePlayer } = useInjurePlayer();

  const MAX_PLAYERS = 6;

  // Resetear la alineación cuando el partido cambia
  useEffect(() => {
    setHomeLineUp([]);
    setAwayLineUp([]);
    setLineUpSubmitted(false); // Reiniciar el estado de enviado
  }, [matchId]);

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

  // Remover jugador de la alineación
  const removePlayerFromLineUp = (team, playerId) => {
    if (team === "home") {
      setHomeLineUp(homeLineUp.filter((player) => player.playerId !== playerId));
    } else {
      setAwayLineUp(awayLineUp.filter((player) => player.playerId !== playerId));
    }
  };

  // Enviar las alineaciones al backend
  const submitLineUp = () => {
    if (homeLineUp.length >= MAX_PLAYERS || awayLineUp.length >= MAX_PLAYERS) {
      alert("Cada equipo debe tener exactamente 6 jugadores.");
      return;
    }

    const payload = {
      homePlayers: homeLineUp.map((player) => ({ playerId: player.playerId })),
      awayPlayers: awayLineUp.map((player) => ({ playerId: player.playerId })),
    };

    setLineUp(matchId, payload)
      .then(() => {
        alert("Alineación enviada correctamente");
        setLineUpSubmitted(true); // Cambiar estado a alineación enviada
      })
      .catch((err) => alert("Error al enviar la alineación"));
  };

  // Renderizar las acciones solo si la alineación fue enviada
  const renderPlayerActions = (player, team) =>
    lineUpSubmitted && (
      <Container className={`d-flex ${team === "home" ? "justify-content-start" : "justify-content-end"}`}>
        <Button variant="primary" size="sm" onClick={() => handleEvent(player.playerId, "goal")}>
          Gol
        </Button>
        <Button variant="secondary" size="sm" onClick={() => handleEvent(player.playerId, "assist")}>
          Asistencia
        </Button>
        <DropdownButton variant="warning" title="Tarjeta" size="sm" className="mx-1">
          <Dropdown.Item onClick={() => handleEvent(player.playerId, "card", "YELLOW")}>Amarilla</Dropdown.Item>
          <Dropdown.Item onClick={() => handleEvent(player.playerId, "cars", "RED")}>Roja</Dropdown.Item>
        </DropdownButton>
        <Button variant="info" size="sm" onClick={() => handleSubstitution(team, player.playerId)}>
          Sustitución
        </Button>
        <Button variant="danger" size="sm" onClick={() => handleInjury(team, player.playerId)}>
          Lesión
        </Button>
      </Container>
    );

  // Corregir la validación para mostrar "Añadir" o "Remover"
  const renderAvailablePlayers = (team, players, lineUp) =>
    players
      .filter((p) => p.status === "ACTIVE")
      .map((player) => {
        // Revisar si este jugador específico está en la alineación
        const isPlayerInLineUp = lineUp.some((p) => p.playerId === player.playerId);

        return (
          <div key={player.playerId} className="player d-flex align-items-center justify-content-between">
            <img
              src={player.photoUrl}
              alt={player.name}
              className="player-photo mr-3"
              style={{ width: "3.5rem", height: "3.5rem" }}
            />
            <div>
              {player.firstName} {player.lastName}
              <p>{player.position}</p>
            </div>
            {isPlayerInLineUp ? (
              <Button variant="danger" size="sm" onClick={() => removePlayerFromLineUp(team, player.playerId)}>
                Remover
              </Button>
            ) : (
              <Button variant="success" size="sm" onClick={() => addPlayerToLineUp(team, player)}>
                Añadir
              </Button>
            )}
          </div>
        );
      });

  return (
    <Container className="container line-up-manager">
      <div className="row">
        {/* Equipo Local */}
        <div className="col-md-6">
          <h3 className="text-center">Equipo Local - {homeTeam.name}</h3>
          <h5>Alineación:</h5>
          {homeLineUp.map((player) => (
            <div key={player.playerId} className="player d-flex align-items-center">
              <img
                src={player.photoUrl}
                alt={player.name}
                className="player-photo mr-3"
                style={{ width: "3.5rem", height: "3.5rem" }}
              />
              <div>
                <strong>
                  {player.firstName} {player.lastName}
                </strong>
                <p>{player.position}</p>
              </div>
              {renderPlayerActions(player, "home")}
            </div>
          ))}
          {/* Mostrar jugadores disponibles solo si la alineación no ha sido enviada */}
          {!lineUpSubmitted && (
            <>
              <h5>Jugadores Disponibles:</h5>
              {renderAvailablePlayers("home", homeTeam.players, homeLineUp)}
            </>
          )}
        </div>

        {/* Equipo Visitante */}
        <div className="col-md-6">
          <h3 className="text-center">Equipo Visitante - {awayTeam.name}</h3>
          <h5>Alineación:</h5>
          {awayLineUp.map((player) => (
            <div key={player.playerId} className="player d-flex align-items-center">
              {renderPlayerActions(player, "away")}
              <div className="ml-3">
                <strong>
                  {player.firstName} {player.lastName}
                </strong>
                <p>{player.position}</p>
              </div>
              <img
                src={player.photoUrl}
                alt={player.name}
                className="player-photo ml-3"
                style={{ width: "3.5rem", height: "3.5rem" }}
              />
            </div>
          ))}
          {!lineUpSubmitted && (
            <>
              <h5>Jugadores Disponibles:</h5>
              {renderAvailablePlayers("away", awayTeam.players, awayLineUp)}
            </>
          )}
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
