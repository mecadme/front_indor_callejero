import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Timeline from './Timeline';

const ResultPage = () => {
    const {matchId, homeTeam, awayTeam} = useParams();
    
  return (
    <Container fluid>
        <Header />

        <Container>
            <h2 className="text-center">Resultados</h2>
            <Timeline matchId={matchId} homeTeam={homeTeam} awayTeam={awayTeam}/>
        </Container>

        <Footer />

    </Container>
  )
}

export default ResultPage