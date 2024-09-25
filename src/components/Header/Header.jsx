import { useState } from "react";
import logo from "../../assets/indor_callejero_logo.png";
import TeamsBarComponent from "./TeamsBarComponent.jsx";
import "./css/Header.css";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useFetchTeams from "../../hooks/useFetchTeams.jsx"; 
const Header = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();

  const { teams, isLoading, error } = useFetchTeams();
  
  console.log(teams); // Usamos el hook para obtener los equipos

  const getAllTeams = (teamId) => {
    setSelectedTeam(teamId);
    navigate(`/team/${teamId}`); // Navegamos a la página del equipo seleccionado
  };

  return (
    <header className="header">
      <TeamsBarComponent content={teams} getAllTeams={getAllTeams} />
      <Navbar expand="lg" className="navbarHeader" sticky="top">
        <Container className="containerHeader">
          <Navbar.Brand href="https://www.facebook.com/IndorCallejeroAzogues" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="IndorCallejero" className="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav.Link href="/proyecto_callejero">Proyecto Callejero</Nav.Link>
            <Nav.Link href="/todo_lo_que_debes_saber">Todo lo que debes saber</Nav.Link>
            <Nav.Link href="/palmares_historicos">Palmares Históricos</Nav.Link>
            <Nav.Link href="/pronostico_resultados">Pronóstico de Resultados</Nav.Link>
            <Nav.Item>
              <Button variant="primary"
                onClick={() => navigate("/login")}>Iniciar Sesión</Button>
            </Nav.Item>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
