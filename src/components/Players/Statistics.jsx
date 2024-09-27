import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import PlayerStatistics from "./Statistics/PlayerStatistics.jsx";
import MinutesPlayed from "./Statistics/MinutesPlayed.jsx";
import Cards from "./Statistics/Cards.jsx";
import { useNavigate } from "react-router-dom"; // Para redireccionar

const PlayerStatisticsOverview = () => {
  const statisticsCategories = [
    { eventType: "goal", name: "Goles", icon: "⚽" },
    { eventType: "assist", name: "Asistencias", icon: "🅰️" },
    { eventType: "pass", name: "Pases", icon: "📈" },
    { eventType: "clearances", name: "Despejes", icon: "🛡️" },
    { eventType: "totalShots", name: "Disparos Totales", icon: "🎯" },
    { eventType: "goals_shots", name: "Disparos al Arco", icon: "🥅" },
    { eventType: "aerials", name: "Duelos Aéreos", icon: "🛫" },
    { eventType: "balls_stolen", name: "Robos de Balón", icon: "🕵️‍♂️" },
    {
      eventType: "unbeaten_matches",
      name: "Porterías Imbatidas",
      icon: "🚫🥅",
    },
  ];

  const navigate = useNavigate();

  const handleSeeMore = (eventType, name) => {
    navigate(`/${eventType}`, { state: { name } });
  };

  return (
    <Container className="mt-1">
      <Container className="text-center mt-4">
        <h2 style={{ textTransform: "uppercase" }}>
          Centro de Estadísticas
        </h2>
      </Container>
      <Row>
        {statisticsCategories.map((category, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header className="text-center bg-primary text-white">
                <h4>
                  {category.icon} {category.name.toUpperCase()}
                </h4>
              </Card.Header>
              <Card.Body>
                <PlayerStatistics
                  eventType={category.eventType}
                  name={category.name}
                  limit={3}
                />
              </Card.Body>
              <Card.Footer className="text-center">
                <Button
                  variant="primary"
                  className="btn-block"
                  onClick={() =>
                    handleSeeMore(category.eventType, category.name)
                  }
                >
                  Ver más
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}

        {/* Componente específico para Minutos Jugados */}
        <Col sm={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="text-center bg-info text-white">
              <h4>⏱ MINUTOS JUGADOS</h4>
            </Card.Header>
            <Card.Body>
              <MinutesPlayed limit={3} />
            </Card.Body>
            <Card.Footer className="text-center">
              <Button
                variant="info"
                className="btn-block"
                onClick={() =>
                  handleSeeMore("minutes_played", "Minutos jugados")
                }
              >
                Ver más
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col></Col>
        <Col sm={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="text-center bg-danger text-white">
              <h4>🟨🟥 TARJETAS</h4>
            </Card.Header>
            <Card.Body>
              <Cards limit={2} />
            </Card.Body>
            <Card.Footer className="text-center">
              <Button
                variant="danger"
                className="btn-block"
                onClick={() => handleSeeMore("card", "Tarjetas")}
              >
                Ver más
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlayerStatisticsOverview;
