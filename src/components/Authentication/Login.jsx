import {
  faCheck,
  faEye,
  faEyeSlash,
  faInfoCircle,
  faTimes,
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

      setAuth({ user, pwd, roles, accessToken });
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
    <Container className="mt-5" fluid style={{ maxWidth: "40rem" }}>
      <h2 className="text-center mb-4">Iniciar sesión</h2>

      {errMsg && (
        <Alert
          ref={errRef}
          variant="danger"
          className="text-center"
          aria-live="assertive"
        >
          {errMsg}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
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
            />
            <Form.Control.Feedback type="invalid">
              <FontAwesomeIcon icon={faInfoCircle} /> Por favor, introduzca un
              correo válido.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="password" className="mb-0">
          <Form.Label>Contraseña:</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPwd ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Ejemplo1234"
              required
            />
            <Button
              variant="warning"
              onClick={toggleShowPwd}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="persist" className="mb-0">
          <Form.Check
            type="checkbox"
            label="Recordar usuario"
            checked={persist}
            onChange={togglePersist}
          />
        </Form.Group>

        <Button type="submit" disabled={!validUser || !pwd || isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" /> Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </Form>

      <p className="mt-4 text-center">
        ¿Olvidaste tu contraseña?{" "}
        <Link to="/forgot-password">Recuperar contraseña</Link>
      </p>

      <p className="text-center">
        ¿Necesitas una cuenta? <Link to="/register">Crear una cuenta</Link>
      </p>
    </Container>
  );
};

export default Login;
