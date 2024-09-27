import React, { useState, useEffect } from "react";
import { Alert, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const Cards = ({limit}) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const CARDS_URL = "player-statistics/playerCards";

  useEffect(() => {
    axiosPrivate
      .get(CARDS_URL)
      .then((response) => {
        setPlayers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al cargar los datos");
        setLoading(false);
      });
  }, []);

  const displayedPlayers = limit ? players.slice(0, limit) : players;

  const yellowCards = displayedPlayers.filter((player) => player.cardName === "YELLOW");
  const redCards = displayedPlayers.filter((player) => player.cardName === "RED");

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
          <h3>¡Alienta a tu jugador a no cometer faltas!</h3>
          <p>
            Genial no ha habido{" "}
            <strong>
              <h4>Tarjetas</h4>
            </strong>
            . <br />
            ¡Sigue apoyando para mantener un juego limpio!
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

  return (
    <Container className="mt-4">
      <Row>
        {/* Columna izquierda - Tarjetas amarillas */}
        <Col xs={12} md={6}>
          <h3 className="text-center">Tarjetas Amarillas</h3>
          {yellowCards.length === 0 ? (
            <p className="text-center">No hay tarjetas amarillas.</p>
          ) : (
            yellowCards.map((player, index) => (
              <Card key={player.playerId} className="mb-4 shadow-sm">
                <Row>
                  <Col xs={4}>
                    <Card.Img
                      src={player.teamLogoUrl}
                      alt="Team Logo"
                      style={{ width: "100%", objectFit: "contain" }}
                    />
                  </Col>
                  <Col xs={8}>
                    <Card.Body>
                      <Card.Title>
                      {index === 0 && (
                          <img
                            src={player.photoUrl}
                            alt="Jugador"
                            style={{
                              width: "100px",
                              height: "100px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              marginTop: "10px",
                            }}
                          />
                        )}
                        <br />
                        {player.firstName} {player.lastName}
                      </Card.Title>
                      <Card.Text>
                        <strong>Tarjetas: </strong> {player.eventCount} <br />
                        <strong>Equipo: </strong>{" "}
                        <span
                          style={{
                            color: player.teamColor,
                            fontWeight: "bold",
                          }}
                        >
                          {player.teamColor}
                        </span>
                        <br />
                        {/* Mostrar la foto del jugador solo en la primera tarjeta */}
                        
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </Col>

        {/* Columna derecha - Tarjetas rojas */}
        <Col xs={12} md={6}>
          <h3 className="text-center">Tarjetas Rojas</h3>
          {redCards.length === 0 ? (
            <p className="text-center">No hay tarjetas rojas.</p>
          ) : (
            redCards.map((player, index) => (
              <Card key={player.playerId} className="mb-4 shadow-sm">
                <Row>
                  <Col xs={4}>
                    <Card.Img
                      src={player.teamLogoUrl}
                      alt="Team Logo"
                      style={{ width: "100%", objectFit: "contain" }}
                    />
                  </Col>
                  <Col xs={8}>
                    <Card.Body>
                      <Card.Title>
                        {index === 0 && (
                          <img
                            src={player.photoUrl}
                            alt="Jugador"
                            style={{
                              width: "100px",
                              height: "100px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              marginTop: "10px",
                            }}
                          />
                        )}
                        <br />
                        {player.firstName} {player.lastName}
                      </Card.Title>
                      <Card.Text>
                        <strong>Tarjetas: </strong> {player.eventCount} <br />
                        <strong>Equipo: </strong>{" "}
                        <span
                          style={{
                            color: player.teamColor,
                            fontWeight: "bold",
                          }}
                        >
                          {player.teamColor}
                        </span>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Cards;
