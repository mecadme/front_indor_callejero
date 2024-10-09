import chroma from "chroma-js";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
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
import useFetchAllTeamsStats from "../../hooks/useFetchAllTeamsStats"; // Assuming there's a hook for fetching teams
import EmptyData from "../Administration/EmptyData";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import TeamSelector from "./TeamSelector"; 
import { useNavigate } from "react-router-dom";

// RadarChart Component
const RadarChartComponent = ({ data, team1, team2 }) => {
  const sameTeamColor = team1.teamColor === team2.teamColor;
  const team1Color = team1.teamColor;
  const team2Color = sameTeamColor
    ? chroma(team2.teamColor).darken(1.5).hex()
    : team2.teamColor;

  return (
    <ResponsiveContainer width="80%" height={500}>
      <RadarChart outerRadius={150} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="stat" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name={team1.teamName.toUpperCase()}
          dataKey="team1"
          stroke={team1Color}
          fill={team1Color}
          fillOpacity={0.6}
        />
        <Radar
          name={team2.teamName.toUpperCase()}
          dataKey="team2"
          stroke={team2Color}
          fill={team2Color}
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
const StatsTable = ({ team1, team2 }) => {
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
          <th>{team1.teamName.toUpperCase()}</th>
          <th>ESTADÍSTICAS</th>
          <th>{team2.teamName.toUpperCase()}</th>
        </tr>
      </thead>
      <tbody>
        {stats.map((stat, index) => (
          <tr key={index}>
            <td>{team1[stat.key]}</td>
            <td>{stat.label}</td>
            <td>{team2[stat.key]}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
const TeamCard = ({ team }) => {
  
  const handleTeamClick = (teamId) => {
    navigate(`/team/${teamId}`);
  };
  const navigate = useNavigate();
  return (
    <Col key={team.teamId} className="mb-2">
      <Card
      onClick={() => handleTeamClick(team.teamId)}
        style={{ width: "10rem", alignItems: "center", cursor: "pointer" }}
        className="shadow-sm"
      >
        <Card.Img
          variant="top"
          src={team.teamLogoUrl}
          alt={team.teamName}
          style={{ width: "7rem", height: "7rem", objectFit: "contain" }}
        />
        <Card.Body className="text-center">
          <Card.Title>{team.teamName}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
};

// TeamsComparison Component
const TeamsComparison = () => {
  const { allTeamsStats, loading, error } = useFetchAllTeamsStats(); // Fetch teams' stats
  const [selectedTeam1, setSelectedTeam1] = useState(null);
  const [selectedTeam2, setSelectedTeam2] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const radarData = useMemo(() => {
    if (!selectedTeam1 || !selectedTeam2) return [];

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
      team1: calculatePercentage(selectedTeam1[key], selectedTeam2[key]),
      team2: calculatePercentage(selectedTeam2[key], selectedTeam1[key]),
    }));
  }, [selectedTeam1, selectedTeam2]);

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
  if (!allTeamsStats)
    return <EmptyData message="No team information available" />;

  const handleTeamSelect = (setTeam, otherTeam) => (team) => {
    if (team === otherTeam) {
      setErrorMsg("No puedes seleccionar el mismo equipo para ambas comparaciones.");
      return;
    }
    setErrorMsg("");
    setTeam(team);
  };

  const resetTeam = (setTeam) => () => setTeam(null);

  return (
    <Container fluid className="py-0 px-2 align-items-center">
      <Header />
      {errorMsg && (
        <Alert variant="danger" className="mt-2">
          {errorMsg}
        </Alert>
      )}

      {/* Team Selection */}
      <Row className="mb-3">
        <Col md={5}>
          {!selectedTeam1 ? (
            <TeamSelector
              teams={allTeamsStats.filter((team) => team !== selectedTeam2)}
              onSelectTeam={handleTeamSelect(setSelectedTeam1, selectedTeam2)}
            />
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <Button variant="primary" onClick={resetTeam(setSelectedTeam1)}>
                CAMBIAR EQUIPO
              </Button>
              <h5 className="m-4 text-center">{selectedTeam1.teamName}</h5>
            </div>
          )}
        </Col>
        <Col md={2} className="d-flex justify-content-center align-items-center">
          <h5>VS</h5>
        </Col>
        <Col md={5}>
          {!selectedTeam2 ? (
            <TeamSelector
              teams={allTeamsStats.filter((team) => team !== selectedTeam1)}
              onSelectTeam={handleTeamSelect(setSelectedTeam2, selectedTeam1)}
            />
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="m-4 text-center">{selectedTeam2.teamName}</h5>
              <Button variant="primary" onClick={resetTeam(setSelectedTeam2)}>
                CAMBIAR EQUIPO
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Teams' Cards and Radar Chart */}
      {selectedTeam1 && selectedTeam2 && (
        <>
          <Row className="mb-3 align-items-center justify-content-center">
            <Col
              xs={12}
              md={2}
              lg={2}
              className="d-flex justify-content-right align-items-center text-center"
            >
              <TeamCard team={selectedTeam1} />
            </Col>

            <Col
              xs={12}
              md={8}
              lg={6}
              className="d-flex justify-content-center align-items-center text-center"
            >
              {radarData.length ? (
                <RadarChartComponent data={radarData} team1={selectedTeam1} team2={selectedTeam2} />
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
              <TeamCard team={selectedTeam2} />
            </Col>
          </Row>

          {/* Stats Table */}
          <Row className="mb-3 align-items-center justify-content-center">
            <Col xs={6} md={8} lg={4} className="d-flex justify-content-center">
              <StatsTable team1={selectedTeam1} team2={selectedTeam2} />
            </Col>
          </Row>
        </>
      )}
      <Footer />
    </Container>
  );
};

export default TeamsComparison;
