import React from "react";
import { useLocation, useParams } from "react-router-dom";
import PlayerStatistics from "./PlayerStatistics"; // Reutiliza el componente de estadísticas
import { Container } from "react-bootstrap";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import MinutesPlayed from "./MinutesPlayed";

const MinutesPlayedPage = () => {
  return (
    <Container fluid>
      <Header />
      <Container className="mt-5">
        <h2 className="text-center">
          {location.state?.name || "Estadísticas"}
        </h2>
        <MinutesPlayed />
      </Container>
      <Footer />
    </Container>
  )
}

export default MinutesPlayedPage