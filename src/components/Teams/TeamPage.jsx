import React from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import EmptyData from "../Administration/EmptyData";

// Componente separado para la tarjeta de jugador
const PlayerCard = ({ player }) => {
  const { firstName, lastName, photoUrl, jerseyNumber, position, status } = player;

  return (
    <Col key={player.playerId} className="mb-4">
      <Card style={{ width: "18rem", alignItems: "center" }}>
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
console.log(team) // Imprime el equipo correspondiente al ID indicado
  if (!team) {
    return <EmptyData message="El equipo no existe" />;
  }

  const { name, neighborhood, teamGroup, logoUrl,  players, color } = team;

  return (
    <Container className="mt-4" style={{ display: "flex", justifyContent: "space-evenly"}}>
      <Card>
        <Card.Header style={{ display: "flex", justifyContent: "space-evenly", backgroundColor: color }}>
          <Row className="align-items-center justify-content-center w-100 display flex">
            <Col className="p-4 m-7 b-3">
              <h1>{name}</h1>
              <h2>Barrio: {neighborhood}</h2>
              <h3>Grupo: {teamGroup}</h3>
            </Col>
            <Col className="text-right">
              <Card.Img
                variant="top"
                src={logoUrl}
                alt={name}
                style={{ width: "15rem", height: "15rem", margin: "1rem" }}
              />
            </Col>
          </Row>
        </Card.Header>
        <Card.Body >
          {players.length ? (
            <Container style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-evenly" }}>
              <h3 className="text-center mb-4">Jugadores</h3>
              <Row >
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
  );
};

export default TeamPage;
