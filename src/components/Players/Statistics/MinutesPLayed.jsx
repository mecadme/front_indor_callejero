import React, { useState, useEffect } from "react";
import { Alert, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const MinutesPlayed = ({ limit }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const MINUTES_URL = "player-statistics/minutesPlayed";

  useEffect(() => {
    axiosPrivate
      .get(MINUTES_URL)
      .then((response) => {
        setPlayers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al cargar los datos");
        setLoading(false);
      });
  }, [axiosPrivate]);

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (players.length === 0) {
    return (
      <Container className="mt-4 text-center" style={{ padding: "10rem" }}>
        <Alert variant="info">
          <h3>¡Alienta a tu barrio!</h3>
          <p>
            Pronto se sumarán más{" "}
            <strong>
              <h4>Minutos Jugados</h4>
            </strong>
            . <br />
          </p>
          <div className="mt-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/10368/10368405.png"
              alt="Motivate"
              style={{ width: "200px" }}
            />
          </div>
        </Alert>
      </Container>
    );
  }
  const displayedPlayers = limit ? players.slice(0, limit) : players;

  return (
    <Container className="mt-4">
      <Row>
        {displayedPlayers.map((player) => (
          <Col key={player.playerId} sm={12} md={6} lg={4} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Row>
                  <Col xs={4}>
                    <Card.Img
                      src={player.teamLogoUrl}
                      alt="Team Logo"
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </Col>
                  <Col
                    xs={8}
                    style={{
                      backgroundColor: player.teamColor || "#f8f9fa",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Card.Title>
                      {player.firstName} {player.lastName}
                    </Card.Title>
                    <Card.Text>
                      <strong>Minutos Jugados: </strong>
                      {player.minutesPlayed || 0} <br />
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MinutesPlayed;
