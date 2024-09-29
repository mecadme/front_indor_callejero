import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Link } from "react-router-dom";

const StandingsFoot = () => {
  return (
    <ListGroup>
      
        <Link to="/group_standings" className="nav-link"><h5>Tablas</h5></Link>
      <ListGroup.Item>
        <Link to="/group_standings" className="nav-link">Fase de Grupos</Link>
      </ListGroup.Item>


    </ListGroup>

  )
}

export default StandingsFoot