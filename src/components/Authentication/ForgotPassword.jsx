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
    <section>
      {/* Mensajes de error */}
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>

      {/* Mensaje de éxito */}
      <p
        className={successMsg ? "successmsg" : "offscreen"}
        aria-live="assertive"
      >
        {successMsg}
      </p>

      <h1>Recuperar contraseña</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Correo electrónico:
          <FontAwesomeIcon
            icon={faCheck}
            className={validEmail ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validEmail || !email ? "hide" : "invalid"}
          />
        </label>
        <input
          type="text"
          id="email"
          ref={emailRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="juan_perez@example.com"
          required
          aria-invalid={validEmail ? "false" : "true"}
          aria-describedby="emailnote"
        />
        <p
          id="emailnote"
          className={email && !validEmail ? "instructions" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Por favor, introduzca un correo válido.
        </p>

        <label htmlFor="newPassword">Nueva contraseña:</label>
        <div style={{ position: "relative" }}>
        <input
          type={showPwd ? "text" : "password"}
          id="newPassword"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          placeholder="Ejemplo1234"
          required
        />
        <button
          className="showPwd"
          type="button"
          onClick={toggleShowPwd}
          style={{
            position: "absolute",
            left: "45%",
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
        </button>
        </div>

        <button
          type="submit"
          disabled={!validEmail || !newPassword || isLoading}
        >
          {isLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Enviando solicitud...
            </>
          ) : (
            "Restablecer contraseña"
          )}
        </button>
      </form>

      <p className="linkContainer">
        ¿Ya tienes una cuenta? <br />
        <span className="line">
          <a href="/login">Iniciar sesión</a>
        </span>
      </p>
    </section>
  );
};

export default ForgotPassword;
