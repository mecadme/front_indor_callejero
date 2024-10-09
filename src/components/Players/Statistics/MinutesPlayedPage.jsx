import React from "react";
import { Container, Row } from "react-bootstrap";
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
import MinutesPlayed from "./MinutesPlayed";
import PageBanner from "../../Utils/PageBanner";
import "./css/MinutesPlayed.css";

const MinutesPlayedPage = () => {
  return (
    <Container fluid>
      <Header />
      <Container className="minutes-played-container p-0">
        <PageBanner title="Minutos jugados" />

        <MinutesPlayed />
      </Container>
      <Footer />
    </Container>
  );
};

export default MinutesPlayedPage;
