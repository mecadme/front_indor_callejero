import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "./css/Timeline.css";

const TimelineEvent = ({ event, offset }) => {
  const { eventType, minute } = event;

  // Función para renderizar el ícono correspondiente al evento
  const renderIcon = () => {
    switch (eventType) {
      case "GOAL":
        return "⚽";
      case "ASSIST":
        return "🅰️";
      case "CARD":
        return event.cardType === "YELLOW" ? "🟨" : "🟥";
      default:
        return "❓";
    }
  };

  const leftPosition = (minute / 40) * 100;

  return (
    <div
      className="timeline-event"
      style={{ left: `${leftPosition}%`, transform: `translateX(${offset}%)` }}
    >
      <span>{renderIcon()}</span>
      <div className="minute">{minute}'</div>
    </div>
  );
};

const Timeline = ({ matchId, homeTeam, awayTeam }) => {
  const axiosPrivate = useAxiosPrivate();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // URL para obtener los eventos del partido
  const MATCH_EVENTS_URL = `/player-statistics/matchEvents/${matchId}`;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchMatchEvents = async () => {
      try {
        const response = await axiosPrivate.get(MATCH_EVENTS_URL, {
          signal: controller.signal,
        });
        if (isMounted) {
          setEvents(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMatchEvents();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, MATCH_EVENTS_URL]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Obtener el logo de los equipos
  const homeTeamLogo = events.find((event) => event.teamName === homeTeam)?.teamLogoUrl;
  const awayTeamLogo = events.find((event) => event.teamName === awayTeam)?.teamLogoUrl;

  // Agrupar los eventos por minuto y por equipo
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

  // Calcular el offset de los eventos que ocurren en el mismo minuto
  const calculateOffset = (minute, indexInSameMinute) => {
    const baseOffset = 5; // Distancia para evitar que los eventos se superpongan
    return baseOffset * indexInSameMinute;
  };

  const renderTeamEvents = (teamName, logoUrl) => (
    <Row className={`timeline-row ${teamName === homeTeam ? "team1-row" : "team2-row"} mb-1`}>
      <Col xs={1} className="team-logo-col">
        {logoUrl && (
          <img src={logoUrl} alt={`${teamName} logo`} className="team-logo" style={{ height: "3rem" }} />
        )}
      </Col>
      <Col xs={11} className="timeline-events">
        {events
          .filter((event) => event.teamName === teamName)
          .map((event, index) => {
            const key = `${event.teamId}-${event.minute}`;
            const indexInSameMinute = groupedEvents[key].indexOf(event);
            const offset = calculateOffset(event.minute, indexInSameMinute);

            return (
              <div
                key={index}
                className="timeline-col"
                style={{
                  position: "absolute",
                  left: `${(event.minute / 40) * 100}%`,
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
    <Container className="timeline-container">
      {renderTeamEvents(homeTeam, homeTeamLogo)}
      <hr style={{ border: "0.2rem solid #111" }} />
      {renderTeamEvents(awayTeam, awayTeamLogo)}
    </Container>
  );
};

export default Timeline;
