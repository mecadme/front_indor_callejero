import React from 'react'
import { Container } from 'react-bootstrap'
import Header from './Header'
import Footer from '../Footer/Footer'
import PageBanner from '../Utils/PageBanner'
import PhotoCarrousell from './PhotoCarrousell'

const StreetProject = () => {
  return (
    <Container fluid>
      <Header />
      <Container className="banner-container p-0">
        <PageBanner title="Proyecto Callejero" />
        <PhotoCarrousell information_type="PROJECT_STREET" />
      </Container>
      <Footer />

    </Container>
  )
}

export default StreetProject