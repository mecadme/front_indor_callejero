import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Container, Card, ListGroup, Row, Col, Badge } from "react-bootstrap";

const Rounds = ({ RoundsData }) => {
  const navigate = useNavigate();

  // Función para manejar el clic en un partido específico
  const handleMatchClick = (matchId, homeTeam, awayTeam) => {
    navigate(`/result/${matchId}`);
  };

  const handleRoundClick = () => {
    navigate(`/rounds`);
  };

  return (
    <Container fluid>
      <Container className="Rounds">
        {RoundsData.length > 0 ? (
          RoundsData.map((round) => (
            <Card key={round.roundId} className="mb-4 shadow-sm" >
              <Card.Header
                onClick={() => handleRoundClick()}
                style={{cursor: "pointer"}}
                as="h4"
                className="text-center"
              >
                {round.roundName}
              </Card.Header>
              <Card.Body>
                {round.matches.map((match, index) => (
                  <Row key={index} className="mb-3 align-items-center d-flex justify-content-center">
                    
                    <Col md={6}>
                      <ListGroup
                        onClick={() => handleMatchClick(match.matchId)}
                        style={{ cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",

                         }}

                      >
                        <ListGroup.Item className="d-flex justify-content-between align-items-center">
                          {match.place}
                          </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between align-items-center"
                        style={{ gap: "0.25rem", padding: "0.5rem" }}>
                          <span className="team">{match.homeTeam}</span>
                          <Badge pill bg="info" className="mx-2">
                            {match.goalsHomeTeam} - {match.goalsAwayTeam}
                          </Badge>
                          <span className="team">{match.awayTeam}</span>
                        </ListGroup.Item>

                        <ListGroup.Item className="text-center text-muted">
                          <small>
                          {new Date(match.date).toLocaleDateString()}
                          </small>
                        </ListGroup.Item>

                        <ListGroup.Item className="text-center text-muted">
                          <small>
                            Hora: {new Date(match.date).toLocaleTimeString()}
                          </small>
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className="text-center mt-4">
            No se encontraron partidos para la jornada seleccionada.
          </div>
        )}
      </Container>
    </Container>
  );
};

export default Rounds;
