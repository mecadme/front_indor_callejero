import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Form, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetMatches } from "../../api/Service/MatchService";
import EmptyData from "../Administration/EmptyData";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Loading from "../Utils/Loading";

const Matches = () => {
  const {
    data: matches = [],
    loading: isLoading,
    error,
    getMatches,
  } = useGetMatches();
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 4;

  const navigate = useNavigate();

  useEffect(() => {
    getMatches();
  }, []);

  useEffect(() => {
    if (Array.isArray(matches)) {
      const reversedMatches = [...matches].reverse(); // Invierte el array
      setFilteredMatches(reversedMatches);
    }
  }, [matches]);

  useEffect(() => {
    if (Array.isArray(matches)) {
      let filtered = [...matches];
      
      if (teamFilter) {
        filtered = filtered.filter(
          (match) =>
            match.homeTeam.name.includes(teamFilter) ||
            match.awayTeam.name.includes(teamFilter)
        );
      }
      setFilteredMatches(filtered.reverse());
    }
  }, [teamFilter, matches]);

  const handleMatchClick = (matchId) => {
    navigate(`/result/${matchId}`);
  };

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(
    indexOfFirstMatch,
    indexOfLastMatch
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!matches || matches.length === 0) {
    return (
      <Container fluid>
        <Header />
        <EmptyData />
        <Footer />
      </Container>
    );
  }

  return (
    <Container fluid>
      <Header />
      <Container className="container mt-5">
        <h2 className="text-center mb-4">Partidos</h2>

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="filterByTeam">
              <Form.Label>Filtrar por equipo</Form.Label>
              <Form.Control
                as="select"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <option value="">Todos los equipos</option>
                {matches &&
                  [
                    ...new Set(
                      matches.flatMap((match) => [
                        match.homeTeam.name,
                        match.awayTeam.name,
                      ])
                    ),
                  ].map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Pagination>
          {[...Array(Math.ceil(filteredMatches.length / matchesPerPage))].map(
            (_, idx) => (
              <Pagination.Item key={idx + 1} onClick={() => paginate(idx + 1)}>
                {idx + 1}
              </Pagination.Item>
            )
          )}
        </Pagination>

        <Row>
          {currentMatches.map((match) => (
            <Col
              key={match.matchId}
              md={6}
              className="mb-4"
              onClick={() => handleMatchClick(match.matchId)}
              style={{
                cursor: "pointer",
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
                    <h5 style={{ color: match.homeTeam.color }}>
                      {match.homeTeam.name}
                    </h5>
                  </div>
                  <span>VS</span>
                  <div className="d-flex align-items-center">
                    <h5 style={{ color: match.awayTeam.color }}>
                      {match.awayTeam.name}
                    </h5>
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
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(match.schedule.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Lugar:</strong> {match.schedule.place}
                  </p>
                  <Row>
                    <Col md={6}>
                      <h6>Jugadores del {match.homeTeam.name}</h6>
                      <ul className="list-unstyled">
                        {match.homeTeam.players.map((player) => (
                          <li
                            key={player.playerId}
                            className="d-flex align-items-center my-2"
                          >
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
                          <li
                            key={player.playerId}
                            className="d-flex align-items-center my-2"
                          >
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
                  <p>
                    <strong>Duración:</strong> {match.duration} hrs
                  </p>
                  <p>
                    <strong>Fase:</strong> {match.phase}
                  </p>
                  <p>
                    <strong>Estado:</strong> {match.status}
                  </p>
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
