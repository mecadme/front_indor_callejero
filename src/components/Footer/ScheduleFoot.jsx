import React from 'react';
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const ScheduleFoot = () => {
  return (
    <ListGroup>
      <h5>Calendario</h5>
      <ListGroup.Item>
        <Link to="/jornadas" className="nav-link">Todas las jornadas</Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/partidos" className="nav-link">Todos los partidos</Link>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default ScheduleFoot;