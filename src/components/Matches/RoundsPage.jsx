import React from "react";
import { Container } from "react-bootstrap";
import useFetchRounds from "../../hooks/useFetchRounds";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Rounds from "../Home Page/Rounds";
import PageBanner from "../Utils/PageBanner";

const RoundsPage = () => {
  const { RoundsData, loading, error } = useFetchRounds();
  return (
    <Container fluid className="p-0">
      <Header />
      <Container className="banner-container">
        <PageBanner title={"Jornadas"}/>
       </Container> <Container>
        <Rounds RoundsData={RoundsData} />
      </Container>
      <Footer />
    </Container>
  );
};

export default RoundsPage;
