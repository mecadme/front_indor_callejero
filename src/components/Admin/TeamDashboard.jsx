import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
  Row,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { useGetPlayerWithoutTeam } from "../../api/Service/PlayerService";
import {
  useCreateTeam,
  useDeleteTeam,
  useGetTeams,
  useUpdateTeam,
} from "../../api/Service/TeamService";
import UploadPhoto from "../Utils/UploadPhoto";

const TeamGroupEnum = {
  A1: "Grupo A",
  A2: "Grupo A",
  A3: "Grupo A",
  A4: "Grupo A",
  A5: "Grupo A",
  B1: "Grupo B",
  B2: "Grupo B",
  B3: "Grupo B",
  B4: "Grupo B",
  B5: "Grupo B",
};

const PlayerPositionEnum = {
  GOALKEEPER: "Portero",
  DEFENDER: "Defensa",
  MIDFIELDER: "Mediocampo",
  ATTACKER: "Delantero",
};
const handleImageError = (e) => {
  e.target.src = "https://cdn-icons-png.flaticon.com/512/2102/2102633.png";
};

const TeamDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allTeams, getTeams } = useGetTeams();
  const { createTeam } = useCreateTeam();
  const { updateTeam } = useUpdateTeam();
  const { deleteTeam } = useDeleteTeam();
  const { getPlayerWithoutTeam } = useGetPlayerWithoutTeam();

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    if (allTeams) {
      setTeams(allTeams);
    }
  }, [allTeams]);

  const handleCreateTeam = async (newTeam) => {
    await createTeam(newTeam);
    getTeams();
    setActiveTab("list");
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este equipo?")) {
      await deleteTeam(teamId);
      getTeams();
      setActiveTab("list");
    }
  };

  const handleEditClick = (team) => {
    setSelectedTeam(team);
    setActiveTab("edit");
  };

  const filteredTeams = teams.filter((team) =>
    `${team.neighborhood}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Lista de Equipos">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Logo</th>
              <th>Nombre</th>
              <th>Grupo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.teamId}>
                <td>{team.teamId}</td>
                <td>
                  <img
                    src={team.logoUrl}
                    alt={`${team.neighborhood}`}
                    className="user-photo"
                    aria-hidden="true"
                    aria-label={`${team.name}`}
                    title={`${team.name}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer-when-downgrade"
                    width="40"
                    height="40"
                    onError={handleImageError}
                  />
                </td>
                <td>{team.neighborhood}</td>
                <td>{TeamGroupEnum[team.teamGroup]}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(team)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteTeam(team.teamId)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Tab>

      <Tab eventKey="create" title="Crear Team">
        <TeamForm onSubmit={handleCreateTeam} buttonText="Crear Equipo" />
      </Tab>

      <Tab eventKey="edit" title="Editar Equipo">
        <h4>Buscar Equipo</h4>

        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por barrio..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedTeam(null);
            }}
          />
        </InputGroup>

        {searchTerm && filteredTeams.length > 0 && (
          <div className="team-suggestions">
            {filteredTeams.map((team) => (
              <div
                key={team.teamId}
                className="team-suggestion-item"
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                }}
                onClick={() => {
                  setSelectedTeam(team);
                  setSearchTerm(team.neighborhood);
                }}
              >
                {team.neighborhood}
              </div>
            ))}
          </div>
        )}

        {searchTerm && filteredTeams.length === 0 && (
          <p>No se encontraron equipos.</p>
        )}

        {selectedTeam ? (
          <TeamForm
            team={selectedTeam}
            onSubmit={async (updatedTeam) => {
              await updateTeam(selectedTeam.teamId, updatedTeam);
              setSelectedTeam(null);
              setSearchTerm("");
              getTeams();
              setActiveTab("list");
            }}
            buttonText="Actualizar Equipo"
          />
        ) : (
          <p>Selecciona un equipo para editar.</p>
        )}
      </Tab>
    </Tabs>
  );
};

