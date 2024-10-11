import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Form,
  Pagination,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetMatches } from "../../api/Service/MatchService";
import EmptyData from "../Administration/EmptyData";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Loading from "../Utils/Loading";
import StyleUtils from "../Utils/StyleUtils";
import "./css/Matches.css";
import PageBanner from "../Utils/PageBanner";

const Matches = () => {
  const {
    data: matches = [],
    loading: isLoading,
    error,
    getMatches,
  } = useGetMatches();

  const [filteredMatches, setFilteredMatches] = useState([]);
  const [teamFilter, setTeamFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();
  const matchesPerPage = 4;

  const MatchStatusEnum = useMemo(
    () => ({
      NOT_STARTED: "POR JUGARSE",
      STARTED: "EN CURSO",
      PAUSED: "PAUSADO",
      FINISHED: "FINALIZADO",
    }),
    []
  );

  const PhaseEnum = useMemo(
    () => ({
      PRELIMINARY: "GRUPOS",
      QUARTER_FINAL: "CUARTOS DE FINAL",
      SEMI_FINAL: "SEMIFINALES",
      FINAL: "FINAL",
    }),
    []
  );

  const icons = {
    calendar: "https://cdn-icons-png.flaticon.com/512/2838/2838779.png",
    stadium: "https://cdn-icons-png.flaticon.com/512/6409/6409911.png",
    duration: "https://cdn-icons-png.flaticon.com/512/17899/17899953.png",
  };

  const navigate = useNavigate();

  useEffect(() => {
    getMatches();
  }, []);

  useEffect(() => {
    if (Array.isArray(matches)) {
      const filtered = matches.filter((match) =>
        teamFilter
          ? match.homeTeam.neighborhood.includes(teamFilter) ||
            match.awayTeam.neighborhood.includes(teamFilter)
          : true
      );
      setFilteredMatches(filtered.reverse());
    }
  }, [teamFilter, matches]);

  const handleMatchClick = (matchId) => {
    navigate(`/result/${matchId}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(
    indexOfFirstMatch,
    indexOfLastMatch
  );

  const TeamHeader = ({ team, side }) => {
    const lighterTeamColor = lightenColor(team.color, 40);
    const teamTextColor = getTextColor(lighterTeamColor);
    const zigzagSvg = zigZagSvg(team.color, lighterTeamColor);

    return (
      <div
        className={`d-flex align-items-center ${side}-team`}
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            zigzagSvg
          )}")`,
          backgroundSize: "cover",
          width: "100%",
          display: "flex",
          justifyContent: side === "home" ? "flex-start" : "flex-end",
          textAlign: side === "home" ? "left" : "right",
          transition: "background-image 0.2s ease, color 0.2s ease",
        }}
      >
        {side === "home" && (
          <>
            <img
              src={team.logoUrl}
              alt={team.neighborhood}
              width="50"
              height="50"
              className="mr-2"
            />
            <h5
              style={{
                color: teamTextColor,
                fontSize: "5rem",
                fontWeight: "bold",
              }}
            >
              {team.name}
            </h5>
          </>
        )}

        {side === "away" && (
          <>
            <h5
              style={{
                color: teamTextColor,
                fontSize: "5rem",
                fontWeight: "bold",
              }}
            >
              {team.name}
            </h5>
            <img
              src={team.logoUrl}
              alt={team.neighborhood}
              width="50"
              height="50"
              className="ml-2"
            />
          </>
        )}
      </div>
    );
  };

  const PlayerList = ({ players, teamName, side }) => (
    <Col
      md={6}
      className={`players d-flex flex-column ${
        side === "home" ? "align-items-start" : "align-items-end"
      }`}
    >
      <h3>{teamName}</h3>
      <ul className={`list-unstyled `}>
        {players
          
          .map((player) => (
            <li
              key={player.playerId}
              className="d-flex align-items-center my-0"
            >
              {side === "home" ? (
                <Row className="w-100 m-1">
                  <Col md={4}>
                    <img
                      src={player.photoUrl}
                      alt={player.firstName}
                      width="30"
                      height="30"
                      className="mx-2"
                    />
                  </Col>
                  <Col md={8}>
                    {player.firstName[0]}. {player.lastName}
                  </Col>
                </Row>
              ) : (
                <Row className="w-100 m-1">
                  <Col md={8}>
                    {player.firstName[0]}. {player.lastName}
                  </Col>
                  <Col md={4} className="d-flex justify-content-start">
                    <img
                      src={player.photoUrl}
                      alt={player.firstName}
                      width="30"
                      height="30"
                      className="mx-2"
                    />
                  </Col>
                </Row>
              )}
            </li>
          ))}
      </ul>
    </Col>
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container fluid className="mt-4">
        <Alert variant="danger" className="text-center">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  if (!matches?.length) {
    return (
      <Container fluid>
        <Header />
        <EmptyData />
        <Footer />
      </Container>
    );
  }

  return (
    <Container fluid className="mt-2 matches">
      <Header />
      <Container className="banner-container">
        <PageBanner title={"Partidos"} />

        <Row className="my-4">
          <Col md={12}>
            <Form.Group controlId="filterByTeam">
              <Form.Label>Filtrar por equipo</Form.Label>
              <Form.Control
                as="select"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <option value="">Todos los equipos</option>
                {[
                  ...new Set(
                    matches.flatMap((match) => [
                      match.homeTeam.neighborhood,
                      match.awayTeam.neighborhood,
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

        <Pagination className="custom-pagination">
          {[...Array(Math.ceil(filteredMatches.length / matchesPerPage))].map(
            (_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => paginate(idx + 1)}
                className="custom-pagination-item"
              >
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
            >
              <Card className="hover-card" style={{ cursor: "pointer" }}>
                <Card.Header className="d-flex justify-content-between align-items-center p-0">
                  <div className="d-flex flex-grow-1 justify-content-start">
                    <TeamHeader team={match.homeTeam} side="home" />
                  </div>
                  <div className="mx-3 text-center">
                    <strong>VS</strong>
                  </div>
                  <div className="d-flex flex-grow-1 justify-content-end">
                    <TeamHeader team={match.awayTeam} side="away" />
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row className="mb-3 text-center date-place">
                    <Col>
                      <img
                        src={icons.calendar}
                        alt="date-icon"
                        className="icon-size"
                      />{" "}
                      {new Date(match.schedule.date).toLocaleDateString()}
                    </Col>
                    <Col className="place-col">
                      <img
                        src={icons.stadium}
                        alt="location-icon"
                        className="icon-size"
                      />{" "}
                      {match.schedule.place}
                    </Col>
                  </Row>

                  <Row>
                    <PlayerList
                      players={match.homeTeam.players}
                      teamName={match.homeTeam.neighborhood}
                      side="home"
                    />
                    <PlayerList
                      players={match.awayTeam.players}
                      teamName={match.awayTeam.neighborhood}
                      side="away"
                    />
                  </Row>
                </Card.Body>
                <Card.Footer className="text-muted text-center">
                  {match.status === "NOT_STARTED" && (<p>
                    <img
                      src={icons.duration}
                      alt="clock-icon"
                      className="icon-size"
                    />
                    {match.duration} min
                  </p>)}
                  <p>
                    <strong>Fase:</strong>{" "}
                    {PhaseEnum[match.phase] || match.phase}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    {MatchStatusEnum[match.status] || match.status}
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
