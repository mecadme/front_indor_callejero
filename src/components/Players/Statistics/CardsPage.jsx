import React from "react";
import { useLocation, useParams } from "react-router-dom";
import PlayerStatistics from "./PlayerStatistics"; // Reutiliza el componente de estadísticas
import { Container } from "react-bootstrap";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import Cards from "./Cards";

const CardsPage = () => {
  return (
    <Container fluid>
      <Header />
      <Container className="mt-5">
        <h2 className="text-center">
          Tarjetas
        </h2>
        <Cards />
      </Container>
      <Footer />
    </Container>
  )
}

export default CardsPage