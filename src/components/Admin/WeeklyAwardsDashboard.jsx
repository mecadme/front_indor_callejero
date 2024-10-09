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

    // Preparar el payload con el ID correcto según el tipo de premio
    let awardPayload = {
      entityId: formData.entityId, // Este será el valor de playerId, teamId o ethicsOfficerId
      date: formData.date,
      awardType: formData.awardType, // PLAYER, TEAM, COACH
    };

    // Validación de campo para evitar enviar un ID vacío o inválido
    if (!formData.entityId) {
      console.error("No se ha seleccionado una entidad válida.");
      return; // Detenemos el envío si no hay entidad válida
    }

    // Llamar al método onSubmit con el payload
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
            setAwardType(e.target.value); // Actualiza el tipo de premio
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
          {entities.map((entity) => {
            let entityId;
            let entityLabel;

            // Según el tipo de premio, seleccionar el ID y nombre apropiado
            if (formData.awardType === "PLAYER") {
              entityId = entity.playerId;
              entityLabel = `${entity.firstName} ${entity.lastName}`;
            } else if (formData.awardType === "TEAM") {
              entityId = entity.teamId;
              entityLabel = entity.name;
            } else if (formData.awardType === "COACH") {
              entityId = entity.ethicsOfficerId;
              entityLabel = entity.ethicsOfficer;
            }

            // Mostrar solo si tiene un ID válido
            if (entityId) {
              return (
                <option key={entityId} value={entityId}>
                  {entityLabel}
                </option>
              );
            } else {
              return null; // No mostrar si no hay un ID
            }
          })}
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
