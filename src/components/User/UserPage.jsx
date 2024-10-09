import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Image,
  Tabs,
  Tab,
} from "react-bootstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useParams } from "react-router-dom";
import ChangePassword from "./ChangePassword";
import UploadPhoto from "../Utils/UploadPhoto";

const UserPage = () => {
  const { userName, userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("info"); 
  const axiosPrivate = useAxiosPrivate();
  
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      console.error("No user data found.");
    }
  }, []);
  
  const USER_UPLOAD_PHOTO_URL = `users/upload_photo`;
  const USER_KEY_VALUE = { key: "userId", value: userId };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const UPDATE_USER_URL = `/users/${userName}`;
    try {
      await axiosPrivate.patch(UPDATE_USER_URL, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        bio: userData.bio,
        username: userData.username,
      });
      setMessage("Datos actualizados correctamente");
      localStorage.setItem("currentUser", JSON.stringify(userData));
      setActiveTab("info"); 
    } catch (error) {
      console.error("Error updating user data", error);
      setMessage("Error al actualizar los datos");
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://cdn-icons-png.flaticon.com/512/2102/2102633.png";
  };

  if (!userData) {
    return <p>Cargando datos del usuario...</p>;
  }

  return (
    <Container fluid>
      <Header />
      <Container>
        <h2>
          {userData.firstName} {userData.lastName}
        </h2>
        <p>{userData.bio}</p>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          {/* Pestaña de Información */}
          <Tab eventKey="info" title="Información de la cuenta">
            <Row>
              <Col md={4}>
                <Image
                  src={userData.imageUrl}
                  rounded
                  fluid
                  onError={handleImageError}
                />
              </Col>
              <Col md={8}>
                <h3>Información de la cuenta</h3>
                <p>
                  <strong>Cuenta creada:</strong>{" "}
                  {new Date(userData.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Cuenta Activa:</strong>{" "}
                  {userData.enabled ? "SÍ" : "NO"}
                </p>
                <p>
                  <strong>Cuenta expirada:</strong>{" "}
                  {userData.accountNoExpired ? "NO" : "SÍ"}
                </p>
                <p>
                  <strong>Cuenta bloqueada:</strong>{" "}
                  {userData.accountNoLocked ? "NO" : "SÍ"}
                </p>
                <p>
                  <strong>Credenciales expiradas:</strong>{" "}
                  {userData.credentialNoExpired ? "NO" : "SÍ"}
                </p>
                <p>
                  <strong>Roles:</strong>{" "}
                  {userData.roles.map((role) => role.roleEnum).join(", ")}
                </p>
              </Col>
            </Row>
          </Tab>

          {/* Pestaña de Actualización de Datos */}
          <Tab eventKey="edit" title="Editar perfil">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formFirstName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={userData.firstName || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formLastName">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={userData.lastName || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formUsername">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="username"
                  value={userData.username || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBio">
                <Form.Label>Biografía</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="bio"
                  value={userData.bio || ""}
                  onChange={handleChange}
                />
              </Form.Group>
              <UploadPhoto
                entity={USER_KEY_VALUE}
                endpointUrl={USER_UPLOAD_PHOTO_URL}
              />

              <Button variant="primary" type="submit">
                Actualizar
              </Button>
              {message && <p className="mt-3">{message}</p>}
            </Form>
          </Tab>

          {/* Pestaña de Actualización de Contraseña */}
          <Tab eventKey="password" title="Cambiar contraseña">
            <ChangePassword onSuccess={() => setActiveTab("info")} />
          </Tab>
        </Tabs>
      </Container>
      <Footer />
    </Container>
  );
};

export default UserPage;
