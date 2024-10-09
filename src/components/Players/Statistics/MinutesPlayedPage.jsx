import React from "react";
import { Container, Row } from "react-bootstrap";
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
import MinutesPlayed from "./MinutesPlayed";
import "./css/MinutesPlayed.css";

const MinutesPlayedPage = () => {
  return (
    <Container fluid>
      <Header />
      <Container className="minutes-played-container ">
        <Row className="banner-row  mb-2">
          <h2 >Minutos Jugados</h2>
        </Row>

        <MinutesPlayed />
      </Container>
      <Footer />
    </Container>
  );
};

export default MinutesPlayedPage;
