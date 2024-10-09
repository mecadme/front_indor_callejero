import React from "react";
import { useLocation, useParams } from "react-router-dom";
import PlayerStatistics from "./PlayerStatistics"; // Reutiliza el componente de estadísticas
import { Container, Row } from "react-bootstrap";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";

const FullStatistics = () => {
  const { eventType } = useParams();
  const location = useLocation();

  return (
    <Container fluid>
      <Header />
      <Container className="statistics-container p-0">
      <Row className="banner-row">
        <h2 className="text-center">
          {location.state?.name || "Estadísticas"}
        </h2>
      </Row>
        <PlayerStatistics eventType={eventType} name={location.state?.name} />
      </Container>
      <Footer />
    </Container>
  );
};

export default FullStatistics;
