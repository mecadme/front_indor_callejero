import React, { useState } from "react";
import { Container, Row, Col, Form, Dropdown, ListGroup, Image, Button, Pagination } from "react-bootstrap";

const TeamSelector = ({ teams, onSelectTeam }) => {
  const [searchTerm, setSearchTerm] = useState("");     
  const [currentPage, setCurrentPage] = useState(1);    
  const teamsPerPage = 5;                              

  const filteredTeams = teams.filter((team) =>
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirstTeam, indexOfLastTeam);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);

  return (
    <Container>
      <Row className="mb-3">
        <Col md={6}>
          {/* Input de búsqueda de equipos */}
          <Form.Control
            type="text"
            placeholder="Buscar equipo"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </Col>
      </Row>

      {/* Si no se encuentran equipos */}
      {filteredTeams.length === 0 ? (
        <p className="text-center">No se encontraron equipos.</p>
      ) : (
        <ListGroup>
          {currentTeams.map((team, index) => (
            <ListGroup.Item key={index} onClick={() => onSelectTeam(team)} action>
              <Image src={team.teamLogoUrl} alt={team.teamName} className="logo_team" />
              <p>{team.teamName}</p>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Paginación */}
      {filteredTeams.length > teamsPerPage && (
        <Row className="mt-3">
          <Col>
            <Pagination>
              <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default TeamSelector;
