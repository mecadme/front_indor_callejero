import React from "react";
import { useLocation, useParams } from "react-router-dom";
import PlayerStatistics from "./PlayerStatistics"; // Reutiliza el componente de estadísticas
import { Container, Row } from "react-bootstrap";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import Cards from "./Cards";

const CardsPage = () => {
  return (
    <Container fluid>
      <Header />
      <Container className="cards-page-container">
        <Row className="banner-row  mb-2">
        <h2 className="text-center">
          Tarjetas
        </h2>
        </Row>
        
        <Cards />
      </Container>
      <Footer />
    </Container>
  )
}

export default CardsPage