import React, { useState, useEffect } from "react";
import {
  Tab,
  Tabs,
  Table,
  Button,
  Form,
  Modal,
  Pagination,
} from "react-bootstrap";
import UploadPhoto from "../Utils/UploadPhoto";
import {
  useGetPlayers,
  useCreatePlayer,
  useUpdatePlayer,
  useDeletePlayer,
} from "../../api/Service/PlayerService";

const PlayerDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
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

  const handleCreatePlayer = (newPlayer) => {
    createPlayer(newPlayer);
    getPlayers();
  };
  const handleDeletePlayer = (playerId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este jugador?")) {
      deletePlayer(playerId);
      getPlayers();
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(players.length / playersPerPage);
    return (
      <Pagination>
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
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

  const handleEditClick = (player) => {
    setSelectedPlayer(player);
    setActiveTab("edit");
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Lista de Jugadores">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Posición</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPlayers.map((player) => (
              <tr key={player.playerId}>
                <td>{player.playerId}</td>
                <td>
                  {player.playerName} {player.playerLastName}
                </td>
                <td>{player.position}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(player)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeletePlayer(player.id)}
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
        <PlayerForm
          onSubmit={handleCreatePlayer}
          buttonText="Crear Jugador"
          onEdit={handleEditClick}
        />
      </Tab>

      <Tab eventKey="edit" title="Editar Jugador">
        {selectedPlayer ? (
          <PlayerForm
            player={selectedPlayer}
            onSubmit={(updatedPlayer) =>
              updatePlayer(selectedPlayer.id, updatedPlayer)
            }
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

  const PlayerPositionEnum = {
    GOALKEEPER: "GOALKEEPER",
    DEFENDER: "Defensa",
    MIDFIELDER: "Mediocampo",
    ATTACKER: "Delantero",
  };

  const PlayerStatusEnum = {
    ACTIVE: "Activo",
    DISABLED: "Lesionado",
    INACTIVE: "Suspendido",
  };

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
  const PLAYER_KEY_VALUE = { key: "playerId", value: player.playerId };
  const PLAYER_UPLOAD_PHOTO_URL = "players/uploadPhoto";

  return (
    <Form onSubmit={handleSubmit}>
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
  );
};

export default PlayerDashboard;