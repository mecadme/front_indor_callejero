import React from "react";
import { ListGroup } from "react-bootstrap";

import { Link } from "react-router-dom";

const TeamsFoot = ({ content, getAllTeams }) => {
  return (
    <ListGroup>
      <h5>Equipos</h5>
      {content.length === 0 && (
        <div className="alert alert-info">No hay equipos</div>
      )}

      {content.map((team, index) => (
        <ListGroup.Item key={index} onClick={() => getAllTeams(team.teamId)}>
        <Link to={`/team/${team.teamId}`} className="nav-link">
          {team.name}
        </Link>
      </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TeamsFoot;
