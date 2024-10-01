import React, { useState } from "react";
import { Container, Row, Col, Form, Dropdown, ListGroup, Image, Button } from "react-bootstrap";

const PlayerSelector = ({ players, onSelectPlayer }) => {
  const [selectedTeam, setSelectedTeam] = useState("");   // Equipo seleccionado
  const [searchTerm, setSearchTerm] = useState("");       // Término de búsqueda
  const [selectedPlayer, setSelectedPlayer] = useState(null);  // Jugador seleccionado

  // Obtener equipos únicos
  const teams = [...new Set(players.map((player) => player.teamName))];

  // Filtrar jugadores según el equipo seleccionado y el término de búsqueda
  const filteredPlayers = players.filter((player) => {
    const matchesTeam = selectedTeam ? player.teamName === selectedTeam : true;
    const matchesSearch = `${player.firstName} ${player.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTeam && matchesSearch;
  });

  // Manejar la selección de un jugador
  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);  // Guardar el jugador seleccionado
    onSelectPlayer(player);     // Notificar al componente padre
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col md={6}>
          {/* Dropdown para seleccionar equipo */}
          <Dropdown onSelect={(team) => setSelectedTeam(team)}>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {selectedTeam || "Seleccionar Equipo"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setSelectedTeam("")}>Todos los equipos</Dropdown.Item>
              {teams.map((team, index) => (
                <Dropdown.Item key={index} eventKey={team}>
                  {team}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col md={6}>
          {/* Input de búsqueda */}
          <Form.Control
            type="text"
            placeholder="Buscar jugador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <ListGroup>
        {filteredPlayers.length === 0 ? (
          <ListGroup.Item>No se encontraron jugadores</ListGroup.Item>
        ) : (
          filteredPlayers.map((player) => (
            <ListGroup.Item
              key={player.playerId}
              className={`d-flex align-items-center ${selectedPlayer && selectedPlayer.playerId === player.playerId ? "active" : ""}`} 
              onClick={() => handlePlayerSelect(player)}
              style={{ cursor: "pointer" }}
            >
              <Image src={player.photoUrl.trim()} alt={player.firstName} width="50" roundedCircle />
              <div className="ms-3">
                <h5>{player.firstName} {player.lastName}</h5>
                <p>Equipo: {player.teamName}</p>
              </div>
              {/* Botón para confirmar la selección del jugador */}
              <Button
                variant="primary"
                className="ms-auto"
                onClick={() => handlePlayerSelect(player)}
              >
                Seleccionar
              </Button>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </Container>
  );
};

export default PlayerSelector;
