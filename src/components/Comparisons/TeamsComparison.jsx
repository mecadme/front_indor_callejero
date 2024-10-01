import React from 'react'
import EmptyData from "../Administration/EmptyData";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Container } from 'react-bootstrap';


const TeamsComparison = () => {
  return (
    <Container fluid className="m-0 p-0">
    <Header />
    <EmptyData message={"No hay infomación sobre las Equipas"} />
    <Footer />
  </Container>
  )
}

export default TeamsComparison