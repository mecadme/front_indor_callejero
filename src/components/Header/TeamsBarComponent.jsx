import React from "react";
import { Container, Row } from "react-bootstrap";
import "./css/TeamsBarComponent.css";

const TeamsBarComponent = ({ content, getAllTeams }) => {
  return (
    <Row className="teams_bar">
      <Container  className="teams-bar-container p-0 m-0">
        {content.length === 0 && <div className="alert alert-info">No hay equipos</div>}

        <ul className="teams_logo_list">
          {content.map((team, index) => (
            <li key={index} className="team-nav-item" onClick={() => getAllTeams(team.teamId)}>
              <a className="nav-link">
                <img src={team.logoUrl} alt={team.name} className="logo_team" />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </Row>
  );
};

export default TeamsBarComponent;
