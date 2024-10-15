import React from 'react'
import { Container } from 'react-bootstrap'
import Header from './Header'
import Footer from '../Footer/Footer'
import PageBanner from '../Utils/PageBanner'
import PhotoCarrousell from './PhotoCarrousell'

const HistoricalEvents = () => {
  return (
    <Container fluid>
      <Header />

      <Container className='banner-container'>
        <PageBanner title={"Palmares Históricos"}/>

        <PhotoCarrousell information_type="HISTORICAL_EVENTS" />
      </Container>
      <Footer />
    </Container>
  )
}

export default HistoricalEvents