import { useState } from "react";
import { Button, Container, Nav, Navbar, NavDropdown, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/indor_callejero_logo.png";
import TeamsBarComponent from "./TeamsBarComponent";
import useFetchTeams from "../../hooks/useFetchTeams";
import useAuth from "../../hooks/useAuth";
import "./css/Header.css";

const Header = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();
  const { teams, isLoading, error } = useFetchTeams();
  const {auth} = useAuth();
  console.log(auth);

  // Spinner de carga
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Manejo de errores
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // Función para seleccionar un equipo y navegar a su página
  const handleTeamSelection = (teamId) => {
    setSelectedTeam(teamId);
    navigate(`/team/${teamId}`);
  };

  return (
    <header className="header">
      <TeamsBarComponent content={teams} getAllTeams={handleTeamSelection} />
      <Navbar expand="lg" className="navbarHeader" sticky="top">
        <Container className="containerHeader">
          <Navbar.Brand href="/" className="navbar-logo">
            <img src={logo} alt="IndorCallejero logo" className="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/street_project" aria-label="Proyecto Callejero">
                Proyecto Callejero
              </Nav.Link>
              <Nav.Link href="/all_you_need_to_know" aria-label="Todo lo que debes saber">
                Todo lo que debes saber
              </Nav.Link>
              <Nav.Link href="/historical_events" aria-label="Palmarés Históricos">
                Palmarés Históricos
              </Nav.Link>
              <NavDropdown title="Comparaciones" id="basic-nav-dropdown">
              <NavDropdown.Item href="/comparisons/teams">Comparar Equipos</NavDropdown.Item>
              <NavDropdown.Item href="/comparisons/players">
                Comparar Jugadores
              </NavDropdown.Item>
                </NavDropdown>
         
              <Nav.Link
                href="https://www.facebook.com/IndorCallejeroAzogues"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </Nav.Link>
            </Nav>
            <Nav.Item className="nav-login">
              <Button
                variant="outline-light"
                onClick={() => navigate("/login")}
                aria-label="Iniciar Sesión"
              >
                Iniciar Sesión
              </Button>
            </Nav.Item>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
