import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { renderIconBanner } from "../Utils/RenderIcon";

const BannerEvent = ({ event, offset }) => {
  const { eventType, minute } = event;

  if (!eventType || minute == null) {
    return null;
  }

  return (
    <div className="banner-event" style={{ transform: `translateX(${offset}%)` }}>
      <img
        src={renderIconBanner(eventType, event)}
        alt={eventType}
        className="event-icon"
      />
      <div className="minute">{minute}'</div>
    </div>
  );
};

const ResultBanner = ({ events, matchDetails }) => {
  const { phase, homeTeam, awayTeam } = matchDetails;

  let phaseLabel;
  if (phase === "PRELIMINARY") {
    phaseLabel = "FASE DE GRUPOS";
  } else if (phase === "PLAYOFF") {
    phaseLabel = "Eliminatorias";
  } else {
    phaseLabel = "Fase no disponible";
  }

  const groupEventsByMinute = () => {
    const groupedEvents = {};
    events.forEach((event) => {
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

  // Filtrar solo los eventos GOAL y ASSIST
  const filteredEvents = events.filter(
    (event) => event.eventType === "GOAL" || event.eventType === "ASSIST"
  );

  const renderTeamEvents = (team, direction) => (
    <Col>
      <Row style={{ backgroundColor: team.color }}>
        <h3 className="text-center">{team.name.toUpperCase()}</h3>
      </Row>
      <Row
        className="team-events-row"
        style={{
          display: "flex",
          flexDirection: direction === "right" ? "row-reverse" : "row", 
        }}
      >
        {filteredEvents
          .filter((event) => event.teamName === team.name)
          .sort((a, b) => a.minute - b.minute) 
          .map((event, index) => {
            const key = event.id || `${event.teamId}-${event.minute}-${index}`;
            const indexInSameMinute = groupedEvents[`${event.teamId}-${event.minute}`].indexOf(event) || 0;
            const offset = calculateOffset(event.minute, indexInSameMinute);
            return (
              <Col xs={1} key={key}>
                <BannerEvent event={event} offset={offset} />
              </Col>
            );
          })}
      </Row>
    </Col>
  );

  return (
    <Container>
      <Row>
        <h2 className="text-center">RESULTADOS / {phaseLabel}</h2>
      </Row>
      <Row>
        <Col>
          {homeTeam && (
            <Row>{renderTeamEvents(homeTeam, "right")}</Row> 
          )}
        </Col>
        <Col>
        </Col>
        <Col>
          {awayTeam && (
            <Row>{renderTeamEvents(awayTeam, "left")}</Row> 
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ResultBanner;
