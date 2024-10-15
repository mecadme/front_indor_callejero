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
import PlayerSearch from "./PlayerSearch";
import "./css/Cards.css";

const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();

const Cards = ({ limit, showPagination = true }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const playersPerPage = 6;
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const CARDS_URL = "player-statistics/playerCards";

  useEffect(() => {
    axiosPrivate
      .get(CARDS_URL)
      .then((response) => {
        setPlayers(response.data);
        setFilteredPlayers(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar los datos");
        setLoading(false);
      });
  }, [axiosPrivate]);

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

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(
    indexOfFirstPlayer,
    indexOfLastPlayer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const displayedPlayers = limit
    ? currentPlayers.slice(0, limit)
    : currentPlayers;

  const yellowCards = displayedPlayers.filter(
    (player) => player.cardName === "YELLOW"
  );
  const redCards = displayedPlayers.filter(
    (player) => player.cardName === "RED"
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (players.length === 0) {
    return (
      <EmptyData
        message="Genial no ha habido tarjetas. ¡Felicidades! Sigue apoyando por un juego limpio"
        translateY={55}
      />
    );
  }

  const PlayerCard = ({ player, index, cardType, currentPage }) => {
    const lighterColor = lightenColor(player.teamColor, 40);
    const textColor = getTextColor(lighterColor);
    const zigZagBackground = zigZagSvg(player.teamColor, lighterColor);
    const match = player.teamLogoUrl.match(/_(\d+)\./);
    const teamId = match ? match[1] : 1;

    const handlePlayerClick = (playerId) => navigate(`/player/${playerId}`);
    const handleTeamSelection = (teamId) => navigate(`/team/${teamId}`);

    return (
      <Row
        key={player.playerId}
        className="shadow-sm rounded mb-4 cards-player-card"
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
              <Container className="king-card-container mb-2">
                <Badge bg="dark" className="king-card-badge mt-2">
                  El rey de las {cardType === "YELLOW" ? "amarillas" : "rojas"}
                </Badge>
                <Image
                  src={player.photoUrl}
                  alt="El rey de las tarjetas"
                  style={{
                    width: "3rem",
                    height: "3rem",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  className="king-card-image"
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
          <Col xs={3} className="text-center" style={{ color: textColor }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                accentColor: player.teamColor,
              }}
            >
              {player.eventCount}
            </div>
          </Col>
        </Row>
      </Row>
    );
  };

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);

  return (
    <Container className="mt-1 cards-container">
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
      <Row>
        <Col xs={12} md={6}>
          <h3 className="text-center cards-heading">Amarillas</h3>
          {yellowCards.length === 0 ? (
            <p className="text-center cards-no-data">
              No hay tarjetas amarillas.
            </p>
          ) : (
            yellowCards.map((player, index) => (
              <PlayerCard
                key={player.playerId}
                player={player}
                index={index}
                cardType="YELLOW"
                currentPage={currentPage}
              />
            ))
          )}
        </Col>

        <Col xs={12} md={6}>
          <h3 className="text-center cards-heading">Rojas</h3>
          {redCards.length === 0 ? (
            <p className="text-center cards-no-data">No hay tarjetas rojas.</p>
          ) : (
            redCards.map((player, index) => (
              <PlayerCard
                key={player.playerId}
                player={player}
                index={index}
                cardType="RED"
                currentPage={currentPage}
              />
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Cards;
