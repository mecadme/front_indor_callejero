import React, { useMemo } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useFetchAllPlayersStats from "../../hooks/useFetchAllPlayersStats";
import useFetchAllTeamsStats from "../../hooks/useFetchAllTeamsStats";
import EmptyData from "../Administration/EmptyData";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Loading from "../Utils/Loading";
import PageBanner from "../Utils/PageBanner";
import "./css/Comparisons.css";

const calculatePlayerScore = (playerStats) => {
  return (
    playerStats.goals * 5 +
    playerStats.assists * 4 +
    playerStats.goalsShots * 4 +
    playerStats.passes * 4 +
    playerStats.totalShots * 3 +
    playerStats.minutesPlayed * 1 +
    playerStats.aerials * 1 +
    playerStats.ballStolen * 1 +
    playerStats.clearances * 1 -
    playerStats.yellowCards * 1 -
    playerStats.redCards * 3 +
    playerStats.unbeatenMatches * 2
  );
};

const calculateTeamScore = (teamStats) => {
  return (
    teamStats.goals * 5 +
    teamStats.assists * 4 +
    teamStats.goalsShots * 4 +
    teamStats.passes * 4 +
    teamStats.totalShots * 3 +
    teamStats.minutesPlayed * 1 +
    teamStats.aerials * 1 +
    teamStats.ballStolen * 1 +
    teamStats.clearances * 1 -
    teamStats.yellowCards * 1 -
    teamStats.redCards * 3 +
    teamStats.unbeatenMatches * 2
  );
};

const ComparisonsPage = () => {
  const navigate = useNavigate();
  const {
    allPlayersStats,
    loading: loadingPlayers,
    error: errorPlayers,
  } = useFetchAllPlayersStats();
  const {
    allTeamsStats,
    loading: loadingTeams,
    error: errorTeams,
  } = useFetchAllTeamsStats();

  const bestPlayer = useMemo(() => {
    if (!allPlayersStats || allPlayersStats.length === 0) return null;
    return allPlayersStats.reduce((best, current) => {
      const bestScore = calculatePlayerScore(best);
      const currentScore = calculatePlayerScore(current);
      return currentScore > bestScore ? current : best;
    });
  }, [allPlayersStats]);

  const bestTeam = useMemo(() => {
    if (!allTeamsStats || allTeamsStats.length === 0) return null;
    return allTeamsStats.reduce((best, current) => {
      const bestScore = calculateTeamScore(best);
      const currentScore = calculateTeamScore(current);
      return currentScore > bestScore ? current : best;
    });
  }, [allTeamsStats]);

  if (loadingPlayers || loadingTeams) {
    return <Loading message="Cargando estadísticas..." />;
  }

  if (errorPlayers || errorTeams) {
    return (
      <Container className="mt-4 text-center">
        <Alert variant="danger">Error al cargar las estadísticas.</Alert>
      </Container>
    );
  }

  if (!bestPlayer || !bestTeam) {
    return (
      <Container className="mt-4 text-center">
        <EmptyData message="No hay datos suficientes para mostrar comparaciones." />
      </Container>
    );
  }
  const handlePlayerClick = (playerId) => navigate(`/player/${playerId}`);
  const handleTeamSelection = (teamId) => navigate(`/team/${teamId}`);

  return (
    <Container fluid className="m-0 p-0">
      <Header />
      <Container className="comparisons-page-container p-0">
        <PageBanner title="Comparaciones" />

        <Row className="justify-content-center mt-4">
          {/* Mejor Jugador */}
          <Col xs={12} md={6} className="mb-4">
            <Card className="shadow-sm border-0 rounded-lg modern-card">
              <Card.Header className="text-center bg-gradient-primary text-white rounded-top">
                Mejor Jugador
              </Card.Header>
              <Card.Body className="text-center">
                <Image
                  src={bestPlayer.player.photoUrl}
                  alt={bestPlayer.player.firstName}
                  className="best-player-image"
                  onClick={() => handlePlayerClick(bestPlayer.player.playerId)}
                />
                <h4 className="mt-3 modern-font">
                  {bestPlayer.player.firstName} {bestPlayer.player.lastName}
                </h4>
                <p className="modern-font">
                  <strong>Equipo:</strong> {bestPlayer.teamName}
                </p>
                <p className="modern-font">
                  <strong>Goles:</strong> {bestPlayer.goals}
                  <br />
                  <strong>Asistencias:</strong> {bestPlayer.assists}
                  <br />
                  <strong>Disparos al arco:</strong> {bestPlayer.goalsShots}
                  <br />
                  <strong>Pases:</strong> {bestPlayer.passes}
                </p>
                <p className="modern-font">
                  <strong>Puntuación Total:</strong>{" "}
                  {calculatePlayerScore(bestPlayer)}
                </p>

                <Link to="/comparisons/players">
                  <Button className="mt-3 modern-button">
                    Comparar Jugadores
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Mejor Equipo */}
          <Col xs={12} md={6} className="mb-4">
            <Card className="shadow-sm border-0 rounded-lg modern-card">
              <Card.Header className="text-center bg-gradient-success text-white rounded-top">
                Mejor Equipo
              </Card.Header>
              <Card.Body className="text-center">
                <Image
                  src={bestTeam.teamLogoUrl}
                  alt={bestTeam.teamName}
                  className="best-team-image"
                  onClick={() => handleTeamSelection(bestTeam.teamName.teamId)}
                />
                <h4 className="mt-3 modern-font">{bestTeam.teamName}</h4>
                <p className="modern-font">
                  <strong>Vecindario:</strong> {bestTeam.teamNeighborhood}
                </p>
                <p className="modern-font">
                  <strong>Goles:</strong> {bestTeam.goals}
                  <br />
                  <strong>Disparos al arco:</strong> {bestTeam.goalsShots}
                  <br />
                  <strong>Pases:</strong> {bestTeam.passes}
                  <br />
                  <strong>Porterías Imbatidas:</strong> {bestTeam.aerials}
                </p>
                <p className="modern-font">
                  <strong>Puntuación Total:</strong>{" "}
                  {calculateTeamScore(bestTeam)}
                </p>

                <Link to="/comparisons/teams">
                  <Button className="mt-3 modern-button">
                    Comparar Equipos
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </Container>
  );
};

export default ComparisonsPage;
