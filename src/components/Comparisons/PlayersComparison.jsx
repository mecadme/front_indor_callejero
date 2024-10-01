import chroma from "chroma-js";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import useFetchAllPlayersStats from "../../hooks/useFetchAllPlayersStats";
import EmptyData from "../Administration/EmptyData";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import PlayerSelector from "./PlayerSelector";

// RadarChart Component
const RadarChartComponent = ({ data, player1, player2 }) => {
  const sameTeam = player1.teamColor === player2.teamColor;
  const player1Color = player1.teamColor;
  const player2Color = sameTeam
    ? chroma(player2.teamColor).darken(1.5).hex()
    : player2.teamColor;

  return (
    <ResponsiveContainer width="80%" height={500}>
      <RadarChart outerRadius={150} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="stat" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name={player1.player.lastName.toUpperCase()}
          dataKey="player1"
          stroke={player1Color}
          fill={player1Color}
          fillOpacity={0.6}
        />
        <Radar
          name={player2.player.lastName.toUpperCase()}
          dataKey="player2"
          stroke={player2Color}
          fill={player2Color}
          fillOpacity={0.6}
        />
        <Tooltip />
        <Legend verticalAlign="top" />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// Helper function to calculate percentage
const calculatePercentage = (value1, value2) => {
  const total = value1 + value2;
  return total === 0 ? 0 : (value1 / total) * 100;
};

// StatsTable Component
const StatsTable = ({ player1, player2 }) => {
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

  return (
    <Table
      responsive
      hover
      className="stats-table text-center p-0"
      style={{ fontSize: "1rem", width: "100%" }}
    >
      <thead>
        <tr>
          <th>{player1.player.lastName.toUpperCase()}</th>
          <th>ESTADÍSTICAS</th>
          <th>{player2.player.lastName.toUpperCase()}</th>
        </tr>
      </thead>
      <tbody>
        {stats.map((stat, index) => (
          <tr key={index}>
            <td>{player1[stat.key]}</td>
            <td>{stat.label}</td>
            <td>{player2[stat.key]}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// PlayerCard Component
const PlayerCard = ({ player }) => {
  const { firstName, lastName, photoUrl, jerseyNumber, position, status } =
    player;
  const navigate = useNavigate();

  const handlePlayerClick = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <Col key={player.playerId} className="mb-2">
      <Card
        style={{ width: "10rem", alignItems: "center", cursor: "pointer" }}
        onClick={() => handlePlayerClick(player.playerId)}
        className="shadow-sm"
      >
        <Card.Img
          variant="top"
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          style={{ width: "7rem", height: "7rem", objectFit: "contain" }}
        />
        <Card.Body className="text-center">
          <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
          <Card.Text>
            <p style={{ fontSize: "1.5rem" }}>#{jerseyNumber}</p>
            <p>POSICIÓN {position}</p>
            <Badge variant={status === "Active" ? "success" : "danger"}>
              {status}
            </Badge>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

const PlayersComparison = () => {
  const { allPlayersStats, loading, error } = useFetchAllPlayersStats();
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const radarData = useMemo(() => {
    if (!selectedPlayer1 || !selectedPlayer2) return [];

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

    return stats.map(({ label, key }) => ({
      stat: label,
      player1: calculatePercentage(selectedPlayer1[key], selectedPlayer2[key]),
      player2: calculatePercentage(selectedPlayer2[key], selectedPlayer1[key]),
    }));
  }, [selectedPlayer1, selectedPlayer2]);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return (
      <Alert variant="danger">
        {error}{" "}
        <Button
          variant="outline-danger"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Alert>
    );
  if (!allPlayersStats)
    return <EmptyData message="No player information available" />;

  const handlePlayerSelect = (setPlayer, otherPlayer) => (player) => {
    if (player === otherPlayer) {
      setErrorMsg(
        "No puedes seleccionar el mismo jugador para ambas comparaciones."
      );
      return;
    }
    setErrorMsg("");
    setPlayer(player);
  };

  const resetPlayer = (setPlayer) => () => setPlayer(null);

  return (
    <Container fluid className="py-0 px-2 align-items-center">
      <Header />
      {errorMsg && (
        <Alert variant="danger" className="mt-2">
          {errorMsg}
        </Alert>
      )}

      {/* Player Selection */}
      <Row className="mb-3">
        <Col md={5}>
          {!selectedPlayer1 ? (
            <PlayerSelector
              players={allPlayersStats.filter(
                (player) => player !== selectedPlayer2
              )}
              onSelectPlayer={handlePlayerSelect(
                setSelectedPlayer1,
                selectedPlayer2
              )}
            />
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <Button
                variant="primary"
                onClick={resetPlayer(setSelectedPlayer1)}
              >
                CAMBIAR JUGADOR
              </Button>
              <h5 className="m-4 text-center">
                {selectedPlayer1.player.firstName}{" "}
                {selectedPlayer1.player.lastName.toUpperCase()}
              </h5>
            </div>
          )}
        </Col>
        <Col
          md={2}
          className="d-flex justify-content-center align-items-center"
        >
          <h5>VS</h5>
        </Col>
        <Col md={5}>
          {!selectedPlayer2 ? (
            <PlayerSelector
              players={allPlayersStats.filter(
                (player) => player !== selectedPlayer1
              )}
              onSelectPlayer={handlePlayerSelect(
                setSelectedPlayer2,
                selectedPlayer1
              )}
            />
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="m-4 text-center">
                {selectedPlayer2.player.firstName}{" "}
                {selectedPlayer2.player.lastName.toUpperCase()}
              </h5>
              <Button
                variant="primary"
                onClick={resetPlayer(setSelectedPlayer2)}
              >
                CAMBIAR JUGADOR
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Players' Cards and Radar Chart */}
      {selectedPlayer1 && selectedPlayer2 && (
        <>
          <Row className="mb-3 align-items-center justify-content-center">
            <Col
              xs={12}
              md={2}
              lg={2}
              className="d-flex justify-content-right align-items-center text-center"
            >
              <PlayerCard player={selectedPlayer1.player} />
            </Col>

            <Col
              xs={12}
              md={8}
              lg={6}
              className="d-flex justify-content-center align-items-center text-center"
            >
              {radarData.length ? (
                <RadarChartComponent
                  data={radarData}
                  player1={selectedPlayer1}
                  player2={selectedPlayer2}
                />
              ) : (
                <p>Radar chart not available</p>
              )}
            </Col>

            <Col
              xs={12}
              md={2}
              lg={2}
              className="d-flex justify-content-center text-center"
            >
              <PlayerCard player={selectedPlayer2.player} />
            </Col>
          </Row>

          {/* Stats Table */}
          <Row className="mb-3 align-items-center justify-content-center">
            <Col xs={6} md={8} lg={4} className="d-flex justify-content-center">
              <StatsTable player1={selectedPlayer1} player2={selectedPlayer2} />
            </Col>
          </Row>
        </>
      )}
      <Footer />
    </Container>
  );
};

export default PlayersComparison;
