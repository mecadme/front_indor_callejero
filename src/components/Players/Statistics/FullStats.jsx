import React from "react";
import { useLocation, useParams } from "react-router-dom";
import PlayerStatistics from "./PlayerStatistics"; // Reutiliza el componente de estadísticas
import { Container, Row } from "react-bootstrap";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import PageBanner from "../../Utils/PageBanner";

const FullStatistics = () => {
  const { eventType } = useParams();
  const location = useLocation();

  return (
    <Container fluid>
      <Header />
      <Container className="statistics-container p-0">
        <PageBanner title={location.state?.name} />
        <PlayerStatistics eventType={eventType} name={location.state?.name} />
      </Container>
      <Footer />
    </Container>
  );
};

export default FullStatistics;
