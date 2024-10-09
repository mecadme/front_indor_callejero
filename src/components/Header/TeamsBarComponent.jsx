import React from "react";
import "./css/TeamsBarComponent.css";
import { Container } from "react-bootstrap";

const TeamsBarComponent = ({ content, getAllTeams }) => {
  return (
    <nav className="teams_bar navbar navbar-expand-lg navbar-light bg-light">
      <div className="team_container-fluid">
        {content.length === 0 && <div className="alert alert-info">No hay equipos</div>}

        <ul className="teams_logo_list">
          {content.map((team, index) => (
            <li key={index} className="nav-item" onClick={() => getAllTeams(team.teamId)}>
              <a className="nav-link">
                <img src={team.logoUrl} alt={team.name} className="logo_team" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TeamsBarComponent;
