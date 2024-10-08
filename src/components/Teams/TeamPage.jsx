import React from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import { Card, Col, Container, Row } from "react-bootstrap";
import EmptyData from "../Administration/EmptyData";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const PlayerCard = ({ player }) => {
  const { firstName, lastName, photoUrl, jerseyNumber, position, status } =
    player;
  const navigate = useNavigate();

  const handlePlayerClick = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <Col key={player.playerId} className="mb-4">
      <Card
        style={{ width: "18rem", alignItems: "center", cursor: "pointer" }}
        onClick={() => handlePlayerClick(player.playerId)}
      >
        <Card.Img
          variant="top"
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          style={{ width: "15rem", height: "15rem", objectFit: "cover" }}
        />
        <Card.Body className="text-center">
          <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
          <Card.Text>
            <p>Número: {jerseyNumber}</p>
            <p>Posición: {position}</p>
            <p>Estado: {status}</p>
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
                <h1>{name}</h1>
                <h2>Barrio: {neighborhood}</h2>
                <h3>Grupo: {teamGroup}</h3>
              </Col>
              <Col xs={12} md={6} className="text-center">
                <Card.Img
                  variant="top"
                  src={logoUrl}
                  alt={name}
                  style={{ width: "15rem", height: "15rem", margin: "1rem" }}
                />
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
