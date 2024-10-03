import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Dropdown,
  ListGroup,
  Image,
  Button,
  Pagination,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const PlayerSelector = ({ players, onSelectPlayer }) => {
  const [selectedTeam, setSelectedTeam] = useState(""); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); 
  const playersPerPage = 5;

  const teams = [...new Set(players.map((player) => player.teamName))];

  const filteredPlayers = players.filter((player) => {
    const matchesTeam = selectedTeam ? player.teamName === selectedTeam : true;
    const matchesSearch = `${player.player.firstName} ${player.player.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTeam && matchesSearch;
  });

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(
    indexOfFirstPlayer,
    indexOfLastPlayer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col md={6}>
          <Dropdown onSelect={(team) => { setSelectedTeam(team); setCurrentPage(1); }}>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              {selectedTeam || "Seleccionar Equipo"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => { setSelectedTeam(""); setCurrentPage(1); }}>
                Todos los equipos
              </Dropdown.Item>
              {teams.map((team, index) => (
                <Dropdown.Item key={index} eventKey={team}>
                  {team}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col md={6}>
          <Form.Group className="position-relative">
            <Form.Control
              type="text"
              placeholder="Buscar jugador"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-5"
            />
            <FaSearch
              style={{
                position: "absolute",
                top: "50%",
                left: "80%",
                transform: "translateY(-50%)",
                height: "1.5rem",
                color: "#33173C",
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      {currentPlayers.length > 0 ? (
        <ListGroup>
          {currentPlayers.map((player) => (
            <ListGroup.Item
              key={player.player.playerId}
              onClick={() => onSelectPlayer(player)}
              action
              className="player-item p-3 my-2"
              style={{ borderRadius: '10px', transition: 'background-color 0.2s' }}
            >
              <Row className="align-items-center">
                <Col xs={3}>
                  <Image
                    src={player.player.photoUrl}
                    alt={`${player.player.firstName} ${player.player.lastName}`}
                    fluid
                    roundedCircle
                  />
                </Col>
                <Col xs={9}>
                  <h6 className="mb-0">
                    {player.player.firstName} {player.player.lastName}
                  </h6>
                  <small className="text-muted">{player.teamName}</small>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-center text-muted mt-3">
          No se encontraron jugadores que coincidan con la búsqueda
        </p>
      )}

      {totalPages > 1 && (
        <Row className="mt-3 justify-content-center">
          <Col xs="auto">
            <Pagination>
              <Pagination.First
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PlayerSelector;
