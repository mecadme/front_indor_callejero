import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { Link } from "react-router-dom";
import "./css/StandingsFoot.css";

const StandingsFoot = () => {
  return (
    <ListGroup className="standings-foot">
      
        <Link to="/group_standings" className="nav-link"><h5>Tablas</h5></Link>
      <ListGroup.Item className="group-link p-0 m-0">
        <Link to="/group_standings" className="nav-link">Fase de Grupos</Link>
      </ListGroup.Item>


    </ListGroup>

  )
}

export default StandingsFoot