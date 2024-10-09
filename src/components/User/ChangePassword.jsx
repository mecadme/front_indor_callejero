import React, { useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;

const ChangePassword = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [matchPwd, setMatchPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showMatchPwd, setShowMatchPwd] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(newPassword));
    setValidMatch(newPassword === matchPwd);
  }, [newPassword, matchPwd]);

  const toggleShowPwd = () => setShowPwd((prev) => !prev);
  const toggleShowMatchPwd = () => setShowMatchPwd((prev) => !prev);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const CHANGE_PASSWORD_URL = `auth/changePassword`;

    if (!validPwd || !validMatch) {
      setPasswordMessage("Las contraseñas no son válidas o no coinciden.");
      return;
    }

    try {
      await axiosPrivate.post(CHANGE_PASSWORD_URL, {
        email,
        oldPassword,
        newPassword,
      });

      setPasswordMessage("Contraseña actualizada correctamente");
      onSuccess(); // Volver a la pestaña de información tras el éxito
    } catch (error) {
      setPasswordMessage(error.response ? `Error: ${error.response.data}` : "Error al actualizar la contraseña");
    }
  };

  return (
    <Form onSubmit={handlePasswordChange}>
      <Form.Group controlId="formEmail">
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formOldPassword">
        <Form.Label>Contraseña Antigua</Form.Label>
        <Form.Control
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formNewPassword">
        <Form.Label>Nueva Contraseña</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPwd ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ejemplo1234"
            isInvalid={newPassword && !validPwd}
            required
          />
          <Button variant="warning" onClick={toggleShowPwd}>
            <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group controlId="confirmPwd">
        <Form.Label>Repetir Contraseña</Form.Label>
        <InputGroup>
          <Form.Control
            type={showMatchPwd ? "text" : "password"}
            value={matchPwd}
            onChange={(e) => setMatchPwd(e.target.value)}
            placeholder="Repite tu contraseña"
            isInvalid={matchPwd && !validMatch}
            required
          />
          <Button variant="warning" onClick={toggleShowMatchPwd}>
            <FontAwesomeIcon icon={showMatchPwd ? faEyeSlash : faEye} />
          </Button>
        </InputGroup>
      </Form.Group>

      <Button variant="primary" type="submit">
        Actualizar Contraseña
      </Button>

      {passwordMessage && <p className="mt-3">{passwordMessage}</p>}
    </Form>
  );
};

export default ChangePassword;
