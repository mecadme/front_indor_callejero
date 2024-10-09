import React from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import MatchStats from "./MatchStats";

const MatchOverview = ({ matchDetails, matchStats }) => {
  const { homeTeam, awayTeam } = matchDetails;

  const renderPlayers = (players, color, position) => {
    players = players.sort((a, b) => a.jerseyNumber - b.jerseyNumber);
    const Circle = ({ color }) => (
        <svg width="50" height="50">
          <circle cx="25" cy="25" r="8" fill={color} />
        </svg>
      );

    return (
      <ListGroup className="players-list mt-3">
        {players.map((player) => (
          <ListGroup.Item
            key={player.jerseyNumber}
            className="d-flex align-items-center"
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
              <span className="player-number" style={{ fontSize: "0.75rem" }}>
                {player.jerseyNumber}{" "}
              </span>

              <span className="player-name" style={{ fontSize: "1rem" }}>
                {player.firstName.toUpperCase()} {player.lastName.toUpperCase()}
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

  return (
    <Container>
      <Row>
        <Col xs={3} md={3} lg={3}>{renderPlayers(homePlayers, homeTeam.color, "left")}</Col>
        <Col xs={6} md={6} lg={6}>
        <p
            className="text-center text-md-left"
            style={{ fontWeight: "bold", margin: "0", fontSize: "1.5rem" }}
          >
            ESTADÍSTICAS
          </p>
          <MatchStats
            matchStats={matchStats}
            homeTeamId={homeTeam.teamId}
            awayTeamId={awayTeam.teamId}
          />
        </Col>
        <Col xs={3} md={3} lg={3}>{renderPlayers(awayPlayers, awayTeam.color, "right")}</Col>
      </Row>
    </Container>
  );
};

export default MatchOverview;
