import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { renderIconBanner } from "../Utils/RenderIcon";
import StyleUtils from "../Utils/StyleUtils";
import FinalScore from "./FinalScore";

const BannerEvent = React.memo(({ event, assistEvent, assistPlayer }) => {
  const { eventType, minute, playerFirstName, playerLastName } = event;

  if (!eventType || minute == null) {
    return null;
  }

  const playerName = `${playerFirstName[0]}. ${playerLastName}`;

  return (
    <Container
      className="banner-event"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="minute"
        style={{
          fontWeight: "bold",
          fontSize: "0.75rem",
          marginRight: "0.5rem",
        }}
      >
        {minute}'
      </div>
      <div className="event-details">
        <div
          className="player-{eventType}`"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div>
            <img
              src={renderIconBanner(eventType, event)}
              alt={eventType}
              className="event-icon"
              style={{ width: "1rem", height: "1rem" }}
            />
            <div
              className="player-name"
              style={{ fontWeight: "bold", fontSize: "0.75rem" }}
            >
              {playerName}
            </div>
          </div>
        </div>
        {assistPlayer && (
          <div
            className="assist"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src={renderIconBanner(assistEvent.eventType, assistEvent)}
              alt={`Assist by ${assistPlayer}`}
              className="assist-icon"
              style={{ width: "1rem", height: "1rem" }}
            />
            <div style={{ fontWeight: "bold", fontSize: "0.75rem" }}>
              {assistPlayer}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
});

const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();

const grayZigZagSvg = zigZagSvg("#b6bdc0", "#D3D3D3");

const ResultBanner = ({ events, matchDetails }) => {
  const { phase, homeTeam, awayTeam } = matchDetails;

  const phaseLabel =
    {
      PRELIMINARY: "FASE DE GRUPOS",
      PLAYOFF: "Eliminatorias",
    }[phase] || "Fase no disponible";

  const filteredEvents = events.filter(
    (event) => event.eventType === "GOAL" || event.eventType === "ASSIST"
  );

  const groupEventsByMinuteAndTeam = () => {
    const groupedEvents = {};

    filteredEvents.forEach((event) => {
      const key = `${event.teamId}-${event.minute}`;
      if (!groupedEvents[key]) {
        groupedEvents[key] = { goals: [], assists: [] };
      }

      if (event.eventType === "GOAL") {
        groupedEvents[key].goals.push(event);
      } else if (event.eventType === "ASSIST") {
        groupedEvents[key].assists.push(event);
      }
    });

    return groupedEvents;
  };

  const groupedEvents = groupEventsByMinuteAndTeam();

  const renderTeamEvents = (team, direction) => {
    const lighterColor = lightenColor(team.color, 30);
    const defaultTextColor = getTextColor("#b6bdc0");
    const hoverTextColor = getTextColor(team.color);
    const zigZagBackground = zigZagSvg(team.color, lighterColor);

    const [hovered, setHovered] = useState(false);

    return (
      <Col>
        <Row
          className="p-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
              hovered ? zigZagBackground : grayZigZagSvg
            )}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            color: hovered ? hoverTextColor : defaultTextColor,
            transition: "background-image 0.2s ease, color 0.2s ease",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <h2
            className="text-center text-md-left"
            style={{ fontWeight: "bold", margin: "0" }}
          >
            {team.name.toUpperCase()}
          </h2>
        </Row>
        <Row
          className="team-events-row d-flex flex-wrap p-0 m-0"
          style={{
            flexDirection: direction === "right" ? "row-reverse" : "row",
          }}
        >
          {Object.keys(groupedEvents)
            .filter((key) => groupedEvents[key].goals.length)
            .filter((key) => key.startsWith(`${team.teamId}`))
            .sort((a, b) => a.split("-")[1] - b.split("-")[1])
            .map((key, index) => {
              const eventsAtMinute = groupedEvents[key];
              const minute = key.split("-")[1];

              return eventsAtMinute.goals.map((goalEvent, goalIndex) => {
                const assistEvent = eventsAtMinute.assists[goalIndex] || null;
                const assistPlayer = assistEvent
                  ? `${assistEvent.playerFirstName[0]}. ${assistEvent.playerLastName}`
                  : null;

                return (
                  <Col xs={12} sm={6} md={4} lg={3} key={`${key}-${goalIndex}`}>
                    <BannerEvent
                      event={goalEvent}
                      assistEvent={assistEvent}
                      assistPlayer={assistPlayer}
                    />
                  </Col>
                );
              });
            })}
        </Row>
      </Col>
    );
  };

  return (
    <Container fluid className="result-banner p-0">
      <Row className="text-white p-0 " style={{ backgroundColor: "#33173C" }}>
        <h2 className="text-center p-0 m-1" style={{ fontSize: "3rem" }}>
          RESULTADOS / {phaseLabel}
        </h2>
      </Row>
      <Row className="py-0">
        <Col xs={12} md={5}>
          {homeTeam && <Row>{renderTeamEvents(homeTeam, "right")}</Row>}
        </Col>
        <Col
          xs={12}
          md={2}
          className="d-flex justify-content-center align-items-center p-0"
        >
          <FinalScore events={events} homeTeam={homeTeam} awayTeam={awayTeam} />
        </Col>
        <Col xs={12} md={5}>
          {awayTeam && <Row>{renderTeamEvents(awayTeam, "left")}</Row>}
        </Col>
      </Row>
      <Row className="text-black p-0 ">
        <h2 className="text-center p-0 m-1" style={{ fontSize: "1.3rem" }}>
          RESUMEN
        </h2>
      </Row>
    </Container>
  );
};

export default ResultBanner;
