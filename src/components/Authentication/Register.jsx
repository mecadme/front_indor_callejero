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
  Spinner
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import "./css/Register.css"; // Importar el archivo CSS

const USER_NAME_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9]).{8,24}$/;

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validLastName, setValidLastName] = useState(false);
  const [validUser, setValidUser] = useState(false);
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showMatchPwd, setShowMatchPwd] = useState(false);

  const REGISTER_URL = "/auth/register";

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
    setValidLastName(NAME_REGEX.test(lastName));
    setValidUser(USER_NAME_REGEX.test(user));
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [name, lastName, user, pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [name, lastName, user, pwd, matchPwd]);

  const toggleShowPwd = () => setShowPwd((prev) => !prev);
  const toggleShowMatchPwd = () => setShowMatchPwd((prev) => !prev);

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
    <Container className="mt-5" fluid style={{ maxWidth: "40rem" }}>
      {success ? (
        <section>
          <h1>Registro completado</h1>
          <p className="text-center">
            <Link to="/login">Iniciar sesión</Link>
          </p>
        </section>
      ) : (
        <>
          <h2 className="text-center mb-4">Crear una cuenta</h2>

          {errMsg && (
            <Alert ref={errRef} variant="danger" className="text-center">
              {errMsg}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* Nombre */}
            <Form.Group controlId="firstName" className="m-0">
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
                />
                <Form.Control.Feedback type="invalid">
                  <FontAwesomeIcon icon={faInfoCircle} /> El nombre no debe
                  contener números ni caracteres especiales.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* Apellido */}
            <Form.Group controlId="lastName" className="m-0">
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
                />
                <Form.Control.Feedback type="invalid">
                  <FontAwesomeIcon icon={faInfoCircle} /> El apellido no debe
                  contener números ni caracteres especiales.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* Correo */}
            <Form.Group controlId="username" className="m-0">
              <Form.Label>Correo Electrónico:</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  autoComplete="off"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="juan_perez@example.com"
                  isInvalid={user && !validUser}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  <FontAwesomeIcon icon={faInfoCircle} /> Introduzca un correo
                  válido.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {/* Contraseña */}
            <Form.Group controlId="password" className="m-0">
              <Form.Label>Contraseña:</Form.Label>
              <InputGroup className="input-with-icon">
                <Form.Control
                  type={showPwd ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="Ejemplo1234"
                  isInvalid={pwd && !validPwd}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  <FontAwesomeIcon icon={faInfoCircle} /> Debe incluir al menos
                  una minúscula y un número.
                </Form.Control.Feedback>
                <Button
                  variant="warning"
                  className="btn"
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

            {/* Repetir Contraseña */}
            <Form.Group controlId="confirm_pwd" className="m-0">
              <Form.Label>Repetir Contraseña:</Form.Label>
              <InputGroup className="input-with-icon">
                <Form.Control
                  type={showMatchPwd ? "text" : "password"}
                  value={matchPwd}
                  onChange={(e) => setMatchPwd(e.target.value)}
                  placeholder="Repite tu contraseña"
                  isInvalid={matchPwd && !validMatch}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  <FontAwesomeIcon icon={faInfoCircle} /> Las contraseñas deben
                  coincidir.
                </Form.Control.Feedback>
                <Button
                  variant="warning"
                  className="password-toggle-btn"
                  onClick={toggleShowMatchPwd}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  <FontAwesomeIcon icon={showMatchPwd ? faEyeSlash : faEye} />
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Botón de Registro */}
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
              className="w-100 btn btn-primary"
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

          <p className="mt-4 text-center">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
          </p>
        </>
      )}
    </Container>
  );
};

export default Register;
