import React from 'react'
import { Container } from 'react-bootstrap'
import Header from './Header'
import Footer from '../Footer/Footer'
import PageBanner from '../Utils/PageBanner'
import PhotoCarrousell from './PhotoCarrousell'

const TLQDS = () => {
  return (
    <Container fluid>
      <Header />

      <Container className='banner-container'>
        <PageBanner title={"Todo lo que debes saber"}/>
        <PhotoCarrousell information_type="ALL_YOU_HAVE_TO_KNOW" />
      </Container>
      <Footer />
    </Container>
  )
}

export default TLQDS