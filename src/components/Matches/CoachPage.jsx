import React from 'react'
import Header from '../Header/Header'
import EmptyData from '../Administration/EmptyData'
import Footer from '../Footer/Footer'
import { Container } from 'react-bootstrap'

const CoachPage = () => {
  return (
    <Container fluid className='p-0'>
    <Header/>
    <EmptyData message={"No hay infomación sobre el técnico"}/>
    <Footer/>
    </Container>
  )
}

export default CoachPage