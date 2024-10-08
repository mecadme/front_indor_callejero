import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  ButtonGroup,
  Card,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import {
  useRegisterMatchEvent,
  useGetLineUp,
} from "../../api/Service/MatchService";
import Loading from "../Utils/Loading";
import EmptyData from "../Administration/EmptyData";
import RangeSlider from "react-bootstrap-range-slider";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

const MatchEvents = ({ matchId }) => {
  const { data, error, loading, getLineUp } = useGetLineUp();
  const { registerMatchEvent } = useRegisterMatchEvent();

  const [eventCount, setEventCount] = useState(1);
  const [minute, setMinute] = useState(1);

  useEffect(() => {
    getLineUp(matchId);
  }, []);

  const handleEvent = (playerId, eventType, cardName = null) => {
    const eventMinutes = Array.from(
      { length: eventCount },
      (_, index) => minute + index
    );

    eventMinutes.forEach((min) => {
      registerMatchEvent(matchId, {
        minute: Number(min),
        playerId,
        eventType,
        ...(cardName && { cardName }),
      });
    });
  };

  const events = {
    aerial: "Duelos Aéreos",
    ball_stolen: "Robos de Balón",
    clearance: "Despejes",
    goal_shot: "Disparos al Arco",
    pass: "Pases",
    shot: "Disparos Totales",
  };

  const renderPlayerActions = (player) => (
    <div className="player-card my-3">
      <img
        src={player.photoUrl}
        alt={player.firstName}
        className="player-photo"
        style={{ width: "3.5rem", height: "3.5rem" }}
      />
      <div className="player-info">
        <h5>
          {player.firstName} {player.lastName}
        </h5>
        <p>
          {player.position} - #{player.jerseyNumber}
        </p>
      </div>
      <Form.Group as={Row} className="mb-3">
        <Col xs={4}>
          <Form.Label>Múltiples eventos:</Form.Label>
          <Form.Control
            type="number"
            min={0}
            max={50}
            value={eventCount}
            onChange={(e) => setEventCount(Number(e.target.value))}
          />
        </Col>
        <Col xs={8}>
          <Form.Label>Minuto inicial:</Form.Label>
          <RangeSlider
            value={minute}
            min={1}
            max={data?.match?.duration || 40}
            onChange={(e) => setMinute(Number(e.target.value))}
          />
          <Form.Text>
            {minute} - {minute + eventCount - 1}
          </Form.Text>
        </Col>
      </Form.Group>
      <ButtonGroup aria-label="player-actions" size="sm">
        {Object.entries(events).map(([eventKey, eventValue]) => (
          <Button
            key={eventKey}
            variant="outline-secondary"
            onClick={() => handleEvent(player.playerId, eventKey)}
          >
            {eventValue}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );

  const renderTeamTab = (team, teamLabel) => (
    <Tab eventKey={teamLabel} title={team.name}>
      <Card className="mb-3">
        <Card.Img
          variant="top"
          src={team.logoUrl}
          alt={team.name}
          className="team-logo"
        />
        <Card.Body>
          <Card.Title>{team.name}</Card.Title>
          <Card.Text>Barrio: {team.neighborhood}</Card.Text>
        </Card.Body>
      </Card>
      <div className="players-list">
        {team.players.map(renderPlayerActions)}
      </div>
    </Tab>
  );

  if (!data) {
    return <EmptyData message="No existe alineación para este partido..." />;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { homeTeam, awayTeam } = data?.match || {};

  return (
    <Tabs defaultActiveKey="homeTeam" id="team-tabs">
      {homeTeam && renderTeamTab(homeTeam, "homeTeam")}
      {awayTeam && renderTeamTab(awayTeam, "awayTeam")}
    </Tabs>
  );
};

export default MatchEvents;
