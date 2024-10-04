import React, { useState, useEffect } from "react";
import { Button, Container, Form, Table, Tabs, Tab } from "react-bootstrap";
import {
  useGetAllWeeklyAwards,
  useCreateWeeklyAwards,
  useUpdateWeeklyAwards,
  useDeleteWeeklyAwards,
} from "../../api/Service/WeeklyAwardService"; // Hooks de premios
import { useGetPlayers } from "../../api/Service/PlayerService"; // Hooks para jugadores
import { useGetTeams } from "../../api/Service/TeamService"; // Hooks para equipos
import { useGetEthicsOfficers } from "../../api/Service/EthicsOfficerService"; // Hooks para responsables éticos

// Opciones de AwardType
const awardTypes = [
  { value: "PLAYER", label: "Jugador" },
  { value: "TEAM", label: "Equipo" },
  { value: "COACH", label: "Entrenador" },
];

const WeeklyAwardsDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [weeklyAwards, setWeeklyAwards] = useState([]);
  const [selectedAward, setSelectedAward] = useState(null);
  const [awardType, setAwardType] = useState("PLAYER"); // Tipo de premio seleccionado
  const [entities, setEntities] = useState([]); // Entidades (jugadores, equipos, entrenadores)

  // Hooks para premios
  const { data: allAwards, getAllWeeklyAwards } = useGetAllWeeklyAwards();
  const { createWeeklyAwards } = useCreateWeeklyAwards();
  const { updateWeeklyAwards } = useUpdateWeeklyAwards();
  const { deleteWeeklyAwards } = useDeleteWeeklyAwards();

  // Hooks para entidades
  const { data: players, getPlayers } = useGetPlayers();
  const { data: teams, getTeams } = useGetTeams();
  const { data: ethicsOfficers, getEthicsOfficers } = useGetEthicsOfficers();

  // Cargar premios al montar el componente
  useEffect(() => {
    getAllWeeklyAwards();
  }, []);

  // Actualizar premios cuando se reciban
  useEffect(() => {
    if (allAwards) setWeeklyAwards(allAwards);
  }, [allAwards]);

  // Cargar entidades según el tipo de premio seleccionado
  useEffect(() => {
    if (awardType === "PLAYER") {
      getPlayers();
    } else if (awardType === "TEAM") {
      getTeams();
    } else if (awardType === "COACH") {
      getEthicsOfficers();
    }
  }, [awardType]);

  // Actualizar las entidades cuando se selecciona el tipo de premio
  useEffect(() => {
    if (awardType === "PLAYER" && players) {
      setEntities(players);
    } else if (awardType === "TEAM" && teams) {
      setEntities(teams);
    } else if (awardType === "COACH" && ethicsOfficers) {
      setEntities(ethicsOfficers);
    }
  }, [awardType, players, teams, ethicsOfficers]);

  const handleCreateAward = async (newAward) => {
    await createWeeklyAwards(newAward);
    getAllWeeklyAwards(); // Refrescar la lista de premios
    setActiveTab("list");
  };

  const handleEditClick = (award) => {
    setSelectedAward(award);
    setActiveTab("edit");
  };

  const handleDeleteClick = async (awardId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este premio?")) {
      await deleteWeeklyAwards(awardId);
      getAllWeeklyAwards();
    }
  };

  return (
    <Container>
      <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
        <Tab eventKey="list" title="Lista de Premios Semanales">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Entidad</th>
                <th>Tipo de Premio</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {weeklyAwards.map((award) => (
                <tr key={award.weeklyAwardsId}>
                  <td>{award.weeklyAwardsId}</td>
                  <td>{award.entityId}</td>
                  <td>{award.awardType}</td>
                  <td>{new Date(award.date).toLocaleDateString()}</td>
                  <td>
                    <Button onClick={() => handleEditClick(award)}>
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(award.weeklyAwardsId)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="create" title="Crear Premio Semanal">
          <WeeklyAwardForm
            onSubmit={handleCreateAward}
            entities={entities}
            awardType={awardType}
            setAwardType={setAwardType}
            buttonText="Crear Premio"
          />
        </Tab>

        <Tab eventKey="edit" title="Editar Premio Semanal">
          {selectedAward ? (
            <WeeklyAwardForm
              award={selectedAward}
              onSubmit={async (updatedAward) => {
                await updateWeeklyAwards(
                  selectedAward.weeklyAwardsId,
                  updatedAward
                );
                setSelectedAward(null);
                getAllWeeklyAwards();
                setActiveTab("list");
              }}
              entities={entities}
              awardType={awardType}
              setAwardType={setAwardType}
              buttonText="Actualizar Premio"
            />
          ) : (
            <p>Selecciona un premio para editar.</p>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

const WeeklyAwardForm = ({ award = {}, entities = [], awardType, setAwardType, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({
    entityId: award.entityId || "",
    awardType: award.awardType || "PLAYER",
    date: award.date || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verificar el tipo de premio para seleccionar el ID correcto (teamId, playerId o ethicsOfficerId)
    let awardPayload = {
      awardType: formData.awardType,
      date: formData.date,
    };

    if (formData.awardType === "PLAYER") {
      awardPayload.playerId = formData.entityId; // Enviar playerId si es un jugador
    } else if (formData.awardType === "TEAM") {
      awardPayload.teamId = formData.entityId; // Enviar teamId si es un equipo
    } else if (formData.awardType === "COACH") {
      awardPayload.ethicsOfficerId = formData.entityId; // Enviar ethicsOfficerId si es un entrenador
    }

    onSubmit(awardPayload);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Tipo de Premio</Form.Label>
        <Form.Control
          as="select"
          name="awardType"
          value={formData.awardType}
          onChange={(e) => {
            handleChange(e);
            setAwardType(e.target.value); // Cambiar el tipo de premio para cargar entidades
          }}
        >
          {awardTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Entidad</Form.Label>
        <Form.Control
          as="select"
          name="entityId"
          value={formData.entityId}
          onChange={handleChange}
        >
          <option value="">Selecciona una entidad</option>
          {entities.map((entity) => (
            <option key={entity.entityId} value={
              awardType === "PLAYER"
                ? entity.playerId
                : awardType === "TEAM"
                ? entity.teamId
                : entity.ethicsOfficerId
            }>
              {awardType === "PLAYER"
                ? `${entity.firstName} ${entity.lastName}`
                : awardType === "TEAM"
                ? entity.name
                : entity.ethicsOfficer}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Fecha</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="success" type="submit">
        {buttonText}
      </Button>
    </Form>
  );
};

export default WeeklyAwardsDashboard;
