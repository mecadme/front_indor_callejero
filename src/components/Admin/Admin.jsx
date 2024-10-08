import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  Offcanvas,
} from "react-bootstrap";
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
import RefereeDashboard from "./RefereeDashboard";
import HomeButton from "../Utils/HomeButton";

const Admin = () => {
  const [showSidebar, setShowSidebar] = useState(false); // Estado para controlar la visibilidad de la barra lateral
  const [activeDashboard, setActiveDashboard] = useState("currentValues"); // Dashboard activo

  const toggleSidebar = () => setShowSidebar(!showSidebar); // Función para alternar la barra lateral

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
      case "referee":
        return <RefereeDashboard />;
      default:
        return <CurrentValueDashboard />;
    }
  };

  return (
    <Container fluid className="p-0 m-0 min-vh-100 bg-light">
     
        <HomeButton />

      <Offcanvas
        show={showSidebar}
        onHide={toggleSidebar}
        placement="start"
        className="bg-light"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav
            className="flex-column"
            style={{ fontSize: "1.15rem", fontWeight: "bold" }}
          >
            <Nav.Link
              onClick={() => {
                setActiveDashboard("currentValues");
                toggleSidebar();
              }}
            >
              Valores Actuales
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveDashboard("player");
                toggleSidebar();
              }}
            >
              Jugador
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveDashboard("team");
                toggleSidebar();
              }}
            >
              Equipo
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveDashboard("match");
                toggleSidebar();
              }}
            >
              Partidos
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveDashboard("referee");
                toggleSidebar();
              }}
            >
              Arbitros
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveDashboard("round");
                toggleSidebar();
              }}
            >
              Jornadas
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveDashboard("ethicsOfficer");
                toggleSidebar();
              }}
            >
              Oficiales de Ética
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveDashboard("sponsor");
                toggleSidebar();
              }}
            >
              Patrocinadores
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveDashboard("facebookVideos");
                toggleSidebar();
              }}
            >
              Videos de Facebook
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveDashboard("weeklyAwards");
                toggleSidebar();
              }}
            >
              Premios Semanales
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Row>
        <Col xs={1}>
          <Button
            onClick={toggleSidebar}
            className="sidebar-toggle p-4 clean-btn justify-content-center"
            aria-label="Toggle navigation bar"
            aria-expanded="false"
            class="navbar__toggle clean-btn"
            type="button"
          >
            {showSidebar ? "" : "☰"}
          </Button>
        </Col>
        <Col>
          <div
            className="dashboard-wrapper p-3"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "10px",
              boxShadow: "0 0 15px rgba(0,0,0,0.1)",
            }}
          >
            {renderDashboard()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Admin;
