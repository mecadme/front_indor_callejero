import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import PlayerStatistics from "./Statistics/PlayerStatistics.jsx";
import MinutesPlayed from "./Statistics/MinutesPlayed.jsx";
import Cards from "./Statistics/Cards.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Statistics/css/Statistics.css";

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
    <Container fluid className="mt-1">
      <Header />
      <Container className="stats-container">
      <Row className="banner-row  mb-2">
          <h2 style={{ textTransform: "uppercase" }}>Centro de Estadísticas</h2>
        </Row>
      </Container>
      <Row className="stats-row mt-3">
        {statisticsCategories.map((category, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card className="shadow-sm h-100">
            <Card.Header className=" stats-card-header text-center text-white">
                <h4>
                  {category.icon} {category.name.toUpperCase()}
                </h4>
              </Card.Header>
              <Card.Body>
                <PlayerStatistics
                  eventType={category.eventType}
                  name={category.name}
                  limit={3}
                  showPagination={false}
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

        <Col sm={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
          <Card.Header className=" stats-card-header text-center text-white">
              <h4>⏱ MINUTOS JUGADOS</h4>
            </Card.Header>
            <Card.Body>
              <MinutesPlayed limit={3} showPagination={false} />
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
            <Card.Header className=" stats-card-header text-center text-white">
              <h4>🟨🟥 TARJETAS</h4>
            </Card.Header>
            <Card.Body>
              <Cards limit={2} showPagination={false} />
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
      <Footer />
    </Container>
  );
};

export default PlayerStatisticsOverview;
