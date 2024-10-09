import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Pagination,
  Image,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import EmptyData from "../../Administration/EmptyData";
import StyleUtils from "../../Utils/StyleUtils";
import Loading from "../../Utils/Loading";
import "./css/MinutesPlayed.css";

const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();

const PlayerCard = ({ player, index, currentPage }) => {
  const lighterColor = lightenColor(player.teamColor, 40);
  const textColor = getTextColor(lighterColor);
  const zigZagBackground = zigZagSvg(player.teamColor, lighterColor);

  return (
    <Row
      key={player.playerId}
      className="shadow-sm rounded mb-4"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          zigZagBackground
        )}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 0.2s ease, color 0.2s ease",
        cursor: "pointer",
        color: textColor,
      }}
    >
      <Row className="align-items-center">
        <Col xs={4} className="text-center">
          <Image
            src={player.teamLogoUrl}
            alt="Team Logo"
            className="img-fluid"
            style={{ width: "6rem", height: "6rem" }}
            loading="lazy"
          />
        </Col>
        <Col xs={5} className="d-flex flex-column justify-content-center p-2">
          {index === 0 && currentPage === 1 && (
            <Container>
              <Image
                src={player.photoUrl}
                alt="Mejor jugador"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                }}
              />
              <br />
              <Badge bg="warning" className="mb-2">
                Mejor Jugador
              </Badge>
            </Container>
          )}

          <div style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            {player.firstName} {player.lastName}
          </div>
        </Col>
        <Col xs={3} className="text-center" style={{ color: textColor }}>
          <div
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(6);
  const axiosPrivate = useAxiosPrivate();

  const MINUTES_URL = "player-statistics/minutesPlayed";

  const fetchPlayers = () => {
    setLoading(true);
    setError(null);
    axiosPrivate
      .get(MINUTES_URL)
      .then((response) => {
        setPlayers(response.data);
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

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);

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
    return <EmptyData message="No hay jugadores con minutos jugados" />;
  }

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

  const displayedPlayers = limit
    ? currentPlayers.slice(0, limit)
    : currentPlayers;

  return (
    <Container className="mt-4 ">
      <Col xs={12} md={10} lg={8}>
        {showPagination && (
          <Row className="mt-3 justify-content-center">
            <Pagination>{paginationItems}</Pagination>
          </Row>
        )}
        {displayedPlayers.map((player, index) => (
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
