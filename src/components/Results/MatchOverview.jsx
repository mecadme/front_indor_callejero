import React, { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import MatchStats from "./MatchStats";
import { format } from "date-fns";
import { useGetRefereeByMatchId } from "../../api/Service/RefereeService";
import "./css/MatchOverview.css";

const MatchOverview = ({ matchDetails, matchStats }) => {
  const { homeTeam, awayTeam } = matchDetails;
  const { data, getRefereeByMatchId } = useGetRefereeByMatchId();

  const renderPlayers = (players, color, position) => {
    players = players.sort((a, b) => a.jerseyNumber - b.jerseyNumber);
    const Circle = ({ color }) => (
      <svg width="25" height="25">
        <circle cx="15" cy="15" r="8" fill={color} />
      </svg>
    );

    return (
      <ListGroup className="players-list mt-3">
        {players.map((player) => (
          <ListGroup.Item
            key={player.jerseyNumber}
            className="players-list d-flex align-items-center"
            style={{
              gap: "0.5rem",
              padding: "0",
              margin: "0",
              border: "none",
              justifyContent: position === "left" ? "flex-start" : "flex-end",
            }}
          >
            <div className="player-info">
              {position === "left" && <Circle color={color} />}
              <span className="player-number" style={{ fontSize: "1.25rem" }}>
                {player.jerseyNumber}{" "}
              </span>

              <span className="player-name" style={{ fontSize: "1rem" }}>
                {player.firstName[0]}. {player.lastName}
              </span>
              {position === "right" && <Circle color={color} />}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  const homePlayers = matchDetails.homeTeam.players;
  const awayPlayers = matchDetails.awayTeam.players;

  const icons = {
    calendar: "https://cdn-icons-png.flaticon.com/512/2838/2838779.png",
    stadium: "https://cdn-icons-png.flaticon.com/512/6409/6409911.png",
    referee: "https://cdn-icons-png.flaticon.com/512/3564/3564381.png",
  };

  useEffect(() => {
    getRefereeByMatchId(matchDetails.matchId);
  }, []);

  const referee =
    (data && data.name && data.name[0] + ". " + data.lastName) || "F. León";

  return (
    <Container className="match-overview-container">
      <Row>
        <Col xs={3} md={3} lg={3}>
          {renderPlayers(homePlayers, homeTeam.color, "left")}
        </Col>
        <Col xs={6} md={6} lg={6}>
          <p className="match-stats text-center">ESTADÍSTICAS</p>
          <MatchStats
            matchStats={matchStats}
            homeTeamId={homeTeam.teamId}
            awayTeamId={awayTeam.teamId}
          />
          <Row>
            <Col className="text-center"
            style={{
              cursor: "pointer",
            }}
            onClick={() => window.open(`https://www.google.com/maps/search/${matchDetails.schedule.place}`, "_blank")}
            
            >
              <img src={icons.stadium} alt="place-icon" className="icon-size" />{" "}
              {matchDetails.schedule.place}
            </Col>
            <Col className="text-center">
              <img src={icons.calendar} alt="date-icon" className="icon-size" />{" "}
              {format(new Date(matchDetails.schedule.date), "dd MMM yy, HH:mm")}
            </Col>
          </Row>
          <Row className="d-flex justify-content-center">
            <Col xs={4} className="text-center">
              <img
                src={icons.referee}
                alt="referee-icon"
                className="icon-size"
              />{" "}
              {referee}
            </Col>
          </Row>
        </Col>
        <Col xs={3} md={3} lg={3}>
          {renderPlayers(awayPlayers, awayTeam.color, "right")}
        </Col>
      </Row>
    </Container>
  );
};

export default MatchOverview;
