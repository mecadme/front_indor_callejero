import React from "react";
import Rounds from "../Home Page/Rounds";
import { Container } from "react-bootstrap";
import useFetchRounds from "../../hooks/useFetchRounds";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const RoundsPage = () => {
  const { RoundsData, loading, error } = useFetchRounds();
  return (
    <Container fluid>
      <Header />
      <Container className="mt-5">
        <h2 className="text-center mb-2">Todas las jornadas</h2>
        <Rounds RoundsData={RoundsData} />
      </Container>
      <Footer />
    </Container>
  );
};

export default RoundsPage;
