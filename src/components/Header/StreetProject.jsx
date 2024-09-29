import React from 'react'
import { Container } from 'react-bootstrap'
import Header from './Header'
import Footer from '../Footer/Footer'

const StreetProject = () => {
  return (
    <Container fluid>
      <Header />
      <Container>
        <h2>Proyecto Street</h2>
        <p>En este proyecto, el equipo de callejero se encarga de analizar las predicciones de los jugadores. Para esto, se utilizan datos de la base de datos de la NBA. </p>
        <p>La base de datos de la NBA se compone de 2 tablas: </p>
        <ul>
          <li>Jugadores</li>
          <li>Partidos</li>
        </ul>
      </Container>
      <Footer />

    </Container>
  )
}

export default StreetProject