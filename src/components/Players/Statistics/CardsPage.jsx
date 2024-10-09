import React from "react";
import { Container, Row } from "react-bootstrap";
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
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