import React, { useState, useEffect } from "react";
import {
  Alert,
  Badge,
  Card,
  Col,
  Container,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import EmptyData from "../../Administration/EmptyData";

const PlayerStatistics = ({ eventType, name, limit }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const PLAYER_STATISTICS_URL = `/player-statistics/${eventType}`;

  useEffect(() => {
    axiosPrivate
      .get(PLAYER_STATISTICS_URL)
      .then((response) => {
        setPlayers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al cargar los datos");
        setLoading(false);
      });
  }, [eventType]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" /> Cargando estadísticas...
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="text-center">{error}</Alert>;
  }

  if (players.length === 0) {
    return <EmptyData message={`No hay datos de ${name} para mostrar`} />;
  }

  const displayedPlayers = limit ? players.slice(0, limit) : players;

  return (
    <Container className="mt-4">
      <Col>
        {displayedPlayers.map((player, index) => (
          <Row
            key={player.playerId}
            className="shadow-sm rounded mb-4"
            style={{
              backgroundColor: player.teamColor,
              padding: "1rem",
              margin: "0",
              borderRadius: "10px",
            }}
          >
            <Row className="align-items-center">
              <Col xs={4} className="text-center">
                <Image
                  src={player.teamLogoUrl}
                  alt="Team Logo"
                  style={{
                    width: "4rem",
                    height: "4rem",

                  }}
                  className="img-fluid"
                />
              </Col>
              <Col xs={6} className="d-flex flex-column align-items-start">
                {index === 0 && (
                  <Container>
                  <Image
                  src={player.photoUrl}
                  alt="Mejor jugador"
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    marginTop: "10px",
                  }}
                />
                <br />
                  <Badge bg="warning" className="mb-2">
                    Mejor Jugador
                  </Badge></Container>
                )}
                <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                  {player.firstName} {player.lastName}
                </div>
              </Col>
              <Col xs={2} className="text-center">
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    color: "#343a40",
                  }}
                >
                  {player.eventCount || 0}
                </div>
              </Col>
            </Row>
          </Row>
        ))}
      </Col>
    </Container>
  );
};

export default PlayerStatistics;
