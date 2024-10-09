import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Col,
  Container,
  Image,
  Row,
  Pagination,
} from "react-bootstrap";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import EmptyData from "../../Administration/EmptyData";
import Loading from "../../Utils/Loading";

const PlayerStatistics = ({
  eventType,
  name,
  limit,
  showPagination = true,
}) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [playersPerPage] = useState(6); // Players per page
  const axiosPrivate = useAxiosPrivate();

  const PLAYER_STATISTICS_URL = `/player-statistics/${eventType}`;

  useEffect(() => {
    axiosPrivate
      .get(PLAYER_STATISTICS_URL)
      .then((response) => {
        setPlayers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al cargar los datos");
        setLoading(false);
      });
  }, [eventType]);

  // Pagination: calculate current players to display
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  if (players.length === 0) {
    return <EmptyData message={`No hay datos de ${name} para mostrar`} />;
  }

  const displayedPlayers = limit
    ? currentPlayers.slice(0, limit)
    : currentPlayers;

  // Generate pagination items
  const totalPages = Math.ceil(players.length / playersPerPage);
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => paginate(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <Container fluid>
      <Container className="mt-4">
        {showPagination && (
          <Row className="mt-3 justify-content-center">
            <Pagination>{paginationItems}</Pagination>
          </Row>
        )}
        <Col>
          {displayedPlayers.map((player, index) => (
            <Row
              key={player.playerId}
              className="shadow-sm rounded mb-4"
              style={{
                backgroundColor: player.teamColor,
                padding: "1rem",
                margin: "0",
                borderRadius: "10px",
              }}
            >
              <Row className="align-items-center">
                <Col xs={4} className="text-center">
                  <Image
                    src={player.teamLogoUrl}
                    alt="Team Logo"
                    style={{
                      width: "4rem",
                      height: "4rem",
                    }}
                    className="img-fluid"
                  />
                </Col>
                <Col xs={6} className="d-flex flex-column align-items-start">
                  {index === 0 && currentPage === 1 && (
                    <Container>
                      <Image
                        src={player.photoUrl}
                        alt="Mejor jugador"
                        style={{
                          width: "2.5rem",
                          height: "2.5rem",
                          marginTop: "10px",
                        }}
                      />
                      <br />
                      <Badge bg="warning" className="mb-2">
                        Mejor Jugador
                      </Badge>
                    </Container>
                  )}
                  <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    {player.firstName} {player.lastName}
                  </div>
                </Col>
                <Col xs={2} className="text-center">
                  <div
                    style={{
                      fontSize: "3rem",
                      fontWeight: "bold",
                      color: "#343a40",
                    }}
                  >
                    {player.eventCount || 0}
                  </div>
                </Col>
              </Row>
            </Row>
          ))}
        </Col>
      </Container>
    </Container>
  );
};

export default PlayerStatistics;
