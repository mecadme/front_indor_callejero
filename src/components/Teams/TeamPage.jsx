import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {Badge, Card, Col, Container, Row } from "react-bootstrap";
import EmptyData from "../Administration/EmptyData";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const TeamGroupEnum = {
  A1: "Grupo A",
  A2: "Grupo A",
  A3: "Grupo A",
  A4: "Grupo A",
  A5: "Grupo A",
  B1: "Grupo B",
  B2: "Grupo B",
  B3: "Grupo B",
  B4: "Grupo B",
  B5: "Grupo B",
};

const PlayerPositionEnum = {
  GOALKEEPER: "PORTERO",
  DEFENDER: "DEFENSA",
  MIDFIELDER: "MEDIOCAMPO",
  ATTACKER: "DELANTERO",
};

const PlayerStatusEnum = {
  ACTIVE: "ACTIVO",
  STARTER: "TITULAR",
  DISABLED: "LESIONADO",
  INACTIVE: "SUSPENDIDO",
};

const PlayerCard = ({ player }) => {
  const { firstName, lastName, photoUrl, jerseyNumber, position, status } =
    player;
  const navigate = useNavigate();

  const handlePlayerClick = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <Col xs={6} key={player.playerId} className="mb-4 text-center d-flex align-items-center">
      <Card
        style={{ width: "18rem", alignItems: "center", cursor: "pointer" }}
        onClick={() => handlePlayerClick(player.playerId)}
      >
        <Card.Img
          variant="top"
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          style={{ width: "5rem", height: "5rem", objectFit: "cover" }}
        />
        <Card.Body className="text-center">
          <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
          <Card.Text>
            <p># {jerseyNumber}</p>
            <p>
              {PlayerPositionEnum[position] || position}
            </p>
            <Badge>{PlayerStatusEnum[status] || status}</Badge>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

const TeamPage = ({ teams }) => {
  const { teamId } = useParams();
  const team = teams.find((team) => team.teamId === parseInt(teamId));

  if (!team) {
    return <EmptyData message="El equipo no existe" />;
  }

  const { name, neighborhood, teamGroup, logoUrl, players, color } = team;

  return (
    <Container fluid>
      <Header />
      <Container className="mt-4">
        <Card>
          <Card.Header style={{ backgroundColor: color }}>
            <Row className="align-items-center">
              <Col xs={12} md={6} className="text-center">
                <Card.Img
                  variant="top"
                  src={logoUrl}
                  alt={name}
                  style={{ width: "15rem", height: "15rem", margin: "1rem" }}
                />
              </Col>
              <Col xs={12} md={6} className="text-center">
                <h2>{neighborhood.toUpperCase()}</h2>
                <h1>{name}</h1>
                <h3>{TeamGroupEnum[teamGroup] || teamGroup}</h3>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            {players.length > 0 ? (
              <Container>
                <h3 className="text-center mb-4">Jugadores</h3>
                <Row className="justify-content-center">
                  {players.map((player) => (
                    <PlayerCard key={player.playerId} player={player} />
                  ))}
                </Row>
              </Container>
            ) : (
              <EmptyData message="No hay jugadores disponibles para este equipo" />
            )}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </Container>
  );
};

export default TeamPage;
