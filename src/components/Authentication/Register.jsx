import {
  faEye,
  faEyeSlash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Container,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import "./css/Register.css";
import Header from "../Header/Header";

// Regex patterns for validation
const USER_NAME_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9]).{8,24}$/;

const Register = () => {
  // Refs
  const userRef = useRef();
  const errRef = useRef();

  // Form State
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");

  // Error & Validation State
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [validName, setValidName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [validUser, setValidUser] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);

  // Password visibility toggles
  const [showPwd, setShowPwd] = useState(false);
  const [showMatchPwd, setShowMatchPwd] = useState(false);

  const REGISTER_URL = "/auth/register";

  // Focus on the first input field on component mount
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Validate form fields on change
  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
    setValidLastName(NAME_REGEX.test(lastName));
    setValidUser(USER_NAME_REGEX.test(user));
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [name, lastName, user, pwd, matchPwd]);

  // Reset error message when any form field changes
  useEffect(() => {
    setErrMsg("");
  }, [name, lastName, user, pwd, matchPwd]);

  // Toggle password visibility
  const toggleShowPwd = () => setShowPwd((prev) => !prev);
  const toggleShowMatchPwd = () => setShowMatchPwd((prev) => !prev);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validUser ||
      !validPwd ||
      !validMatch ||
      !validName ||
      !validLastName
    ) {
      setErrMsg("Por favor, verifique sus credenciales");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          firstName: name,
          lastName: lastName,
          username: user,
          password: pwd,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No hay respuesta del servidor");
      } else if (err.response?.status === 409) {
        setErrMsg("El usuario ya existe");
      } else {
        setErrMsg("Registro fallido");
      }
      errRef.current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="p-0 justify-content-center align-items-center">
      <Header showTeamsBar={false} />
      <Container className="register-container mt-5" fluid>
        {success ? (
          <section>
            <h1 className="register-success-title">Registro completado</h1>
            <p className="text-center">
              <Link to="/login" className="register-link">
                Iniciar sesión
              </Link>
            </p>
          </section>
        ) : (
          <Container>
            <h2 className="register-title text-center mb-0">
              Crear una cuenta
            </h2>

            {errMsg && (
              <Alert
                ref={errRef}
                variant="danger"
                className="register-error text-center"
              >
                {errMsg}
              </Alert>
            )}

            <Form className="register-form" onSubmit={handleSubmit}>
              <Form.Group controlId="firstName" className="mb-0">
                <Form.Label>Nombre:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    ref={userRef}
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan"
                    isInvalid={name && !validName}
                    required
                    className="register-input"
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="register-feedback"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} /> El nombre no debe
                    contener números ni caracteres especiales.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="lastName" className="mb-0">
                <Form.Label>Apellido:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    autoComplete="off"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Perez"
                    isInvalid={lastName && !validLastName}
                    required
                    className="register-input"
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="register-feedback"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} /> El apellido no debe
                    contener números ni caracteres especiales.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="username" className="mb-0">
                <Form.Label>Correo Electrónico:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="email"
                    autoComplete="off"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="juan_perez@example.com"
                    isInvalid={user && !validUser}
                    required
                    className="register-input"
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="register-feedback"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} /> Introduzca un correo
                    válido.
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
                    isInvalid={pwd && !validPwd}
                    required
                    className="register-input"
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="register-feedback"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} /> Debe incluir al
                    menos una minúscula y un número.
                  </Form.Control.Feedback>
                  <Button
                    variant="outline-secondary"
                    onClick={toggleShowPwd}
                    className="register-show-password-btn"
                  >
                    <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="confirm_pwd" className="mb-0">
                <Form.Label>Repetir Contraseña:</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showMatchPwd ? "text" : "password"}
                    value={matchPwd}
                    onChange={(e) => setMatchPwd(e.target.value)}
                    placeholder="Repite tu contraseña"
                    isInvalid={matchPwd && !validMatch}
                    required
                    className="register-input"
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className="register-feedback"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} /> Las contraseñas
                    deben coincidir.
                  </Form.Control.Feedback>
                  <Button
                    variant="outline-secondary"
                    onClick={toggleShowMatchPwd}
                    className="register-show-password-btn"
                  >
                    <FontAwesomeIcon icon={showMatchPwd ? faEyeSlash : faEye} />
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                type="submit"
                disabled={
                  !validName ||
                  !validLastName ||
                  !validUser ||
                  !validPwd ||
                  !validMatch ||
                  isLoading
                }
                className="register-submit-btn"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Registrando...
                  </>
                ) : (
                  "Registrar"
                )}
              </Button>
            </Form>

            <p className="register-login-link mt-4 text-center">
              ¿Ya tienes una cuenta?{" "}
              <br/>
              <Link to="/login" className="register-link">
                Inicia Sesión
              </Link>
            </p>
          </Container>
        )}
      </Container>
    </Container>
  );
};

export default Register;