const TeamForm = ({ team = {}, onSubmit, buttonText }) => {
  const isUpdating = Boolean(team.teamId);
  const [formData, setFormData] = useState({
    name: team.name || "",
    color: team.color || "",
    neighborhood: team.neighborhood || "",
    logoUrl: team.logoUrl || null,
    teamGroup: team.teamGroup || "",
    players: team.players || [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState(formData.players);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: playersWithoutTeam, getPlayersWithoutTeam } =
    useGetPlayerWithoutTeam();

  useEffect(() => {
    getPlayersWithoutTeam();
  }, []);

  useEffect(() => {
    if (team && team.teamId !== formData.teamId) {
      setFormData({
        name: team.name || "",
        color: team.color || "",
        neighborhood: team.neighborhood || "",
        logoUrl: team.logoUrl || null,
        teamGroup: team.teamGroup || "",
        players: team.players || [],
      });
      setSelectedPlayers(team.players || []);
    }
  }, [team]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "name" && value.length > 5) {
      setErrorMessage("El nombre no puede tener más de 5 letras.");
    } else {
      setErrorMessage("");
    }
  };

  const handlePlayerSelect = (playerId) => {
    setSelectedPlayers((prevPlayers) =>
      prevPlayers.includes(playerId)
        ? prevPlayers.filter((id) => id !== playerId)
        : [...prevPlayers, playerId]
    );
  };

  const handleFileChange = (logoUrl) => {
    setFormData((prevState) => ({
      ...prevState,
      logoUrl,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name.length > 5) {
      setErrorMessage("El nombre no puede tener más de 5 letras.");
      return;
    }

    let formattedPlayers;
    if (isUpdating) {
      formattedPlayers = selectedPlayers.map((player) =>
        typeof player === "object" ? player : { playerId: player }
      );
    } else {
      formattedPlayers = selectedPlayers.map((playerId) => ({ playerId }));
    }

    onSubmit({
      ...formData,
      players: formattedPlayers,
    });
  };

  const TEAM_KEY_VALUE = { key: "teamId", value: team.teamId };
  const TEAM_UPLOAD_LOGO_URL = "teams/upload_photo";

  const filteredPlayers = playersWithoutTeam
    ? playersWithoutTeam.filter(
        (player) =>
          player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedPosition === "" || player.position === selectedPosition)
      )
    : [];

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Nombre del equipo</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name.toUpperCase()}
            onChange={handleChange}
            placeholder="Ingresa el nombre del equipo"
          />
          {errorMessage && (
            <Form.Text className="text-danger">{errorMessage}</Form.Text>
          )}
        </Form.Group>

        <Form.Group>
          <Form.Label>Color del equipo</Form.Label>
          <Form.Control
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Ingresa el color del equipo"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Barrio</Form.Label>
          <Form.Control
            type="text"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleChange}
            placeholder="Ingresa el barrio del equipo"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Grupo</Form.Label>
          <Form.Control
            as="select"
            name="teamGroup"
            value={formData.teamGroup}
            onChange={handleChange}
          >
            <option value="">Selecciona un grupo</option>
            {Object.entries(TeamGroupEnum).map(([key, value]) => (
              <option key={key} value={key}>
                {key} - {value}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Logo</Form.Label>
          {isUpdating && team?.logoUrl && (
            <Container className="d-flex justify-content-center">
              <img
                src={team.logoUrl}
                alt={`${team.neighborhood}`}
                className="user-photo"
                aria-hidden="true"
                aria-label={`${team.name}`}
                title={`${team.name}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer-when-downgrade"
                width="400"
                height="400"
                onError={handleImageError}
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "0.5rem",
                }}
              />
            </Container>
          )}
          <UploadPhoto
            entity={TEAM_KEY_VALUE}
            endpointUrl={TEAM_UPLOAD_LOGO_URL}
            onFileChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group>
          {isUpdating && team?.players && (
            <>
              <Form.Label>Jugadores</Form.Label>
              <ListGroup className="players-list mb-3">
                {team.players.map((player) => (
                  <ListGroup.Item
                    key={player.playerId}
                    className="d-flex align-items-center"
                    style={{
                      gap: "0.75rem",
                      padding: "0.25rem",
                      margin: "0.25rem",

                    }}
                  >
                    <div className="player-info">
                      <span
                        className="player-name"
                        style={{ fontSize: "1rem" }}
                      >
                        {player.firstName}{" "}
                        {player.lastName.toUpperCase()}
                      </span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
          <Form.Label>Selecciona jugadores</Form.Label>

          <Row>
            <Col>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Buscar jugador por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col>
              <Form.Control
                as="select"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
              >
                <option value="">Filtrar por posición</option>
                {Object.entries(PlayerPositionEnum).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>

          {filteredPlayers.length > 0 ? (
            <div className="player-list">
              {filteredPlayers.map((player) => (
                <Form.Check
                  key={player.playerId}
                  type="checkbox"
                  label={`${player.firstName} ${player.lastName} - ${
                    PlayerPositionEnum[player.position]
                  }`}
                  checked={selectedPlayers.includes(player.playerId)}
                  onChange={() => handlePlayerSelect(player.playerId)}
                />
              ))}
            </div>
          ) : (
            <p>No hay jugadores disponibles.</p>
          )}
        </Form.Group>

        <Button variant="success" type="submit">
          {buttonText}
        </Button>
      </Form>
    </Container>
  );
};

export default TeamDashboard;
