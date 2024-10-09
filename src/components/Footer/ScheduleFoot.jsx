import React from 'react';
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./css/ScheduleFoot.css";

const ScheduleFoot = () => {
  return (
    <ListGroup className="schedule-foot">
      
        <Link to="/rounds" className="nav-link"><h4>Calendario</h4></Link>
      <ListGroup.Item className='rounds-link p-0 m-0'>
        <Link to="/rounds" className="nav-link">Todas las jornadas</Link>
      </ListGroup.Item>
      <ListGroup.Item className='matches-link p-0 m-0'>
        <Link to="/matches" className="nav-link">Todos los partidos</Link>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default ScheduleFoot;
