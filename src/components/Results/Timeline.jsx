import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./css/Timeline.css";
import { renderIconTimeline } from "../Utils/RenderIcon";

const TimelineEvent = ({ event, offset }) => {
  const { eventType, minute } = event; 

  if (!eventType || minute == null) {
    return null;
  }

  return (
    <div
      className="timeline-event"
      style={{
        left: `${(minute / 40) * 90}%`,
        transform: `translateX(${offset}%)`,
      }}
    >
      <img
        src={renderIconTimeline(eventType, event)}
        alt={eventType}
        className="event-icon"
      />
      <div className="minute">{minute}'</div>
    </div>
  );
};

const Timeline = ({ events, matchDetails }) => {
  const { homeTeam, awayTeam } = matchDetails;
  const homeTeamLogo = homeTeam?.logoUrl;
  const awayTeamLogo = awayTeam?.logoUrl;

  // Filtramos solo los eventos GOAL, SUBSTITUTION y CARD
  const filteredEvents = events.filter(
    (event) =>
      event.eventType === "GOAL" ||
      event.eventType === "SUBSTITUTION" ||
      event.eventType === "CARD"
  );

  const groupEventsByMinute = () => {
    const groupedEvents = {};
    filteredEvents.forEach((event) => {
      const key = `${event.teamId}-${event.minute}`;
      if (!groupedEvents[key]) {
        groupedEvents[key] = [];
      }
      groupedEvents[key].push(event);
    });
    return groupedEvents;
  };

  const groupedEvents = groupEventsByMinute();

  const calculateOffset = (minute, indexInSameMinute) => {
    const baseOffset = 5;
    return baseOffset * indexInSameMinute;
  };

  const renderTeamEvents = (teamName, logoUrl) => (
    <Row
      className={`timeline-row ${
        teamName === homeTeam?.name ? "team1-row" : "team2-row"
      } mb-1`}
    >
      <Col xs={1} className="team-logo-col">
        {logoUrl && (
          <img src={logoUrl} alt={`${teamName} logo`} className="team-logo" />
        )}
      </Col>
      <Col xs={11} className="timeline-events">
        {filteredEvents
          .filter((event) => event.teamName === teamName)
          .map((event, index) => {
            const key = event.id || `${event.teamId}-${event.minute}-${index}`;
            const indexInSameMinute =
              groupedEvents[`${event.teamId}-${event.minute}`]?.indexOf(
                event
              ) || 0;
            const offset = calculateOffset(event.minute, indexInSameMinute);

            return (
              <div
                key={key} // Nueva clave única
                className="timeline-col"
                style={{
                  left: `${(event.minute / 40) * 90}%`,
                  transform: `translateX(${offset}%)`,
                }}
              >
                <TimelineEvent event={event} offset={offset} />
              </div>
            );
          })}
      </Col>
    </Row>
  );

  return (
    <Container fluid className="timeline-container">
      {renderTeamEvents(homeTeam?.name, homeTeamLogo)}
      <Row className="align-items-center">
        <Col xs={1} className="start-label">
          INICIO
        </Col>
        <Col xs={10} className="text-center position-relative">
          <hr className="timeline-separator" />
          <span className="timeline-time">MT</span>
          <div className="timeline-divider"></div>
        </Col>
        <Col xs={1} className="end-label">
          FIN
        </Col>
      </Row>
      {renderTeamEvents(awayTeam?.name, awayTeamLogo)}
    </Container>
  );
};

export default Timeline;
