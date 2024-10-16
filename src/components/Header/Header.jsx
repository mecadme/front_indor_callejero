import { useState } from "react";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/indor_callejero_logo.png";
import TeamsBarComponent from "./TeamsBarComponent";
import { jwtDecode } from "jwt-decode";
import Loading from "../Utils/Loading";
import useFetchTeams from "../../hooks/useFetchTeams";
import useFetchUser from "../../hooks/useFetchUser";
import useAuth from "../../hooks/useAuth";
import useLogOut from "../../hooks/useLogOut";
import RoleBased from "../Administration/RoleBased";
import "./css/Header.css";

const Header = ({ showTeamsBar = true }) => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();

  const { teams, isLoading: teamsLoading, error: teamsError } = useFetchTeams();
  const { auth } = useAuth();
  const decodedToken = auth?.accessToken ? jwtDecode(auth.accessToken) : null;
  const userName = auth?.user?.username || decodedToken?.sub || null;
  const {
    user,
    isLoading: userIsLoading,
    error: userError,
  } = useFetchUser(userName);
  const logOut = useLogOut();

  const handleUserClick = (user) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
    navigate(`/user/${user.username}/${user.userId}`);
  };

  const handleImageError = (e) => {
    e.target.src = "https://cdn-icons-png.flaticon.com/512/2102/2102633.png";
  };

  const handleTeamSelection = (teamId) => {
    setSelectedTeam(teamId);
    navigate(`/team/${teamId}`);
  };

  const handleSignOut = async () => {
    await logOut();
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const renderUserInfo = () => {
    if (userIsLoading) return <Loading />;
    if (userError)
      return <div className="error-message">Error: {userError}</div>;
    if (!user) return null;

    return (
      <Container
        onClick={() => handleUserClick(user)}
        style={{ cursor: "pointer" }}
        className="d-flex flex-column align-items-center justify-content-center m-0 p-0"
      >
        <div className="user-info d-flex justify-content-between align-items-center p-2 rounded">
          <img
            src={user.imageUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="user-photo"
            onError={handleImageError}
            width="40"
            height="40"
          />
          <span className="user-name ms-2" style={{ fontSize: "1rem" }}>
            {user.firstName} {user.lastName}
          </span>
        </div>
        <Button
          variant="outline-light"
          onClick={handleSignOut}
          style={{ marginRight: "0.5rem", width: "auto" }}
        >
          <span className="text-capitalize" style={{ fontSize: "1rem" }}>
            Cerrar Sesión
          </span>
        </Button>
      </Container>
    );
  };

  if (teamsLoading || userIsLoading) {
    return <Loading />;
  }

  if (teamsError || userError) {
    return (
      <div className="error-message">Error: {teamsError || userError}</div>
    );
  }

  return (
    <header className="header">
      {showTeamsBar && (<TeamsBarComponent content={teams} getAllTeams={handleTeamSelection} />)}
      <Navbar expand="lg" className="navbarHeader m-0 p-0" sticky="top">
        <Container className="containerHeader p-0 w-100">
          <Navbar.Brand className="navbar-logo">
            <Link to="/" className="nav-link">
              <img src={logo} alt="IndorCallejero logo" className="logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Item>
                <Link
                  to="/street_project"
                  className="nav-link"
                  aria-label="Proyecto Callejero"
                >
                  Proyecto Callejero
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link
                  to="/all_you_need_to_know"
                  className="nav-link"
                  aria-label="Todo lo que debes saber"
                >
                  Todo lo que debes saber
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link
                  to="/historical_events"
                  className="nav-link"
                  aria-label="Palmarés Históricos"
                >
                  Palmarés Históricos
                </Link>
              </Nav.Item>
              <RoleBased allowedRoles={["ROLE_USER"]}>
                <Nav.Item>
                  <NavDropdown title="Comparaciones" id="comparisons-dropdown">
                    <NavDropdown.Item>
                      <Link to="/comparisons/teams" className="dropdown-item">
                        Comparar Equipos
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/comparisons/players" className="dropdown-item">
                        Comparar Jugadores
                      </Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav.Item>
              </RoleBased>

              <RoleBased allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER"]}>
                <Nav.Item>
                  <NavDropdown title="Administración" id="admin-dropdown">
                    <RoleBased allowedRoles={["ROLE_ADMIN"]}>
                      <NavDropdown.Item>
                        <Link to="/management/admin" className="dropdown-item">
                          Administrar Sistema
                        </Link>
                      </NavDropdown.Item>
                    </RoleBased>
                    <RoleBased allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER"]}>
                      <NavDropdown.Item>
                        <Link
                          to="/management/manager"
                          className="dropdown-item"
                        >
                          Administrar Partidos
                        </Link>
                      </NavDropdown.Item>
                    </RoleBased>
                  </NavDropdown>
                </Nav.Item>
              </RoleBased>

              <Nav.Item>
                <Nav.Link
                  href="https://www.facebook.com/IndorCallejeroAzogues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav className="nav-login">
              {user ? (
                renderUserInfo()
              ) : (
                showTeamsBar && (<Button
                  variant="outline-light"
                  onClick={() => navigate("/login")}
                >
                  Iniciar Sesión
                </Button>)
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
