import React from 'react'
import {Spinner} from "react-bootstrap";

const Loading = () => {
  return (
    <div><Spinner animation="border" size="sm" /> Cargando...</div>
  )
}

export default Loading