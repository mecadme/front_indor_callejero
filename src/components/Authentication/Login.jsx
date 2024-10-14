import {
  faEye,
  faEyeSlash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import Header from "../Header/Header";
import "./css/Login.css";

const USER_NAME_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validUser, setValidUser] = useState(false);
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const LOGIN_URL = "/auth/login";

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUser(USER_NAME_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const toggleShowPwd = () => setShowPwd((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validUser) {
      setErrMsg("Por favor, introduzca un correo válido.");
      errRef.current.focus();
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: user, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = response?.data?.accessToken;
      const decodedToken = jwtDecode(accessToken);
      const roles = decodedToken?.authorities
        ? decodedToken.authorities.split(",")
        : [];

      setAuth({ user, roles, accessToken });
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      if (!err?.response) {
        setErrMsg("Servidor no disponible.");
      } else if ([400, 401, 403].includes(status)) {
        setErrMsg("Usuario o contraseña incorrectos.");
      } else {
        setErrMsg("Error en la autenticación.");
      }
      errRef.current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <Container fluid className="p-0 justify-content-center align-items-center">
      <Header showTeamsBar={false} />

      <Container className="login-container mt-5" fluid>
        <h2 className="login-title text-center mb-4">Iniciar sesión</h2>

        {errMsg && (
          <Alert
            ref={errRef}
            variant="danger"
            className="login-error text-center"
            aria-live="assertive"
          >
            {errMsg}
          </Alert>
        )}

        <Form className="login-form" onSubmit={handleSubmit}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Usuario:</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                ref={userRef}
                autoComplete="off"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="juan_perez@example.com"
                isInvalid={user && !validUser}
                required
                className="login-input"
              />
              <Form.Control.Feedback type="invalid" className="login-feedback">
                <FontAwesomeIcon icon={faInfoCircle} /> Por favor, introduzca un
                correo válido.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Contraseña:</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPwd ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Ejemplo1234"
                required
                className="login-input"
              />
              <Button
                variant="outline-secondary"
                onClick={toggleShowPwd}
                className="login-show-password-btn"
              >
                <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="persist" className="mb-3">
            <Form.Check
              type="checkbox"
              label="Recordar usuario"
              checked={persist}
              onChange={togglePersist}
              className="login-checkbox"
            />
          </Form.Group>

          <Button
            type="submit"
            className="login-submit-btn"
            disabled={!validUser || !pwd || isLoading}
          >
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" /> Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </Form>

        <p className="login-forgot-password mt-4 text-center">
          ¿Olvidaste tu contraseña?{" "}
          <br />
          <Link to="/forgot-password" className="login-link">
            Recuperar contraseña
          </Link>
        </p>

        <p className="login-create-account text-center">
          ¿Necesitas una cuenta?{" "}
          <br />
          <Link to="/register" className="login-link">
            Crear una cuenta
          </Link>
        </p>
      </Container>
    </Container>
  );
};

export default Login;
