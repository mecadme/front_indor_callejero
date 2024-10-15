import React from "react";
import { Container, Row } from "react-bootstrap";
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
import Cards from "./Cards";
import PageBanner from "../../Utils/PageBanner";

const CardsPage = () => {
  return (
    <Container fluid>
      <Header />
      <Container className="cards-page-container p-0">
        <PageBanner title="Tarjetas" />
       
        <Cards />
      </Container>
      <Footer />
    </Container>
  )
}

export default CardsPage