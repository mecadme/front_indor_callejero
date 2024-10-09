import React from 'react'
import { Container } from 'react-bootstrap'
import Header from './Header'
import Footer from '../Footer/Footer'
import PageBanner from '../Utils/PageBanner'

const HistoricalEvents = () => {
  return (
    <Container fluid>
      <Header />

      <Container className='banner-container'>
        <PageBanner title={"Palmares Históricos"}/>
        <ul>
          <li>Jugadores</li>
          <li>Partidos</li>
          <li>Estadios</li>
          <li>Estadios de los partidos</li>
          <li>Estadios de los jugadores</li>
          <li>Estadios de los Equipos</li>
          <li>Estadios de los Partidos</li>
          <li>Estadios de los Estadios</li>
          <li>Estadios de los Estadios de los Partidos</li>
          <li>Estadios de los Estadios de los Jugadores</li>
          <li>Estadios de los Estadios de los Equipos</li>
          <li>Estadios de los Estadios de los Partidos</li>
        </ul>
      </Container>
      <Footer />
    </Container>
  )
}

export default HistoricalEvents