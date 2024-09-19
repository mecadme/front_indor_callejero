import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faEye,
  faEyeSlash,
  faSpinner, // Importar icono de carga
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";

const USER_NAME_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NAME_REGEX = /^[a-zA-Z]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

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
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

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

    setIsLoading(true); // Activar el estado de carga

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
          withCredentials: true
        }
      );
      console.log(JSON.stringify(response));
      setSuccess(true);
    } catch (err) {
      if (!err.response) {
        setErrMsg("No hay respuesta del servidor");
      } else if (err.response.status === 409) {
        setErrMsg("El usuario ya existe");
      } else {
        setErrMsg("Registro fallido");
      }
      errRef.current.focus();
    } finally {
      setIsLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Registro completado</h1>
          <p>
            <a href="#">Iniciar sesión</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Registro</h1>
          {isLoading ? ( // Mostrar mensaje de carga
            <div>
              <FontAwesomeIcon icon={faSpinner} spin />
              <span>Cargando...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor="firstName">
                Ingrese su nombre:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validName ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validName || !name ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="firstName"
                ref={userRef}
                autoComplete="off"
                placeholder="Juan"
                onChange={(e) => setName(e.target.value)}
                required
                value={name}
                aria-invalid={!validName}
                aria-describedby="nameNote"
              />
              <p
                id="nameNote"
                className={name && !validName ? "instructions" : "offscreen"}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                El nombre no debe contener números, caracteres especiales o
                espacios.
              </p>

              <label htmlFor="lastName">
                Ingrese su apellido:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validLastName ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validLastName || !lastName ? "hide" : "invalid"}
                />
              </label>
              <input
                type="text"
                id="lastName"
                autoComplete="off"
                placeholder="Perez"
                onChange={(e) => setLastName(e.target.value)}
                required
                value={lastName}
                aria-invalid={!validLastName}
                aria-describedby="lastNameNote"
              />
              <p
                id="lastNameNote"
                className={
                  lastName && !validLastName ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                El apellido no debe contener números, caracteres especiales o
                espacios.
              </p>

              <label htmlFor="username">
                Ingrese su correo electrónico:
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
                placeholder="juan_perez@example.com"
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                required
                value={user}
                aria-invalid={!validUser}
                aria-describedby="userNote"
              />
              <p
                id="userNote"
                className={user && !validUser ? "instructions" : "offscreen"}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Ingrese un correo electrónico válido.
              </p>

              <label htmlFor="password">
                Contraseña:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPwd || !pwd ? "hide" : "invalid"}
                />
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  id="password"
                  placeholder="Ejemplo1234"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={!validPwd}
                  aria-describedby="pwdNote"
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
              <p
                id="pwdNote"
                className={pwd && !validPwd ? "instructions" : "offscreen"}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Debe incluir al menos una letra mayúscula, una letra minúscula y
                un número.
              </p>

              <label htmlFor="confirm_pwd">
                Repetir Contraseña:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validMatch && matchPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validMatch || !matchPwd ? "hide" : "invalid"}
                />
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showMatchPwd ? "text" : "password"}
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={!validMatch}
                  aria-describedby="confirmNote"
                />
                <button
                  type="button"
                  className="showPwd"
                  onClick={toggleShowMatchPwd}
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
                  <FontAwesomeIcon icon={showMatchPwd ? faEyeSlash : faEye} />
                </button>
              </div>
              <p
                id="confirmNote"
                className={matchPwd && !validMatch ? "instructions" : "offscreen"}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Debe coincidir con la entrada anterior.
              </p>

              <button
                disabled={
                  !validName ||
                  !validLastName ||
                  !validUser ||
                  !validPwd ||
                  !validMatch ||
                  isLoading // Desactivar botón durante carga
                }
              >
                Registrar
              </button>
            </form>
          )}
          <p className="linkContainer">
            ¿Ya tienes una cuenta? <br />
            <span className="line">
              <a href="/login">Inicia Sesión</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
