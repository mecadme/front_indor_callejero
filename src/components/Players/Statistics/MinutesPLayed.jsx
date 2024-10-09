import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Col,
  Container,
  Image,
  Pagination,
  Row,
} from "react-bootstrap";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import EmptyData from "../../Administration/EmptyData";
import Loading from "../../Utils/Loading";
import StyleUtils from "../../Utils/StyleUtils";
import { useNavigate } from "react-router-dom";
import PlayerSearch from "./PlayerSearch"; // Importar el componente de búsqueda

const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();

const PlayerCard = ({ player, index, currentPage }) => {
  const lighterColor = lightenColor(player.teamColor, 40);
  const textColor = getTextColor(lighterColor);
  const zigZagBackground = zigZagSvg(player.teamColor, lighterColor);
  const navigate = useNavigate();
  const handlePlayerClick = (playerId) => navigate(`/player/${playerId}`);
  const handleTeamSelection = (teamId) => navigate(`/team/${teamId}`);
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
        <Col xs={4} className="text-center">
          <Image
            src={player.teamLogoUrl}
            alt="Team Logo"
            style={{ width: "5rem", height: "5rem", objectFit: "contain" }}
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
              </Badge>
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
            style={{ fontWeight: "bold", fontSize: "1.5rem", color: textColor }}
          >
            {player.firstName} {player.lastName}
          </div>
        </Col>
        <Col xs={3} className="text-center" style={{ color: textColor }}>
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              accentColor: player.teamColor,
            }}
          >
            {player.minutesPlayed || 0} min
          </div>
        </Col>
      </Row>
    </Row>
  );
};

const MinutesPlayed = ({ limit, showPagination = true }) => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]); // Almacena jugadores filtrados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 6;
  const axiosPrivate = useAxiosPrivate();

  const MINUTES_URL = "player-statistics/minutesPlayed";

  const fetchPlayers = () => {
    setLoading(true);
    setError(null);
    axiosPrivate
      .get(MINUTES_URL)
      .then((response) => {
        setPlayers(response.data);
        setFilteredPlayers(response.data); // Inicialmente todos los jugadores
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al cargar los datos");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlayers();
  }, [axiosPrivate]);

  // Filtrar jugadores por nombre
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredPlayers(players); // Mostrar todos si no hay búsqueda
    } else {
      const filtered = players.filter((player) =>
        `${player.firstName} ${player.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
      setCurrentPage(1); // Resetear a la primera página
    }
  };

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(
    indexOfFirstPlayer,
    indexOfLastPlayer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <Loading message="Cargando estadísticas..." />;
  }

  if (error) {
    return (
      <Container className="mt-4 text-center">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={fetchPlayers}>
          Reintentar
        </Button>
      </Container>
    );
  }

  if (players.length === 0) {
    return (
      <EmptyData
        message="No hay jugadores con minutos jugados"
        translateY={55}
      />
    );
  }

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

  return (
    <Container className="mt-4 ">
      <Col xs={12} md={10} lg={8} className="mx-auto">
        {showPagination && (
          <Row className="mt-3 justify-content-center">
            <PlayerSearch onSearch={handleSearch} />
            <Pagination className="custom-pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                  className="custom-pagination-item"
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Row>
        )}
        {currentPlayers.map((player, index) => (
          <PlayerCard
            key={player.playerId}
            player={player}
            index={index}
            currentPage={currentPage}
          />
        ))}
      </Col>
    </Container>
  );
};

export default MinutesPlayed;
