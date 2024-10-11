import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Badge,
  Card,
  Col,
  Container,
  Row,
  Tabs,
  Tab,
  ListGroup,
} from "react-bootstrap";
import EmptyData from "../Administration/EmptyData";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useGetEthicsOfficerByTeamId } from "../../api/Service/EthicsOfficerService";
import PageBanner from "../Utils/PageBanner";
import getTeamStyles from "../Utils/TeamBannerStyle";
import useFetchAllTeamsStats from "../../hooks/useFetchAllTeamsStats";

// ENUMS para el equipo, posiciones y estados de jugador
const TeamGroupEnum = {
  A1: "Grupo A",
  A2: "Grupo A",
  A3: "Grupo A",
  A4: "Grupo A",
  A5: "Grupo A",
  B1: "Grupo B",
  B2: "Grupo B",
  B3: "Grupo B",
  B4: "Grupo B",
  B5: "Grupo B",
};

const PlayerPositionEnum = {
  GOALKEEPER: "PORTERO",
  DEFENDER: "DEFENSA",
  MIDFIELDER: "MEDIOCAMPO",
  ATTACKER: "DELANTERO",
};

const PlayerStatusEnum = {
  ACTIVE: "ACTIVO",
  STARTER: "TITULAR",
  DISABLED: "LESIONADO",
  INACTIVE: "SUSPENDIDO",
};

// Define the desired statistics to display
const stats = [
  { label: "GOLES", key: "goals" },
  { label: "ASISTENCIAS", key: "assists" },
  { label: "MINUTOS JUGADOS", key: "minutesPlayed" },
  { label: "DISPAROS AL ARCO", key: "goalsShots" },
  { label: "DISPAROS TOTALES", key: "totalShots" },
  { label: "PASES", key: "passes" },
  { label: "DUELOS AÉREOS", key: "aerials" },
  { label: "ROBOS DE BALÓN", key: "ballStolen" },
  { label: "DESPEJES", key: "clearances" },
  { label: "AMARILLAS", key: "yellowCards" },
  { label: "ROJAS", key: "redCards" },
  { label: "PORTERÍAS IMBATIDAS", key: "unbeatenMatches" },
];

// Componente para mostrar la tarjeta de un jugador
const PlayerCard = ({ player }) => {
  const { firstName, lastName, photoUrl, jerseyNumber, position, status } = player;
  const navigate = useNavigate();

  const handlePlayerClick = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <Col xs={6} key={player.playerId} className="mb-4 text-center d-flex align-items-center">
      <Card
        style={{ width: "18rem", alignItems: "center", cursor: "pointer" }}
        onClick={() => handlePlayerClick(player.playerId)}
      >
        <Card.Img
          variant="top"
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          style={{ width: "5rem", height: "5rem", objectFit: "cover" }}
        />
        <Card.Body className="text-center">
          <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
          <Card.Text>
            <p># {jerseyNumber}</p>
            <p>{PlayerPositionEnum[position] || position}</p>
            <Badge>{PlayerStatusEnum[status] || status}</Badge>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

// Componente para la página de equipo
const TeamPage = ({ teams }) => {
  const { teamId } = useParams();
  const [key, setKey] = useState("players"); // Estado para manejar las pestañas

  const team = teams.find((team) => team.teamId === parseInt(teamId));
  const navigate = useNavigate();
  const {
    allTeamsStats,
    loading: loadingTeams,
    error: errorTeams,
  } = useFetchAllTeamsStats();

  const { data, error, loading, getEthicsOfficerByTeamId } = useGetEthicsOfficerByTeamId();

  useEffect(() => {
    getEthicsOfficerByTeamId(teamId);
  }, [teamId]);

  if (!team) {
    return <EmptyData message="El equipo no existe" />;
  }

  const { name, neighborhood, teamGroup, logoUrl, players } = team;
  const coach = data?.ethicsOfficer || "Sin Oficial de Ética";

  const teamStats = allTeamsStats?.find(
    (stats) => stats.teamId === parseInt(teamId)
  );
  const teamColor = teamStats?.teamColor || "#f0f0f0";
  const teamStyles = getTeamStyles({ teamColor });

  return (
    <Container fluid>
      <Header />
      <Container className="banner-container">
        <PageBanner title={neighborhood} />
        <Card>
          <Card.Header
            style={{
              ...teamStyles.containerStyle,
              padding: "0.5rem 0",
              width: "100%",
            }}
          >
            <Row className="align-items-center">
              <Col xs={12} md={6} className="text-center">
                <Card.Img
                  variant="top"
                  src={logoUrl}
                  alt={name}
                  style={{ width: "15rem", height: "15rem", margin: "1rem" }}
                />
              </Col>
              <Col xs={12} md={6} className="text-center">
                <h1>{name}</h1>
                <h3>{TeamGroupEnum[teamGroup] || teamGroup}</h3>
                <h3
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/coach/${data?.ethicsOfficerId}`)}
                >
                  {`Oficial de Ética: ${coach}`}
                </h3>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
              {/* Pestaña de Jugadores */}
              <Tab eventKey="players" title="Jugadores">
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
              </Tab>

              {/* Pestaña de Estadísticas */}
              <Tab eventKey="stats" title="Estadísticas">
                {teamStats ? (
                  <Container>
                    <h3 className="text-center mb-4">Estadísticas del equipo</h3>
                    <ListGroup variant="flush">
                      {stats.map(({ label, key }) => (
                        <ListGroup.Item
                          key={key}
                          className="d-flex justify-content-between align-items-center"
                        >
                          {label}
                          <Badge bg="primary" pill>
                            {teamStats[key] || 0}
                          </Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Container>
                ) : (
                  <EmptyData message="No hay estadísticas disponibles para este equipo" />
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </Container>
  );
};

export default TeamPage;
