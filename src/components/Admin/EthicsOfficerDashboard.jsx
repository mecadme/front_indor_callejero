import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Tab,
  Table,
  Tabs
} from "react-bootstrap";
import {
  useCreateEthicsOfficer,
  useDeleteEthicsOfficer,
  useGetEthicsOfficers,
  useUpdateEthicsOfficer,
} from "../../api/Service/EthicsOfficerService";
import { useGetTeams } from "../../api/Service/TeamService"; // Para obtener los equipos
import UploadPhoto from "../Utils/UploadPhoto"; // Componente de subir foto

const handleImageError = (e) => {
  e.target.src = "https://cdn-icons-png.flaticon.com/512/2102/2102633.png";
};

const EthicsOfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [ethicsOfficers, setEthicsOfficers] = useState([]);
  const [selectedEthicsOfficer, setSelectedEthicsOfficer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allEthicsOfficers, getEthicsOfficers } = useGetEthicsOfficers();
  const { data: allTeams, getTeams } = useGetTeams();
  console.log("Todos los oficiales:", allEthicsOfficers);
  console.log("Todos los equipos:", allTeams);
  const { createEthicsOfficer } = useCreateEthicsOfficer();
  const { updateEthicsOfficer } = useUpdateEthicsOfficer();
  const { deleteEthicsOfficer } = useDeleteEthicsOfficer();

  useEffect(() => {
    getEthicsOfficers();
    getTeams();
  }, []);

  useEffect(() => {
    if (allEthicsOfficers) {
      setEthicsOfficers(allEthicsOfficers);
    }
  }, [allEthicsOfficers]);

  const handleCreateEthicsOfficer = async (newEthicsOfficer) => {
    await createEthicsOfficer(newEthicsOfficer);
    getEthicsOfficers();
    setActiveTab("list");
  };

  const handleEditClick = (ethicsOfficer) => {
    setSelectedEthicsOfficer(ethicsOfficer);
    setActiveTab("edit");
  };

  const handleDeleteClick = async (ethicsOfficerId) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este oficial ético?")
    ) {
      await deleteEthicsOfficer(ethicsOfficerId);
      getEthicsOfficers();
      setActiveTab("list");
    }
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Lista de Oficiales Éticos">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Bio</th>
              <th>Equipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ethicsOfficers.map((ethicsOfficer) => (
              <tr key={ethicsOfficer.ethicsOfficerId}>
                <td>{ethicsOfficer.ethicsOfficerId}</td>
                <td>
                  <img
                    src={ethicsOfficer.photoUrl}
                    alt={`${ethicsOfficer.ethicsOfficer}`}
                    className="user-photo"
                    aria-hidden="true"
                    aria-label={`${ethicsOfficer.ethicsOfficer}`}
                    title={`${ethicsOfficer.ethicsOfficer}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer-when-downgrade"
                    width="40"
                    height="40"
                    onError={handleImageError}
                  />
                </td>
                <td>{ethicsOfficer.ethicsOfficer}</td>
                <td>{ethicsOfficer.bio}</td>
                <td>{ethicsOfficer.team?.neighborhood || "Sin equipo"}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(ethicsOfficer)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDeleteClick(ethicsOfficer.ethicsOfficerId)
                    }
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Tab>

      <Tab eventKey="create" title="Crear Oficial Ético">
        <EthicsOfficerForm
          onSubmit={handleCreateEthicsOfficer}
          teams={allTeams}
          buttonText="Crear Oficial Ético"
        />
      </Tab>

      <Tab eventKey="edit" title="Editar Oficial Ético">
        {selectedEthicsOfficer ? (
          <EthicsOfficerForm
            ethicsOfficer={selectedEthicsOfficer}
            teams={allTeams}
            onSubmit={async (updatedEthicsOfficer) => {
              await updateEthicsOfficer(
                selectedEthicsOfficer.ethicsOfficerId,
                updatedEthicsOfficer
              );
              setSelectedEthicsOfficer(null);
              getEthicsOfficers();
              setActiveTab("list");
            }}
            buttonText="Actualizar Oficial Ético"
          />
        ) : (
          <p>Selecciona un oficial ético para editar.</p>
        )}
      </Tab>
    </Tabs>
  );
};

const EthicsOfficerForm = ({
  ethicsOfficer = {},
  teams = [],
  onSubmit,
  buttonText,
}) => {
  const isUpdating = Boolean(ethicsOfficer.ethicsOfficerId);
  const [formData, setFormData] = useState({
    bio: ethicsOfficer.bio || "",
    photoUrl: ethicsOfficer.photoUrl || "",
    ethicsOfficer: ethicsOfficer.ethicsOfficer || "",
    teamId: ethicsOfficer.team?.teamId || "", // Solo almacenar el teamId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (photoUrl) => {
    setFormData((prevState) => ({
      ...prevState,
      photoUrl,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ethicsOfficerPayload = {
      ...formData,
      team: { teamId: formData.teamId }, 
    };

    onSubmit(ethicsOfficerPayload);
  };

  const ETHICS_OFFICER_KEY_VALUE = {
    key: "ethics_officer_id",
    value: ethicsOfficer.ethicsOfficerId,
  };
  const ETHICS_OFFICER_URL = "/ethics_officers/upload_photo";

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nombre del Oficial Ético</Form.Label>
          <Form.Control
            type="text"
            name="ethicsOfficer"
            value={formData.ethicsOfficer}
            onChange={handleChange}
            placeholder="Ingresa el nombre del oficial ético"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Ingresa una breve bio"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Foto</Form.Label>
          {isUpdating && ethicsOfficer?.photoUrl && (
            <Container className="d-flex justify-content-center">
              <img
                src={ethicsOfficer.photoUrl}
                alt={`${ethicsOfficer.ethicsOfficer}`}
                className="user-photo"
                aria-hidden="true"
                aria-label={`${ethicsOfficer.ethicsOfficer}`}
                title={`${ethicsOfficer.ethicsOfficer}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer-when-downgrade"
                width="400"
                height="400"
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "0.5rem",
                }}
                onError={handleImageError}
              />
            </Container>
          )}
          <Container>
            <UploadPhoto
              entity={ETHICS_OFFICER_KEY_VALUE}
              endpointUrl={ETHICS_OFFICER_URL}
              onFileChange={handleFileChange}
            />
          </Container>
        </Form.Group>

        <Form.Group>
          <Form.Label>Equipo</Form.Label>
          <Form.Control
            as="select"
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
          >
            <option value="">Selecciona un equipo</option>
            {teams?.map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.neighborhood}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button variant="success" type="submit">
          {buttonText}
        </Button>
      </Form>
    </Container>
  );
};

export default EthicsOfficerDashboard;
