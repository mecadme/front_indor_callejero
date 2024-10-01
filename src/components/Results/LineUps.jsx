import React from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import useFetchLineUp from "../../hooks/useFetchLineUp";
import Loading from "../Utils/Loading";
import Field from "./Field";

import "./css/LineUps.css";

const LineUps = ({ matchDetails }) => {
  const { matchId, homeTeam, awayTeam } = matchDetails;
  const { lineUp, isLoading, error } = useFetchLineUp(matchId);
  console.log(lineUp);

  if (isLoading)
    return (
      <Container>
        <Loading />
      </Container>
    );

  if (error) return <Container>Error: {error}</Container>;

  const renderTeamNames = (team, direction) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: direction === "right" ? "row" : "row-reverse",
          alignItems: "center",
        }}
      >
        <img
          src={team.logoUrl}
          alt={`${team.name} logo`}
          className="team-logo"
          style={{
            width: "4rem",
            height: "4rem",
            marginRight: direction === "right" ? "0.5rem" : "0",
          }}
        />
        <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          {team.name.toUpperCase()}
        </span>
      </div>
    );
  };

  const Circle = ({ color }) => (
    <svg width="50" height="50">
      <circle cx="25" cy="25" r="8" fill={color} />
    </svg>
  );

  const renderPlayers = (players, color, position) => {
    if (!players || players.length === 0) return null;

    players = players.sort((a, b) => a.jerseyNumber - b.jerseyNumber);

    return (
      <ListGroup className="players-list mt-3">
        {players.map((player) => (
          <ListGroup.Item
            key={player.playerId}
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

  return (
    <Container>
      <Row className="mb-0 align-items-center">
        <Col xs={3} md={4} lg={4}>
          {renderTeamNames(homeTeam, "right")}
        </Col>
        <Col xs={6} md={4} lg={4}>
          <p
            className="text-center text-md-left"
            style={{ fontWeight: "bold", margin: "0", fontSize: "1.5rem" }}
          >
            ALINEACIONES
          </p>
        </Col>

        <Col xs={2} md={4} lg={4}>
          {renderTeamNames(awayTeam)}
        </Col>
      </Row>
      <Row>
        <Col xs={3} md={3} lg={2}>
          {lineUp?.homePlayers &&
            renderPlayers(lineUp.homePlayers, homeTeam.color, "left")}
        </Col>
        <Col xs={6} md={6} lg={8} className="d-flex justify-content-center" >
          <Field
            homeTeamColor={homeTeam.color}
            awayTeamColor={awayTeam.color}
          />
        </Col>
        <Col xs={2} md={3} lg={2}>
          {lineUp?.awayPlayers &&
            renderPlayers(lineUp.awayPlayers, awayTeam.color, "right")}
        </Col>
      </Row>
    </Container>
  );
};

export default LineUps;
