import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./css/MatchStats.css";

const MatchStats = ({ matchStats, homeTeamId, awayTeamId }) => {
  const homeTeamStats = matchStats.find((team) => team.teamId === homeTeamId) || {};
  const awayTeamStats = matchStats.find((team) => team.teamId === awayTeamId) || {};

  const totalPasses = (homeTeamStats.passes || 0) + (awayTeamStats.passes || 0);

  const calculatePossession = (teamPasses) => 
    totalPasses > 0 ? ((teamPasses / totalPasses) * 100) : 0;

  const homeTeamPossession = calculatePossession(homeTeamStats.passes || 0);
  const awayTeamPossession = calculatePossession(awayTeamStats.passes || 0);

  const statsFields = [
    { label: "PASES", key: "passes" },
    { label: "POSESIÓN", key: "possession", isPercentage: true },
    { label: "DISPAROS TOTALES", key: "totalShots" },
    { label: "DISPAROS AL ARCO", key: "goalsShots" },
    { label: "DUELOS AÉREOS", key: "aerials" },
    { label: "ROBOS DE BALÓN", key: "ballStolen" },
    { label: "DESPEJES", key: "clearances" },
    { label: "AMARILLAS", key: "yellowCards" },
    { label: "ROJAS", key: "redCards" },
  ];

  return (
    <Container className="mt-2 text-center">
      <Row className="d-flex justify-content-center">
        <Col xs={3} md={1} lg={2} className="team-stats p-1">
          {statsFields.map(({ key, isPercentage }) => (
            <div key={key}>
              {isPercentage
                ? `${homeTeamPossession.toFixed(2)}%`
                : homeTeamStats[key] || 0}
            </div>
          ))}
        </Col>

        <Col md={6} xs={6} lg={6} className="stats-label text-center p-1" style={{ fontSize: "1.5rem" }}>
          {statsFields.map(({ label }) => (
            <div key={label}>
              <strong className="stats-label m-0 p-0" >{label}</strong>
            </div>
          ))}
        </Col>

        <Col md={3} xs={1} lg={2} className="team-stats p-1">
          {statsFields.map(({ key, isPercentage }) => (
            <div key={key}>
              {isPercentage
                ? `${awayTeamPossession.toFixed(2)}%`
                : awayTeamStats[key] || 0}
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default MatchStats;
