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
    updateLineUp(currentTeam, outPlayerId, newPlayer);
    setShowModal(false);
  };

  const handleInjury = (team, playerId) => {
    if (window.confirm("¿Confirmas que el jugador está lesionado?")) {
      injurePlayer(playerId);
      handleSubstitution(team, playerId);
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

    updateLineUp(team, null, player);
    updatePlayer(player.playerId, { status: "STARTER" });
  };

  const updateLineUp = (team, outPlayerId, newPlayer) => {
    const updateFunc = team === "home" ? setHomeLineUp : setAwayLineUp;
    updateFunc((prevLineUp) =>
      prevLineUp
        .filter((player) => player.playerId !== outPlayerId)
        .concat(newPlayer)
    );
  };

  const removePlayerFromLineUp = (team, playerId) => {
    updateLineUp(team, playerId, null);
    updatePlayer(playerId, { status: "ACTIVE" });
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
      })
      .catch(() => alert("Error al enviar la alineación"));
  };

  const renderPlayerActions = (player, team) => (
    <ButtonGroup aria-label="player-actions" size="sm">
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => handleEvent(player.playerId, "goal")}
      >
        <img src={icons.goal} alt="goal-icon" className="icon-size" />
      </Button>
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => handleEvent(player.playerId, "assist")}
      >
        <img src={icons.assist} alt="assist-icon" className="icon-size" />
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
            src={icons.yellowCard}
            alt="yellow-card-icon"
            className="icon-size"
          />
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => handleEvent(player.playerId, "card", "RED")}
        >
          <img src={icons.redCard} alt="red-card-icon" className="icon-size" />
        </Dropdown.Item>
      </DropdownButton>
      <Button
        variant="outline-info"
        size="sm"
        onClick={() => handleSubstitution(team, player.playerId)}
      >
        <img src={icons.substitution} alt="sub-icon" className="icon-size" />
      </Button>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => handleInjury(team, player.playerId)}
      >
        <img src={icons.injury} alt="injury-icon" className="icon-size" />
      </Button>
    </ButtonGroup>
  );

  const renderLineUpSection = (team, teamData, lineUp) => (
    <Col className="col-md-6">
      <h3 className="text-center">{teamData.name}</h3>
      <h5>Alineación:</h5>
      {lineUp.map((player) => (
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
              <p>{player.position}</p>
            </Col>
            {renderPlayerActions(player, team)}
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
          p.status === "ACTIVE" &&
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
          <div>
            {`${player.firstName} ${player.lastName}`}
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
          <Button variant="success" onClick={submitLineUp}>
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
                {`${player.firstName} ${player.lastName} - ${player.position}`}
              </Button>
            ))}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default LineUpManager;
