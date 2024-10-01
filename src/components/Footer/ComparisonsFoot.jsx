import React from 'react'
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";

const ComparisonsFoot = () => {
  return (
    <ListGroup>
      <Link to="/comparisons" className="nav-link">
        <h5>Comparaciones</h5>
      </Link>
      <ListGroup.Item>
        <Link to="/comparisons/teams" className="nav-link">
          Comparar Equipos
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/comparisons/players" className="nav-link">
          Comparar Jugadores
        </Link>
      </ListGroup.Item>
    </ListGroup>
  )
}

export default ComparisonsFoot