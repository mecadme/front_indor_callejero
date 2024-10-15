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
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";

const MatchEvents = ({ matchId }) => {
  const { data, error, loading, getLineUp } = useGetLineUp();
  const { registerMatchEvent } = useRegisterMatchEvent();

  const [eventCount, setEventCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEvent, setSubmittedEvent] = useState(null); // Track submitted event

  useEffect(() => {
    if (matchId) {
      getLineUp(matchId);
    }
  }, [matchId]);

  const handleEvent = async (playerId, eventType, cardName = null) => {
    setIsSubmitting(true); // Start loading state
    setSubmittedEvent({ playerId, eventType }); // Store the event to give feedback
    const eventMinutes = Array.from({ length: eventCount }, () => 1); // Always send minute 1

    try {
      for (let min of eventMinutes) {
        await registerMatchEvent(matchId, {
          minute: min,
          playerId,
          eventType,
          ...(cardName && { cardName }),
        });
      }
      setEventCount(1); // Reset event count after successful submission
    } catch (err) {
      console.error("Error registrando evento:", err);
    } finally {
      setIsSubmitting(false); // End loading state
      setSubmittedEvent(null); // Reset submitted event
    }
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
            min={1}
            max={50}
            value={eventCount}
            onChange={(e) => setEventCount(Number(e.target.value))}
          />
        </Col>
      </Form.Group>
      <ButtonGroup aria-label="player-actions" size="sm">
        {Object.entries(events).map(([eventKey, eventValue]) => (
          <Button
            key={eventKey}
            variant={
              isSubmitting && submittedEvent?.playerId === player.playerId && submittedEvent?.eventType === eventKey
                ? "success"
                : "outline-secondary"
            }
            onClick={() => handleEvent(player.playerId, eventKey)}
            disabled={isSubmitting && submittedEvent?.playerId === player.playerId && submittedEvent?.eventType === eventKey}
          >
            {isSubmitting && submittedEvent?.playerId === player.playerId && submittedEvent?.eventType === eventKey
              ? "Enviando..."
              : eventValue}
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message || "Algo salió mal"}</div>;
  }

  if (!data) {
    return <EmptyData message="No existe alineación para este partido..." />;
  }

  const { homeTeam, awayTeam } = data?.match || {};
  console.log(homeTeam, awayTeam);

  return (
    <Tabs defaultActiveKey="homeTeam" id="team-tabs">
      {homeTeam && renderTeamTab(homeTeam, "homeTeam")}
      {awayTeam && renderTeamTab(awayTeam, "awayTeam")}
    </Tabs>
  );
};

export default MatchEvents;
