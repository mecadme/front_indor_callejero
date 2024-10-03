import React, { useState } from "react";
import { Container, Row, Col, Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PlayersDashboard from "./PlayersDashboard";
import CurrentValueDashboard from "./CurrentValueDashboard";
import TeamDashboard from "./TeamDashboard";
import EthicsOfficerDashboard from "./EthicsOfficerDashboard";
import SponsorDashboard from "./SponsorDashboard";
import RoundDashboard from "./RoundDashboard";
import MatchDashboard from "./MatchDashboard";
import FacebookVideosDashboard from "./FacebookVideosDashboard";
import WeeklyAwardsDashboard from "./WeeklyAwardsDashboard";

const Admin = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeDashboard, setActiveDashboard] = useState("dashboard1");

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const renderDashboard = () => {
    switch (activeDashboard) {
      case "player":
        return <PlayersDashboard />;
      case "team":
        return <TeamDashboard />;
      case "currentValues":
        return <CurrentValueDashboard />;
      case "ethicsOfficer":
        return <EthicsOfficerDashboard />;
      case "sponsor":
        return <SponsorDashboard />;
      case "round":
        return <RoundDashboard />;
      case "match":
        return <MatchDashboard />;
      case "facebookVideos":
        return <FacebookVideosDashboard />;
      case "weeklyAwards":
        return <WeeklyAwardsDashboard />;
      default:
        return <CurrentValueDashboard />;
    }
  };

  return (
    <Container fluid>
        <Row className="header">
            <Button variant="primary">
                <Link to="/">Volver a la página principal</Link>
            </Button>
        </Row>
      <Row>
        <Col xs={2} className={`sidebar ${expanded ? "expanded" : ""}`}>
          <Navbar bg="light" expand="lg">
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={toggleSidebar}
            />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="flex-column">
                <Nav.Link onClick={() => setActiveDashboard("player")}>
                  Administración de Jugador
                </Nav.Link>
                <Nav.Link onClick={() => setActiveDashboard("team")}>
                Administración de  Equipo
                </Nav.Link>
                <Nav.Link onClick={() => setActiveDashboard("currentValues")}>
                  Administración de Valores Actuales
                </Nav.Link>
                <Nav.Link onClick={() => setActiveDashboard("ethicsOfficer")}>
                  Administración de Oficiales de Ética
                </Nav.Link>
                <Nav.Link onClick={() => setActiveDashboard("sponsor")}>
                  Administración de Patrocinadores
                </Nav.Link>
                <Nav.Link onClick={() => setActiveDashboard("round")}>
                  Administración de Jornadas
                </Nav.Link>
                <Nav.Link onClick={() => setActiveDashboard("match")}>
                  Administración de Partidos
                </Nav.Link>
                <Nav.Link onClick={() => setActiveDashboard("facebookVideos")}>
                  Administración de Videos de Facebook
                </Nav.Link>
                <Nav.Link onClick={() => setActiveDashboard("weeklyAwards")}>
                  Administración de Premios Semanales
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Col>
        <Col xs={10}>
          <Button variant="primary" onClick={toggleSidebar}>
            {expanded ? "Collapse" : "Expand"} Sidebar
          </Button>
          <div className="dashboard-content">{renderDashboard()}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
