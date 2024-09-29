import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faSpinner,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import {
  Form,
  Button,
  InputGroup,
  Container,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "../../api/axios";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const RESET_PASSWORD_URL = "/auth/resetPassword";

const ForgotPassword = () => {
  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setErrMsg("");
    setSuccessMsg("");
  }, [email, newPassword]);

  const toggleShowPwd = () => setShowPwd((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validEmail) {
      setErrMsg("Por favor, introduzca un correo válido.");
      errRef.current.focus();
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        RESET_PASSWORD_URL,
        JSON.stringify({ email, newPassword }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setSuccessMsg("Contraseña restablecida con éxito.");
      setEmail("");
      setNewPassword("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Servidor no disponible.");
      } else if (err.response?.status === 400 || err.response?.status === 404) {
        setErrMsg("El usuario no existe.");
      } else {
        setErrMsg("Error al restablecer la contraseña.");
      }
      errRef.current.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5" fluid style={{ maxWidth: "40rem" }}>
      <h2 className="text-center mb-4">Recuperar Contraseña</h2>

      {/* Mensajes de error */}
      {errMsg && (
        <Alert ref={errRef} variant="danger" className="text-center">
          {errMsg}
        </Alert>
      )}

      {/* Mensaje de éxito */}
      {successMsg && (
        <Alert variant="success" className="text-center">
          {successMsg}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Correo Electrónico:</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              ref={emailRef}
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan_perez@example.com"
              isInvalid={email && !validEmail}
              required
            />
            <Form.Control.Feedback type="invalid">
              <FontAwesomeIcon icon={faInfoCircle} /> Por favor, introduzca un
              correo válido.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="newPassword" className="mb-0">
          <Form.Label>Nueva Contraseña:</Form.Label>
          <InputGroup>
            <Form.Control
              type={showPwd ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

        <Button
          type="submit"
          variant="primary"
          className="w-100"
          disabled={!validEmail || !newPassword || isLoading}
        >
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" /> Enviando solicitud...
            </>
          ) : (
            "Restablecer Contraseña"
          )}
        </Button>
      </Form>

      <p className="text-center mt-4">
        ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
      </p>
    </Container>
  );
};

export default ForgotPassword;
