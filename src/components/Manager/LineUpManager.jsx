import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Dropdown,
  DropdownButton,
  Col,
  Row,
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

import "./css/LineUpManager.css";

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
  const goalIcon = "https://cdn-icons-png.flaticon.com/512/5043/5043542.png";
  const assistIcon = "https://cdn-icons-png.flaticon.com/512/6664/6664856.png";
  const yellowCardIcon =
    "https://cdn-icons-png.flaticon.com/512/3363/3363491.png";
  const redCardIcon = "https://cdn-icons-png.flaticon.com/512/451/451718.png";
  const substitutionIcon =
    "https://cdn-icons-png.flaticon.com/512/2716/2716280.png";
  const injuryIcon = "https://cdn-icons-png.flaticon.com/512/9962/9962365.png";

  const MAX_PLAYERS = 6;

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
    setSubPlayerId(playerId);
    setShowModal(true);
  };

  const confirmSubstitution = (newPlayerId) => {
    const outPlayerId = subPlayerId;
    const teamId = currentTeam === "home" ? homeTeam.teamId : awayTeam.teamId;
    const newPlayer = (
      currentTeam === "home" ? homeTeam.players : awayTeam.players
    ).find((player) => player.playerId === newPlayerId);

    changePlayer(matchId, { outPlayerId, inPlayerId: newPlayerId, teamId });
    updatePlayer(newPlayerId, { status: "STARTER" });

    if (currentTeam === "home") {
      setHomeLineUp((prevLineUp) =>
        prevLineUp
          .filter((player) => player.playerId !== outPlayerId)
          .concat(newPlayer)
      );
    } else {
      setAwayLineUp((prevLineUp) =>
        prevLineUp
          .filter((player) => player.playerId !== outPlayerId)
          .concat(newPlayer)
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

  const submitLineUp = () => {
    const payload = {
      homePlayers: homeLineUp.map((player) => ({ playerId: player.playerId })),
      awayPlayers: awayLineUp.map((player) => ({ playerId: player.playerId })),
    };

    setLineUp(matchId, payload)
      .then(() => {
        alert("Alineación enviada correctamente");
        setLineUpSubmitted(true);
      })
      .catch((err) => alert("Error al enviar la alineación"));
  };

  const renderPlayerActions = (player, team) => (
    <>
      {!lineUpSubmitted && (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => removePlayerFromLineUp(team, player.playerId)}
        >
          Remover
        </Button>
      )}
      {lineUpSubmitted && (
        <Container
          className={`d-flex justify-content-center align-items-center`}
        >
          <ButtonGroup aria-label="player-actions" size="sm" className="mr-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleEvent(player.playerId, "goal")}
            >
              <img src={goalIcon} alt="goal-icon" className="icon-size" />
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => handleEvent(player.playerId, "assist")}
            >
              <img src={assistIcon} alt="assist-icon" className="icon-size" />
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
                <img
                  src={yellowCardIcon}
                  alt="yellow-card-icon"
                  className="icon-size"
                />
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleEvent(player.playerId, "card", "RED")}
              >
                <img
                  src={redCardIcon}
                  alt="red-card-icon"
                  className="icon-size"
                />
              </Dropdown.Item>
            </DropdownButton>
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => handleSubstitution(team, player.playerId)}
            >
              <img
                src={substitutionIcon}
                alt="sub-icon"
                className="icon-size"
              />
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleInjury(team, player.playerId)}
            >
              <img src={injuryIcon} alt="injury-icon" className="icon-size" />
            </Button>
          </ButtonGroup>
        </Container>
      )}
    </>
  );

  const renderAvailablePlayers = (team, players, lineUp) =>
    players
      .filter((p) => p.status === "ACTIVE")
      .filter((p) => !lineUp.some((l) => l.playerId === p.playerId))
      .map((player) => (
        <div
          key={player.playerId}
          className="player d-flex align-items-center justify-content-between"
        >
          <img
            src={player.photoUrl}
            alt={player.name}
            className="player-photo mr-3"
            style={{ width: "2.5rem", height: "2.5rem" }}
          />
          <div>
            {player.firstName} {player.lastName}
            <p>{player.position}</p>
          </div>
          <Button
            variant="outline-success"
            size="sm"
            onClick={() => addPlayerToLineUp(team, player)}
          >
            Añadir
          </Button>
        </div>
      ));

  return (
    <Container fluid className="container line-up-manager">
      <Row className="row">
        {/* Equipo Local */}
        <Col className="col-md-6">
          <h3 className="text-center">Equipo Local - {homeTeam.name}</h3>
          <h5>Alineación:</h5>
          {homeLineUp.map((player) => (
            <Container
              key={player.playerId}
              className="player d-flex align-items-center"
            >
              <Row className="ml-3 d-flex justify-content-center align-items-center">
                <Col className="d-flex align-items-center">
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="player-photo mr-3"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  />
                </Col>
                <Col>
                  <strong>
                    {player.firstName} {player.lastName}
                  </strong>
                  <p>{player.position}</p>
                </Col>
              {renderPlayerActions(player, "home")}
              </Row>
            </Container>
          ))}
          {!lineUpSubmitted && (
            <>
              <h5>Jugadores Disponibles:</h5>
              {renderAvailablePlayers("home", homeTeam.players, homeLineUp)}
            </>
          )}
        </Col>

        {/* Equipo Visitante */}
        <Col className="col-md-6">
          <h3 className="text-center">Equipo Visitante - {awayTeam.name}</h3>
          <h5>Alineación:</h5>
          {awayLineUp.map((player) => (
            <Container
              key={player.playerId}
              className="player d-flex align-items-center"
            >
              <Row className="ml-3 align-items-center">
                <Col className="d-flex align-items-center">
                  <img
                    src={player.photoUrl}
                    alt={player.name}
                    className="player-photo ml-3"
                    style={{ width: "2.5rem", height: "2.5rem" }}
                  />
                </Col>
                <Col>
                  <strong>
                    {player.firstName} {player.lastName}
                  </strong>
                  <p>{player.position}</p>
                </Col>
                {renderPlayerActions(player, "away")}
              </Row>
            </Container>
          ))}
          {!lineUpSubmitted && (
            <>
              <h5>Jugadores Disponibles:</h5>
              {renderAvailablePlayers("away", awayTeam.players, awayLineUp)}
            </>
          )}
        </Col>
      </Row>

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
                !homeLineUp.some((l) => l.playerId === p.playerId) &&
                !awayLineUp.some((l) => l.playerId === p.playerId)
            )
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
