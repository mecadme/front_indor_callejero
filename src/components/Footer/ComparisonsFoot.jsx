import React from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./css/ComparisonsFoot.css";

const ComparisonsFoot = () => {
  return (
    <ListGroup className="comparisons-foot">
      <Link to="/comparisons" className="nav-link">
        <h5>Comparaciones</h5>
      </Link>
      <ListGroup.Item className="comparisons-teams-link p-0 m-0">
        <Link to="/comparisons/teams" className="nav-link">
          Comparar Equipos
        </Link>
      </ListGroup.Item>
      <ListGroup.Item className="comparisons-players-link p-0 m-0">
        <Link to="/comparisons/players" className="nav-link">
          Comparar Jugadores
        </Link>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default ComparisonsFoot;
