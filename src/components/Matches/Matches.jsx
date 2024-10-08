import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import useFetchMatches from '../../hooks/useFetchMatches';
import { Card, Row, Col, Container } from 'react-bootstrap';
import EmptyData from '../Administration/EmptyData';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const { matches, isLoading, error } = useFetchMatches();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Cargando partidos...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!matches || matches.length === 0) {
    return (<Container fluid>
      <Header />
      <EmptyData />
      <Footer />
    </Container>)
  }

  const handleMatchClick = (matchId, homeTeam, awayTeam) => {
    navigate(`/result/${matchId}`);
  };

  return (
    <Container fluid>
      <Header />
    <Container className="container mt-5">
      <h2 className="text-center mb-4">Partidos</h2>
      <Row>
        {matches.map((match) => (
          <Col key={match.matchId} md={6} className="mb-4"
          onClick={() => handleMatchClick(match.matchId)}
          style={{ cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

           }}
          >
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <img
                    src={match.homeTeam.logoUrl}
                    alt={match.homeTeam.name}
                    width="50"
                    height="50"
                    className="mr-2"
                  />
                  <h5 style={{ color: match.homeTeam.color }}>{match.homeTeam.name}</h5>
                </div>
                <span>VS</span>
                <div className="d-flex align-items-center">
                  <h5 style={{ color: match.awayTeam.color }}>{match.awayTeam.name}</h5>
                  <img
                    src={match.awayTeam.logoUrl}
                    alt={match.awayTeam.name}
                    width="50"
                    height="50"
                    className="ml-2"
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <p><strong>Fecha:</strong> {new Date(match.schedule.date).toLocaleDateString()}</p>
                <p><strong>Lugar:</strong> {match.schedule.place}</p>
                <Row>
                  <Col md={6}>
                    <h6>Jugadores del {match.homeTeam.name}</h6>
                    <ul className="list-unstyled">
                      {match.homeTeam.players.map((player) => (
                        <li key={player.playerId} className="d-flex align-items-center my-2">
                          <img
                            src={player.photoUrl}
                            alt={player.firstName}
                            width="30"
                            height="30"
                            className="mr-2"
                          />
                          {player.firstName} {player.lastName}
                        </li>
                      ))}
                    </ul>
                  </Col>
                  <Col md={6}>
                    <h6>Jugadores del {match.awayTeam.name}</h6>
                    <ul className="list-unstyled">
                      {match.awayTeam.players.map((player) => (
                        <li key={player.playerId} className="d-flex align-items-center my-2">
                          <img
                            src={player.photoUrl}
                            alt={player.firstName}
                            width="30"
                            height="30"
                            className="mr-2"
                          />
                          {player.firstName} {player.lastName}
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="text-muted text-center">
                <p><strong>Duración:</strong> {match.duration} hrs</p>
                <p><strong>Fase:</strong> {match.phase}</p>
                <p><strong>Estado:</strong> {match.status}</p>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    <Footer />
    </Container>
  );
};

export default Matches;
