import { useState } from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/indor_callejero_logo.png";
import TeamsBarComponent from "./TeamsBarComponent";
import { jwtDecode } from "jwt-decode"; // jwtDecode is not imported as named
import Loading from "../Utils/Loading";
import useFetchTeams from "../../hooks/useFetchTeams";
import useFetchUser from "../../hooks/useFetchUser";
import useAuth from "../../hooks/useAuth";
import useLogOut from "../../hooks/useLogOut";
import RoleBased from "../Administration/RoleBased";
import { Link } from "react-router-dom";
import "./css/Header.css";

const Header = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();
  const { teams, isLoading, error } = useFetchTeams();
  const { auth } = useAuth();
  const logout = useLogOut();
  console.log(auth.accessToken);
  const decodedToken = auth?.accessToken ? jwtDecode(auth.accessToken) : null;
  const userName = auth?.user?.username || decodedToken?.sub || null;

  const { user, userIsLoading, userError } = useFetchUser(userName);

  const renderUserInfo = (user) => {
    const handleUserClick = (user) => {
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate(`/user/${user.username}`);
    };
    console.log(user);
    if (!user) return null;

    if (userIsLoading) return <Loading />;
    if (userError)
      return <div className="error-message">Error: {userError}</div>;

    const handleImageError = (e) => {
      e.target.src = "https://cdn-icons-png.flaticon.com/512/2102/2102633.png";
    };

    return (
      <Container
        onClick={() => handleUserClick(user)}
        style={{ cursor: "pointer" }}
        className=" d-flex flex-column align-items-center justify-content-center m-0 p-0"
      >
        <div className="user-info d-flex justify-content-between align-items-center p-2 rounded">
          <img
            src={user.imageUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="user-photo"
            aria-hidden="true"
            aria-label={`${user.firstName} ${user.lastName}`}
            title={`${user.firstName} ${user.lastName}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer-when-downgrade"
            width="40"
            height="40"
            onError={handleImageError}
          />
          <span
            className="user-name ms-2"
            aria-hidden="true"
            style={{ fontSize: "1.5rem" }}
          >
            {user.firstName} {user.lastName}
          </span>
        </div>

        <Button
          variant="outline-dark"
          onClick={logout}
          aria-label="Cerrar Sesión"
          title="Cerrar Sesión"
          style={{ marginRight: "0.5rem", width: "auto" }}
        >
          <span className="text-capitalize" style={{ fontSize: "1rem" }}>
            Cerrar Sesión
          </span>
        </Button>
      </Container>
    );
  };

  // Mostrar spinner si se está cargando la info
  if (isLoading || userIsLoading) {
    return <Loading />;
  }

  // Manejo de errores de los hooks
  if (error || userError) {
    return <div className="error-message">Error: {error || userError}</div>;
  }

  const handleTeamSelection = (teamId) => {
    setSelectedTeam(teamId);
    navigate(`/team/${teamId}`);
  };

  return (
    <header className="header">
      <TeamsBarComponent content={teams} getAllTeams={handleTeamSelection} />
      <Navbar expand="lg" className="navbarHeader" sticky="top">
        <Container className="containerHeader">
          <Navbar.Brand className="navbar-logo">
            <Link to="/" className="nav-link">
              <img src={logo} alt="IndorCallejero logo" className="logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link aria-label="Proyecto Callejero">
                <Link to="/street_project" className="nav-link">
                  Proyecto Callejero
                </Link>
              </Nav.Link>
              <Nav.Link aria-label="Todo lo que debes saber">
                <Link to="/all_you_need_to_know" className="nav-link">
                  Todo lo que debes saber
                </Link>
              </Nav.Link>
              <Nav.Link aria-label="Palmarés Históricos">
                <Link to="/historical_events" className="nav-link">
                  Palmarés Históricos
                </Link>
              </Nav.Link>
              <NavDropdown title="Comparaciones" id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <Link to="/comparisons/teams" className="nav-link">
                    Comparar Equipos
                  </Link>
                </NavDropdown.Item>
                <Link to="/comparisons/players" className="nav-link">
                  Comparar Equipos
                </Link>
              </NavDropdown>
              <RoleBased allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER"]}>
                <NavDropdown title="Administración" id="basic-nav-dropdown">
                  <RoleBased allowedRoles={["ROLE_ADMIN"]}>
                    <NavDropdown.Item>
                      <Link to="/managment/admin" className="nav-link">
                        Administrar Sistema
                      </Link>
                    </NavDropdown.Item>
                  </RoleBased>
                  <RoleBased allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER"]}>
                    <NavDropdown.Item>
                      <Link to="/managment/manager" className="nav-link">
                        Administrar Partidos
                      </Link>
                    </NavDropdown.Item>
                  </RoleBased>
                </NavDropdown>
              </RoleBased>
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
              {user ? (
                renderUserInfo(user)
              ) : (
                <Button
                  variant="outline-light"
                  onClick={() => navigate("/login")}
                  aria-label="Iniciar Sesión"
                >
                  Iniciar Sesión
                </Button>
              )}
            </Nav.Item>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
