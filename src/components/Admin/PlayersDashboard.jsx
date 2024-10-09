import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
  Pagination,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import {
  useCreatePlayer,
  useDeletePlayer,
  useGetPlayers,
  useUpdatePlayer,
} from "../../api/Service/PlayerService";
import UploadPhoto from "../Utils/UploadPhoto";

const PlayerPositionEnum = {
  GOALKEEPER: "Portero",
  DEFENDER: "Defensa",
  MIDFIELDER: "Mediocampo",
  ATTACKER: "Delantero",
};

const PlayerStatusEnum = {
  ACTIVE: "Activo",
  DISABLED: "Lesionado",
  INACTIVE: "Suspendido",
};

const handleImageError = (e) => {
  e.target.src = "https://cdn-icons-png.flaticon.com/512/2102/2102633.png";
};

const PlayerDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 5;

  const { data: allPlayers, getPlayers } = useGetPlayers();
  const { createPlayer } = useCreatePlayer();
  const { updatePlayer } = useUpdatePlayer();
  const { deletePlayer } = useDeletePlayer();

  useEffect(() => {
    getPlayers();
  }, []);

  useEffect(() => {
    if (allPlayers) {
      setPlayers(allPlayers);
    }
  }, [allPlayers]);

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreatePlayer = async (newPlayer) => {
    await createPlayer(newPlayer);
    getPlayers();
    setActiveTab("list");
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este jugador?")) {
      await deletePlayer(playerId);
      getPlayers();
      setActiveTab("list");
    }
  };

  const handleEditClick = (player) => {
    setSelectedPlayer(player);
    setActiveTab("edit");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPlayers = players.filter((player) =>
    `${player.firstName} ${player.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(players.length / playersPerPage);
    return (
      <Pagination className="mt-3 justify-content-center">
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            className={`mx-1 ${
              page + 1 === currentPage ? "active" : ""
            }`}
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => paginate(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    );
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Lista de Jugadores">
        <Table striped bordered hover responsive className="players-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Posición</th>
              <th style={{ width: "15%" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPlayers.map((player) => (
              <tr key={player.playerId}>
                <td>{player.playerId}</td>
                <td>
                  <img
                    src={player.photoUrl}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="user-photo"
                    aria-hidden="true"
                    aria-label={`${player.firstName} ${player.lastName}`}
                    title={`${player.firstName} ${player.lastName}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer-when-downgrade"
                    width="40"
                    height="40"
                    onError={handleImageError}
                  />
                </td>
                <td>
                  {player.firstName} {player.lastName}
                </td>
                <td>{PlayerPositionEnum[player.position]}</td>
                <td>
                  <Button
                    size="sm"
                    style={{ padding: "0" }}
                    variant="outline-primary"
                    onClick={() => handleEditClick(player)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    style={{ padding: "0" }}
                    variant="outline-danger"
                    onClick={() => handleDeletePlayer(player.playerId)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {renderPagination()}
      </Tab>

      <Tab eventKey="create" title="Crear Jugador">
        <PlayerForm onSubmit={handleCreatePlayer} buttonText="Crear Jugador" />
      </Tab>

      <Tab eventKey="edit" title="Editar Jugador">
        <h4>Buscar Jugador</h4>

        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedPlayer(null);
            }}
          />
        </InputGroup>

        {searchTerm && filteredPlayers.length > 0 && (
          <div className="player-suggestions">
            {filteredPlayers.map((player) => (
              <div
                key={player.playerId}
                className="player-suggestion-item"
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                }}
                onClick={() => {
                  setSelectedPlayer(player);
                  setSearchTerm(player.firstName + " " + player.lastName);
                }}
              >
                {player.firstName} {player.lastName}
              </div>
            ))}
          </div>
        )}

        {searchTerm && filteredPlayers.length === 0 && (
          <p>No se encontraron jugadores.</p>
        )}

        {selectedPlayer ? (
          <PlayerForm
            player={selectedPlayer}
            onSubmit={async (updatedPlayer) => {
              await updatePlayer(selectedPlayer.playerId, updatedPlayer);
              setSelectedPlayer(null);
              setSearchTerm("");
              getPlayers();
              setActiveTab("list");
            }}
            buttonText="Actualizar Jugador"
          />
        ) : (
          <p>Selecciona un jugador para editar.</p>
        )}
      </Tab>
    </Tabs>
  );
};

const PlayerForm = ({ player = {}, onSubmit, buttonText }) => {
  const isUpdating = Boolean(player.playerId);
  const [formData, setFormData] = useState({
    firstName: player.firstName || "",
    lastName: player.lastName || "",
    jerseyNumber: player.jerseyNumber || "",
    age: player.age || "",
    height: player.height || "",
    position: player.position || "",
    status: player.status || "",
    photoUrl: player.photoUrl || null,
  });

  useEffect(() => {
    if (player && player.playerId !== formData.playerId) {
      setFormData({
        firstName: player.firstName || "",
        lastName: player.lastName || "",
        jerseyNumber: player.jerseyNumber || "",
        age: player.age || "",
        height: player.height || "",
        position: player.position || "",
        status: player.status || "",
        photoUrl: player.photoUrl || null,
      });
    }
  }, [player]);

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

  const PLAYER_KEY_VALUE = { key: "player_id", value: player.playerId };
  const PLAYER_UPLOAD_PHOTO_URL = "players/upload_photo";

  return (
    <Container fluid className="m-0 p-0 d-flex justify-content-center">
      <Form onSubmit={handleSubmit} className="player-form w-75 p-5">
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Ingresa el nombre del jugador"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Ingresa el apellido del jugador"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Número de camiseta</Form.Label>
          <Form.Control
            type="number"
            name="jerseyNumber"
            value={formData.jerseyNumber}
            onChange={handleChange}
            placeholder="Ingresa el número de camiseta"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Edad</Form.Label>
          <Form.Control
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Ingresa la edad del jugador"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Altura (en metros)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="Ingresa la altura en metros"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Posición</Form.Label>
          <Form.Control
            as="select"
            name="position"
            value={formData.position}
            onChange={handleChange}
          >
            <option value="">Selecciona una posición</option>
            {Object.entries(PlayerPositionEnum).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Estatus</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">Selecciona un estatus</option>
            {Object.entries(PlayerStatusEnum).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Foto</Form.Label>
          {isUpdating && player?.photoUrl && (
            <Container className="d-flex justify-content-center">
              <img
                src={player.photoUrl}
                alt={`${player.firstName} ${player.lastName}`}
                className="user-photo"
                aria-hidden="true"
                aria-label={`${player.firstName} ${player.lastName}`}
                title={`${player.firstName} ${player.lastName}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer-when-downgrade"
                width="400"
                height="400"
                onError={handleImageError}
              />
            </Container>
          )}

          <UploadPhoto
            entity={PLAYER_KEY_VALUE}
            endpointUrl={PLAYER_UPLOAD_PHOTO_URL}
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

export default PlayerDashboard;
