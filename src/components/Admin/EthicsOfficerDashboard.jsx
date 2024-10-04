import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import {
  useGetEthicsOfficers,
  useCreateEthicsOfficer,
  useUpdateEthicsOfficer,
  useDeleteEthicsOfficer,
} from "../../api/Service/EthicsOfficerService";
import { useGetTeams } from "../../api/Service/TeamService";
import UploadPhoto from "../Utils/UploadPhoto";

const EthicsOfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allOfficers, getEthicsOfficers } = useGetEthicsOfficers();
  const { createEthicsOfficer } = useCreateEthicsOfficer();
  const { updateEthicsOfficer } = useUpdateEthicsOfficer();
  const { deleteEthicsOfficer } = useDeleteEthicsOfficer();
  const { data: teams, getTeams } = useGetTeams();

  useEffect(() => {
    getEthicsOfficers();
    getTeams();
  }, []);

  useEffect(() => {
    if (allOfficers) {
      setOfficers(allOfficers);
    }
  }, [allOfficers]);

  const handleCreateOfficer = async (newOfficer) => {
    await createEthicsOfficer(newOfficer);
    getEthicsOfficers();
    setActiveTab("list");
  };

  const handleDeleteOfficer = async (officerId) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este oficial de ética?"
      )
    ) {
      await deleteEthicsOfficer(officerId);
      getEthicsOfficers();
      setActiveTab("list");
    }
  };

  const handleEditClick = (officer) => {
    setSelectedOfficer(officer);
    setActiveTab("edit");
  };

  const filteredOfficers = officers.filter((officer) =>
    `${officer.ethicsOfficer}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Lista de Oficiales de Ética">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Equipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((officer) => (
              <tr key={officer.ethicsOfficerId}>
                <td>{officer.ethicsOfficerId}</td>
                <td>
                  <img
                    src={officer.photoUrl}
                    alt={`${officer.ethicsOfficer}`}
                    width="40"
                    height="40"
                    onError={(e) =>
                      (e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/2102/2102633.png")
                    }
                  />
                </td>
                <td>{officer.ethicsOfficer}</td>
                <td>{officer.team?.neighborhood}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(officer)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteOfficer(officer.ethicsOfficerId)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Tab>

      <Tab eventKey="create" title="Crear Oficial de Ética">
        <EthicsOfficerForm
          onSubmit={handleCreateOfficer}
          teams={teams}
          buttonText="Crear Oficial"
        />
      </Tab>

      <Tab eventKey="edit" title="Editar Oficial de Ética">
        <h4>Buscar Oficial</h4>

        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {searchTerm && filteredOfficers.length > 0 && (
          <div className="officer-suggestions">
            {filteredOfficers.map((officer) => (
              <div
                key={officer.ethicsOfficerId}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                }}
                onClick={() => setSelectedOfficer(officer)}
              >
                {officer.ethicsOfficer}
              </div>
            ))}
          </div>
        )}

        {selectedOfficer ? (
          <EthicsOfficerForm
            officer={selectedOfficer}
            teams={teams}
            onSubmit={async (updatedOfficer) => {
              await updateEthicsOfficer(
                selectedOfficer.ethicsOfficerId,
                updatedOfficer
              );
              setSelectedOfficer(null);
              setSearchTerm("");
              getEthicsOfficers();
              setActiveTab("list");
            }}
            buttonText="Actualizar Oficial"
          />
        ) : (
          <p>Selecciona un oficial para editar.</p>
        )}
      </Tab>
    </Tabs>
  );
};

const EthicsOfficerForm = ({ officer = {}, onSubmit, teams, buttonText }) => {
  const [formData, setFormData] = useState({
    ethicsOfficer: officer.ethicsOfficer || "",
    bio: officer.bio || "",
    photoUrl: officer.photoUrl || null,
    teamId: officer.team?.teamId || "",
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
    onSubmit(formData);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nombre del Oficial</Form.Label>
          <Form.Control
            type="text"
            name="ethicsOfficer"
            value={formData.ethicsOfficer}
            onChange={handleChange}
            placeholder="Ingresa el nombre del oficial"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Biografía</Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Ingresa una breve biografía"
          />
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

        <Form.Group>
          <Form.Label>Foto</Form.Label>
          <UploadPhoto
            entity={{ key: "ethicsOfficerId", value: officer.ethicsOfficerId }}
            endpointUrl="/ethics_officers/upload_photo"
            onFileChange={handleFileChange}
          />
        </Form.Group>

        <Button variant="success" type="submit">
          {buttonText}
        </Button>
      </Form>
    </Container>
  );
};

export default EthicsOfficerDashboard;
