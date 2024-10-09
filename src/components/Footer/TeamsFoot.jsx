import React from "react";
import { ListGroup } from "react-bootstrap";

import { Link } from "react-router-dom";
import "./css/TeamsFoot.css";

const TeamsFoot = ({ content, getAllTeams }) => {
  return (
    <ListGroup className="teams-foot" >
      
      <Link to="/teams" className="nav-link"><h4>Equipos</h4></Link>
      
      {content.length === 0 && (
        <div className="alert alert-info">No hay equipos</div>
      )}

      {content.map((team, index) => (
        <ListGroup.Item key={index} onClick={() => getAllTeams(team.teamId)} className="team-link p-0 m-0">
        <Link to={`/team/${team.teamId}`} className="nav-link">
          {team.neighborhood}
        </Link>
      </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TeamsFoot;
