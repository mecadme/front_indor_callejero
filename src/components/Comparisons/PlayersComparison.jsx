import React, { useState } from "react";
import EmptyData from "../Administration/EmptyData";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import useFetchAllPlayersStats from "../../hooks/useFetchAllPlayersStats";
import Loading from "../Utils/Loading";
import PlayerSelector from "./PlayerSelector";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

// Componente del gráfico radial
const RadarChartComponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart outerRadius={90} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="stat" />
        <PolarRadiusAxis angle={30} domain={[0, 10]} />
        <Radar name="Player 1" dataKey="player1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Radar name="Player 2" dataKey="player2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

// Genera la tabla de estadísticas comparadas
const StatsTable = ({ player1, player2 }) => {
  const data = [
    { stat: "Passes", player1: player1.passes || 0, player2: player2.passes || 0 },
    { stat: "Total Shots", player1: player1.totalShots || 0, player2: player2.totalShots || 0 },
    { stat: "Shots on Goal", player1: player1.goalsShots || 0, player2: player2.goalsShots || 0 },
    { stat: "Aerial Duels", player1: player1.aerials || 0, player2: player2.aerials || 0 },
    { stat: "Ball Steals", player1: player1.ballStolen || 0, player2: player2.ballStolen || 0 },
    { stat: "Clearances", player1: player1.clearances || 0, player2: player2.clearances || 0 },
    { stat: "Yellow Cards", player1: player1.yellowCards || 0, player2: player2.yellowCards || 0 },
    { stat: "Red Cards", player1: player1.redCards || 0, player2: player2.redCards || 0 },
  ];

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Statistic</th>
          <th>{player1.firstName} {player1.lastName}</th>
          <th>{player2.firstName} {player2.lastName}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((stat, index) => (
          <tr key={index}>
            <td>{stat.stat}</td>
            <td>{stat.player1}</td>
            <td>{stat.player2}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const PlayersComparison = () => {
  const { allPlayersStats, loading, error } = useFetchAllPlayersStats();
  const [selectedPlayer1, setSelectedPlayer1] = useState(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState(null);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!allPlayersStats) {
    return <EmptyData message={"No player information available"} />;
  }

  const handlePlayer1Select = (player) => {
    setSelectedPlayer1(player);  // Asigna el jugador 1
  };

  const handlePlayer2Select = (player) => {
    setSelectedPlayer2(player);  // Asigna el jugador 2
  };

  const resetPlayer1 = () => setSelectedPlayer1(null);
  const resetPlayer2 = () => setSelectedPlayer2(null);

  return (
    <Container fluid className="m-0 p-0">
      <Header />

      {/* Selección de jugadores */}
      <Row className="mb-4">
        <Col md={5}>
          {!selectedPlayer1 ? (
            <PlayerSelector players={allPlayersStats} onSelectPlayer={handlePlayer1Select} />
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <h5>{selectedPlayer1.firstName} {selectedPlayer1.lastName}</h5>
              <Button variant="danger" onClick={resetPlayer1}>Cambiar Jugador 1</Button>
            </div>
          )}
        </Col>
        <Col md={2} className="d-flex justify-content-center align-items-center">
          <h5>VS</h5>
        </Col>
        <Col md={5}>
          {!selectedPlayer2 ? (
            <PlayerSelector players={allPlayersStats} onSelectPlayer={handlePlayer2Select} />
          ) : (
            <div className="d-flex justify-content-between align-items-center">
              <h5>{selectedPlayer2.firstName} {selectedPlayer2.lastName}</h5>
              <Button variant="danger" onClick={resetPlayer2}>Cambiar Jugador 2</Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Tabla comparativa de estadísticas */}
      {selectedPlayer1 && selectedPlayer2 && (
        <>
          <Row className="mb-4">
            <Col>
              <StatsTable player1={selectedPlayer1} player2={selectedPlayer2} />
            </Col>
          </Row>

          {/* Gráfico radial para comparar estadísticas */}
          <Row className="mb-4">
            <Col>
              <RadarChartComponent
                data={[
                  { stat: "Passes", player1: selectedPlayer1.passes, player2: selectedPlayer2.passes },
                  { stat: "Total Shots", player1: selectedPlayer1.totalShots, player2: selectedPlayer2.totalShots },
                  { stat: "Shots on Goal", player1: selectedPlayer1.goalsShots, player2: selectedPlayer2.goalsShots },
                  { stat: "Aerial Duels", player1: selectedPlayer1.aerials, player2: selectedPlayer2.aerials },
                  { stat: "Ball Steals", player1: selectedPlayer1.ballStolen, player2: selectedPlayer2.ballStolen },
                  { stat: "Clearances", player1: selectedPlayer1.clearances, player2: selectedPlayer2.clearances },
                  { stat: "Yellow Cards", player1: selectedPlayer1.yellowCards, player2: selectedPlayer2.yellowCards },
                  { stat: "Red Cards", player1: selectedPlayer1.redCards, player2: selectedPlayer2.redCards },
                ]}
              />
            </Col>
          </Row>
        </>
      )}

      <Footer />
    </Container>
  );
};

export default PlayersComparison;
