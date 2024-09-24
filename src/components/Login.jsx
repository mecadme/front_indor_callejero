import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

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
        JSON.stringify({
          username: user,
          password: pwd,
        }),
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
      if (!err?.response) {
        setErrMsg("Servidor no disponible.");
      } else if (err.response?.status === 400) {
        setErrMsg("Usuario o contrasena incorrectos.");
      } else if (err.response?.status === 401) {
        setErrMsg("Usuario o contrasena incorrectos.");
      } else if (err.response?.status === 403) {
        setErrMsg("Usuario o contrasena incorrectos.");
      } else {
        setErrMsg("Error en la autenticación.");
      }
      console.log(err);
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
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Usuario:
          <FontAwesomeIcon
            icon={faCheck}
            className={validUser ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validUser || !user ? "hide" : "invalid"}
          />
        </label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          placeholder="juan_perez@example.com"
          value={user}
          required
          aria-invalid={validUser ? "false" : "true"}
          aria-describedby="uidnote"
        />
        <p
          id="uidnote"
          className={user && !validUser ? "instructions" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Por favor, introduzca un correo válido.
        </p>

        <label htmlFor="password">Contraseña:</label>
        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            type={showPwd ? "text" : "password"}
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Ejemplo1234"
            value={pwd}
            required
            aria-describedby="pwdnote"
          />
          <button
            type="button"
            className="showPwd"
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

        <button type="submit" disabled={!validUser || !pwd || isLoading}>
          {isLoading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Iniciando sesión...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </button>
            <div className="persistCheck">
              <input
                type="checkbox"
                id="persist"
                onChange={togglePersist}
                checked={persist}
              />
              <label htmlFor="persist">Recordar usuario</label>
            </div>
      </form>

      <p className="pwdForgot">
        ¿Olvidaste tu contraseña? <br />
        <span className="line">
          <a href="/forgot-password">Recuper contraseña</a>
        </span>
      </p>

      <p className="linkContainer">
        ¿Necesitas una cuenta? <br />
        <span className="line">
          <a href="/register">Crear una cuenta</a>
        </span>
      </p>
    </section>
  );
};

export default Login;
