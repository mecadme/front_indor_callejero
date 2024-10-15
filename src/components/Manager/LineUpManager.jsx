import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Modal,
  Row,
} from "react-bootstrap";
import {
  useChangePlayer,
  useRegisterMatchEvent,
  useSetLineUp,
} from "../../api/Service/MatchService";
import {
  useInjurePlayer,
  useUpdatePlayer,
} from "../../api/Service/PlayerService";

import "./css/LineUpManager.css";

const LineUpManager = ({ matchId, homeTeam, awayTeam, onLineUpSubmitted }) => {
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

  const PlayerPositionEnum = {
    GOALKEEPER: "Portero",
    DEFENDER: "Defensa",
    MIDFIELDER: "Mediocampo",
    ATTACKER: "Delantero",
  };

  const MAX_PLAYERS = 6;
  const icons = {
    goal: "https://cdn-icons-png.flaticon.com/512/5043/5043542.png",
    assist: "https://cdn-icons-png.flaticon.com/512/6664/6664856.png",
    yellowCard: "https://cdn-icons-png.flaticon.com/512/3363/3363491.png",
    redCard: "https://cdn-icons-png.flaticon.com/512/451/451718.png",
    substitution: "https://cdn-icons-png.flaticon.com/512/2716/2716280.png",
    injury: "https://cdn-icons-png.flaticon.com/512/9962/9962365.png",
  };

  useEffect(() => {
    resetLineUps();
  }, [matchId]);

  const resetLineUps = () => {
    setHomeLineUp([]);
    setAwayLineUp([]);
    setLineUpSubmitted(false);
  };

  const isSubmitDisabled = () => {
    const homeGoalkeeper = homeLineUp.find(
      (player) => player.position === "GOALKEEPER"
    );
    const awayGoalkeeper = awayLineUp.find(
      (player) => player.position === "GOALKEEPER"
    );
    const homeValid = homeLineUp.length >= 3 && homeGoalkeeper;
    const awayValid = awayLineUp.length >= 3 && awayGoalkeeper;
    return !(homeValid && awayValid);
  };

  const handleEvent = (playerId, eventType, cardName = null) => {
    registerMatchEvent(matchId, {
      playerId,
      eventType,
      ...(cardName && { cardName }),
    });
  };

  const handleSubstitution = (team, playerId) => {
    setCurrentTeam(team);
    setSubPlayerId(playerId);
    setShowModal(true);
  };

  const confirmSubstitution = (newPlayerId) => {
    const outPlayerId = subPlayerId;
    const teamId = getTeamId(currentTeam);
    const newPlayer = findPlayer(currentTeam, newPlayerId);

    changePlayer(matchId, { outPlayerId, inPlayerId: newPlayerId, teamId });
    updatePlayer(newPlayerId, { status: "STARTER" });

    updateLineUp(currentTeam, outPlayerId, {
      ...findPlayer(currentTeam, outPlayerId),
      isSubstituted: true,
    });

    updateLineUp(currentTeam, null, newPlayer);

    setShowModal(false);
  };

  const handleInjury = (team, playerId) => {
    if (window.confirm("¿Confirmas que el jugador está lesionado?")) {
      injurePlayer(playerId)
        .then(() => {
          updateLineUp(team, playerId, {
            ...findPlayer(team, playerId),
            isInjured: true,
          });
          handleSubstitution(team, playerId);
        })
        .catch(() => {
          alert("Error al marcar al jugador como lesionado.");
        });
    }
  };

  const addPlayerToLineUp = (team, player) => {
    const lineup = team === "home" ? homeLineUp : awayLineUp;

    if (lineup.length >= MAX_PLAYERS) {
      alert(
        `No puedes añadir más de ${MAX_PLAYERS} jugadores en el equipo ${team}.`
      );
      return;
    }

    updateLineUp(team, null, player, true);
    updatePlayer(player.playerId, { status: "STARTER" });
  };

  const removePlayerFromLineUp = (team, playerId) => {
    const updateFunc = team === "home" ? setHomeLineUp : setAwayLineUp;
    updateFunc((prevLineUp) => prevLineUp.filter((player) => player.playerId !== playerId));
  };

  const updateLineUp = (team, outPlayerId, newPlayer, addAtStart = false) => {
    const updateFunc = team === "home" ? setHomeLineUp : setAwayLineUp;
    updateFunc((prevLineUp) => {
      let updatedLineUp = prevLineUp
        .map((player) =>
          player.playerId === outPlayerId
            ? { ...player, isSubstituted: true }
            : player
        )
        .filter((player) => player.playerId !== outPlayerId);

      if (newPlayer) {
        updatedLineUp = addAtStart
          ? [newPlayer, ...updatedLineUp]
          : [...updatedLineUp, newPlayer];
      }

      return updatedLineUp;
    });
  };

  const submitLineUp = () => {
    const payload = {
      homePlayers: homeLineUp.map((p) => ({ playerId: p.playerId })),
      awayPlayers: awayLineUp.map((p) => ({ playerId: p.playerId })),
    };

    setLineUp(matchId, payload)
      .then(() => {
        alert("Alineación enviada correctamente");
        setLineUpSubmitted(true);
        if (onLineUpSubmitted) {
          onLineUpSubmitted(true);
        }
      })
      .catch(() => alert("Error al enviar la alineación"));
  };

  const renderPlayerActions = (player, team) => {
    const disabled = player.isInjured || player.isSubstituted || !lineUpSubmitted;

    return (
      <ButtonGroup aria-label="player-actions" size="sm">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEvent(player.playerId, "goal")}
          disabled={disabled}
        >
          <img src={icons.goal} alt="goal-icon" className="icon-size" />
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => handleEvent(player.playerId, "assist")}
          disabled={disabled}
        >
          <img src={icons.assist} alt="assist-icon" className="icon-size" />
        </Button>
        <DropdownButton
          as={ButtonGroup}
          variant="warning"
          title="Tarjeta"
          size="sm"
          disabled={disabled}
        >
          <Dropdown.Item
            onClick={() => handleEvent(player.playerId, "card", "YELLOW")}
          >
            <img
              src={icons.yellowCard}
              alt="yellow-card-icon"
              className="icon-size"
            />
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleEvent(player.playerId, "card", "RED")}
          >
            <img
              src={icons.redCard}
              alt="red-card-icon"
              className="icon-size"
            />
          </Dropdown.Item>
        </DropdownButton>
        <Button
          variant="outline-info"
          size="sm"
          onClick={() => handleSubstitution(team, player.playerId)}
          disabled={disabled}
        >
          <img src={icons.substitution} alt="sub-icon" className="icon-size" />
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => handleInjury(team, player.playerId)}
          disabled={disabled}
        >
          <img src={icons.injury} alt="injury-icon" className="icon-size" />
        </Button>
      </ButtonGroup>
    );
  };

  const renderLineUpSection = (team, teamData, lineUp) => (
    <Col className="col-md-6">
      <h3 className="text-center">{teamData.name}</h3>
      <h5>Alineación:</h5>
      {lineUp
        .sort((a, b) => (a.isInjured || a.isSubstituted ? 1 : -1))
        .map((player) => (
          <Container
            key={player.playerId}
            className="player d-flex align-items-center"
          >
            <Row className="ml-3 d-flex align-items-center">
              <Col className="d-flex align-items-center">
                <img
                  src={player.photoUrl}
                  alt={player.name}
                  className="player-photo mr-3"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                />
              </Col>
              <Col>
                <strong>{`${player.firstName} ${player.lastName}`}</strong>
                <p>{PlayerPositionEnum[player.position] || player.position}</p>
              </Col>
              {renderPlayerActions(player, team)}
              {!lineUpSubmitted && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removePlayerFromLineUp(team, player.playerId)}
                  className="ml-2"
                >
                  Quitar
                </Button>
              )}
            </Row>
          </Container>
        ))}
      {!lineUpSubmitted && (
        <>
          <h5>Jugadores Disponibles:</h5>
          {renderAvailablePlayers(team, teamData.players, lineUp)}
        </>
      )}
    </Col>
  );

  const renderAvailablePlayers = (team, players, lineUp) =>
    players
      .filter(
        (p) =>
          (p.status === "ACTIVE" || p.status === "STARTER") &&
          !lineUp.some((l) => l.playerId === p.playerId)
      )
      .map((player) => (
        <div key={player.playerId} className="player d-flex align-items-center">
          <img
            src={player.photoUrl}
            alt={player.name}
            className="player-photo mr-3"
            style={{ width: "2.5rem", height: "2.5rem" }}
          />
          <div className="player-position m-0">
            {`${player.firstName} ${player.lastName}`}
            <p className="player-position m-0">
              {PlayerPositionEnum[player.position] || player.position}
            </p>
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

  const getTeamId = (team) =>
    team === "home" ? homeTeam.teamId : awayTeam.teamId;
  const findPlayer = (team, playerId) =>
    (team === "home" ? homeTeam.players : awayTeam.players).find(
      (player) => player.playerId === playerId
    );

  return (
    <Container fluid className="container line-up-manager">
      <Row className="row">
        {renderLineUpSection("home", homeTeam, homeLineUp)}
        {renderLineUpSection("away", awayTeam, awayLineUp)}
      </Row>
      {!lineUpSubmitted && (
        <div className="text-center my-4">
          <Button
            variant="success"
            onClick={submitLineUp}
            disabled={isSubmitDisabled()}
          >
            Enviar Alineación
          </Button>
        </div>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sustitución de Jugador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Selecciona el nuevo jugador</h5>
          {(currentTeam === "home" ? homeTeam.players : awayTeam.players)
            .filter(
              (p) =>
                (p.status === "ACTIVE" || p.status === "STARTER") &&
                !p.isSubstituted &&
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
                {`${player.firstName} ${player.lastName} - ${PlayerPositionEnum[player.position] || player.position}`}
              </Button>
            ))}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default LineUpManager;
