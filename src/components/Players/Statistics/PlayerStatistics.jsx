import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Col,
  Container,
  Image,
  Pagination,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import EmptyData from "../../Administration/EmptyData";
import Loading from "../../Utils/Loading";
import StyleUtils from "../../Utils/StyleUtils";
import PlayerSearch from "./PlayerSearch"; // Importar el componente de búsqueda
import "./css/PlayerStatistics.css";

const PlayerStatistics = ({
  eventType,
  name,
  limit,
  showPagination = true,
}) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlayers, setFilteredPlayers] = useState([]); // Almacenará los jugadores filtrados por búsqueda
  const playersPerPage = 5;
  const axiosPrivate = useAxiosPrivate();
  const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayerStatistics = async () => {
      try {
        const response = await axiosPrivate.get(
          `/player-statistics/${eventType}`
        );
        setPlayers(response.data);
        setFilteredPlayers(response.data);
      } catch {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerStatistics();
  }, [eventType, axiosPrivate]);

  const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);
  const handlePlayerClick = (playerId) => navigate(`/player/${playerId}`);
  const handleTeamSelection = (teamId) => navigate(`/team/${teamId}`);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter((player) =>
        `${player.firstName} ${player.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
      setCurrentPage(1);
    }
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  if (players.length === 0)
    return (
      <EmptyData
        message={`No hay datos de ${name} para mostrar`}
        translateY={55}
      />
    );

  const indexOfLastPlayer = currentPage * playersPerPage;
  const currentPlayers = filteredPlayers.slice(
    indexOfLastPlayer - playersPerPage,
    indexOfLastPlayer
  );

  const displayedPlayers = limit
    ? currentPlayers.slice(0, limit)
    : currentPlayers;
  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

  return (
    <Container fluid className="player-statistics-container">
      <Container className="mt-4 m-0 p-0 text-center">
        {showPagination && (
          <Row>
            <PlayerSearch onSearch={handleSearch} />
          </Row>
        )}
        <Col
          xs={12}
          md={10}
          lg={8}
          className="m-0 p-0 mx-auto"
          style={{ margin: "auto" }}
        >
          {showPagination && (
            <Row className="mt-3 justify-content-center">
              <Pagination className="custom-pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageClick(i + 1)}
                    className="custom-pagination-item"
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </Row>
          )}

          {displayedPlayers.map((player, index) => {
            const lighterColor = lightenColor(player.teamColor, 40);
            const textColor = getTextColor(lighterColor);
            const zigZagBackground = zigZagSvg(player.teamColor, lighterColor);
            const match = player.teamLogoUrl.match(/_(\d+)\./);
            const teamId = match ? match[1] : 1;

            return (
              <Row
                key={player.playerId}
                className="shadow-sm rounded mb-4 statistics-card"
                style={{
                  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                    zigZagBackground
                  )}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: textColor,
                  cursor: "pointer",
                }}
              >
                <Row className="align-items-center text-center">
                  <Col className="text-center" xs={1}>
                    <h3>{((index+(currentPage*playersPerPage))-playersPerPage) + 1}</h3>
                  </Col>
                  <Col xs={3} className="text-center">
                    <Image
                      src={player.teamLogoUrl}
                      alt="Team Logo"
                      style={{
                        width: "5rem",
                        height: "5rem",
                        objectFit: "contain",
                      }}
                      onClick={() => handleTeamSelection(teamId)}
                      className="img-fluid"
                    />
                  </Col>
                  <Col
                    xs={5}
                    className="d-flex flex-column justify-content-center p-2"
                    onClick={() => handlePlayerClick(player.playerId)}
                  >
                    {index === 0 && currentPage === 1 && (
                      <Container className="best-player-container mb-2">
                        <Badge bg="warning" className="best-player-badge mt-2">
                          Mejor Jugador
                        </Badge>{" "}
                        <Image
                          src={player.photoUrl}
                          alt="Mejor jugador"
                          style={{
                            width: "3rem",
                            height: "3rem",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                          className="best-player-image"
                        />
                      </Container>
                    )}
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        color: textColor,
                      }}
                    >
                      {player.firstName} {player.lastName}
                    </div>
                  </Col>
                  <Col
                    xs={3}
                    className="text-center"
                    style={{ color: textColor }}
                  >
                    <div style={{ fontSize: "3.5rem", fontWeight: "bold" }}>
                      {player.eventCount || 0}
                    </div>
                  </Col>
                </Row>
              </Row>
            );
          })}
        </Col>
      </Container>
    </Container>
  );
};

export default PlayerStatistics;
