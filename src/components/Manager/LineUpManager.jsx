import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Dropdown,
  DropdownButton,
  Container,
  ButtonGroup,
} from "react-bootstrap";
import {
  useSetLineUp,
  useRegisterMatchEvent,
  useChangePlayer,
} from "../../api/Service/MatchService";
import {
  useInjurePlayer,
  useUpdatePlayer,
} from "../../api/Service/PlayerService";

const LineUpManager = ({ matchId, homeTeam, awayTeam }) => {
  const [homeLineUp, setHomeLineUp] = useState([]);
  const [awayLineUp, setAwayLineUp] = useState([]);
  const [lineUpSubmitted, setLineUpSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [subPlayerId, setSubPlayerId] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(null);

  const { setLineUp } = useSetLineUp();
  const { registerMatchEvent } = useRegisterMatchEvent();
  const { changePlayer } = useChangePlayer();
  const { injurePlayer } = useInjurePlayer();
  const { updatePlayer } = useUpdatePlayer();

  const MAX_PLAYERS = 6;

  // Resetear la alineación cuando el partido cambia
  useEffect(() => {
    setHomeLineUp([]);
    setAwayLineUp([]);
    setLineUpSubmitted(false);
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
    setSubPlayerId(playerId); // Jugador que será sustituido
    setShowModal(true);
  };

  const confirmSubstitution = (newPlayerId) => {
    const outPlayerId = subPlayerId;
    const teamId = currentTeam === "home" ? homeTeam.teamId : awayTeam.teamId;

    // Realizar la sustitución en el backend
    changePlayer(matchId, { outPlayerId, inPlayerId: newPlayerId, teamId });

    // Actualizar el estado de los jugadores
    updatePlayer(newPlayerId, { status: "STARTER" }); // Jugador que entra pasa a ser titular

    // Actualizar la alineación en el frontend
    if (currentTeam === "home") {
      setHomeLineUp(
        homeLineUp.map((player) =>
          player.playerId === outPlayerId
            ? { ...player, playerId: newPlayerId }
            : player
        )
      );
    } else {
      setAwayLineUp(
        awayLineUp.map((player) =>
          player.playerId === outPlayerId
            ? { ...player, playerId: newPlayerId }
            : player
        )
      );
    }

    setShowModal(false);
  };

  const handleInjury = (team, playerId) => {
    if (window.confirm("¿Confirmas que el jugador está lesionado?")) {
      injurePlayer(playerId);
      handleSubstitution(team, playerId);
    }
  };

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

    updatePlayer(player.playerId, { status: "STARTER" });
  };

  const removePlayerFromLineUp = (team, playerId) => {
    if (team === "home") {
      setHomeLineUp(
        homeLineUp.filter((player) => player.playerId !== playerId)
      );
    } else {
      setAwayLineUp(
        awayLineUp.filter((player) => player.playerId !== playerId)
      );
    }

    updatePlayer(playerId, { status: "ACTIVE" });
  };

  // Enviar las alineaciones al backend
  const submitLineUp = () => {
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
  const renderPlayerActions = (player, team) => (
    <>
      {!lineUpSubmitted && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => removePlayerFromLineUp(team, player.playerId)}
        >
          Remover
        </Button>
      )}
      {lineUpSubmitted && (
        <Container
          className={`d-flex ${
            team === "home" ? "justify-content-start" : "justify-content-end"
          }`}
        >
          <ButtonGroup aria-label="player-actions" size="sm" className="mr-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEvent(player.playerId, "goal")}
            >
              Gol
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEvent(player.playerId, "assist")}
            >
              Asistencia
            </Button>
            <DropdownButton
              as={ButtonGroup}
              variant="warning"
              title="Tarjeta"
              size="sm"
            >
              <Dropdown.Item
                onClick={() => handleEvent(player.playerId, "card", "YELLOW")}
              >
                Amarilla
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleEvent(player.playerId, "card", "RED")}
              >
                Roja
              </Dropdown.Item>
            </DropdownButton>
            <Button
              variant="info"
              size="sm"
              onClick={() => handleSubstitution(team, player.playerId)}
            >
              Sustitución
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleInjury(team, player.playerId)}
            >
              Lesión
            </Button>
          </ButtonGroup>
        </Container>
      )}
    </>
  );

  // Mostrar solo jugadores que están activos y no han sido seleccionados
  const renderAvailablePlayers = (team, players, lineUp) =>
    players
      .filter((p) => p.status === "ACTIVE") // Mostrar solo jugadores activos
      .filter((p) => !lineUp.some((l) => l.playerId === p.playerId)) // Excluir jugadores que ya están en la alineación
      .map((player) => (
        <div
          key={player.playerId}
          className="player d-flex align-items-center justify-content-between"
        >
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
          <Button
            variant="success"
            size="sm"
            onClick={() => addPlayerToLineUp(team, player)}
          >
            Añadir
          </Button>
        </div>
      ));

  return (
    <Container className="container line-up-manager">
      <div className="row">
        {/* Equipo Local */}
        <div className="col-md-6">
          <h3 className="text-center">Equipo Local - {homeTeam.name}</h3>
          <h5>Alineación:</h5>
          {homeLineUp.map((player) => (
            <div
              key={player.playerId}
              className="player d-flex align-items-center"
            >
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
            <div
              key={player.playerId}
              className="player d-flex align-items-center"
            >
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
      {!lineUpSubmitted && (
        <div className="text-center my-4">
          <Button variant="success" onClick={submitLineUp}>
            Enviar Alineación
          </Button>
        </div>
      )}

      {/* Modal para sustituciones */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sustitución de Jugador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Selecciona el nuevo jugador</h5>
          {(currentTeam === "home" ? homeTeam.players : awayTeam.players)
            .filter(
              (p) =>
                p.status === "ACTIVE" &&
                !homeLineUp.some((l) => l.playerId === p.playerId)
            ) // Jugadores activos que no estén en la alineación
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
