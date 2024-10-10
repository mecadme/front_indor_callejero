import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import {
  Badge,
  Card,
  Col,
  Container,
  ListGroup,
  Row,
  Pagination,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import StyleUtils from "../Utils/StyleUtils";

const Rounds = ({ RoundsData, showPagination = true }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();
  const roundsPerPage = 2;

  const icons = {
    calendar: "https://cdn-icons-png.flaticon.com/512/2838/2838779.png",
    stadium: "https://cdn-icons-png.flaticon.com/512/6409/6409911.png",
  };

  // Navegación al hacer clic en un partido
  const handleMatchClick = (matchId) => {
    navigate(`/result/${matchId}`);
  };

  // Navegación al hacer clic en una ronda
  const handleRoundClick = () => {
    navigate(`/rounds`);
  };

  // Función para manejar la paginación
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Obtener las rondas que se deben mostrar en la página actual
  const indexOfLastRound = currentPage * roundsPerPage;
  const indexOfFirstRound = indexOfLastRound - roundsPerPage;
  const currentRounds = RoundsData.slice(indexOfFirstRound, indexOfLastRound);

  // Función para obtener los estilos de cada equipo
  const getTeamStyles = (teamColor, lighterColor) => {
    return {
      containerStyle: {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          zigZagSvg(teamColor, lighterColor)
        )}")`,
        backgroundSize: "cover",
        width: "100%",
        display: "flex",
        transition: "background-image 0.2s ease, color 0.2s ease",
      },
      textStyle: {
        color: getTextColor(lighterColor),
        fontSize: "5rem",
        fontWeight: "bold",
      },
    };
  };

  return (
    <Container fluid>
      <Container className="Rounds">
        {RoundsData.length > 0 ? (
          <>
            {showPagination && (
              <Pagination className="custom-pagination">
                {[...Array(Math.ceil(RoundsData.length / roundsPerPage))].map(
                  (_, idx) => (
                    <Pagination.Item
                      key={idx + 1}
                      active={idx + 1 === currentPage}
                      onClick={() => paginate(idx + 1)}
                      className="custom-pagination-item"
                    >
                      {idx + 1}
                    </Pagination.Item>
                  )
                )}
              </Pagination>
            )}
            {/* Mostrar las rondas actuales */}
            {currentRounds.map((round) => (
              <Container key={round.roundId} className="mb-4 shadow-sm">
                <Row
                  onClick={() => handleRoundClick()}
                  style={{ cursor: "pointer" }}
                  as="h4"
                  className="text-center"
                >
                  {round.roundName}
                </Row>
                <Row>
                  {round.matches.map((match, index) => {
                    const lighterHomeTeamColor = lightenColor(
                      match.homeTeamColor,
                      40
                    );
                    const lighterAwayTeamColor = lightenColor(
                      match.awayTeamColor,
                      40
                    );

                    const homeTeamStyles = getTeamStyles(
                      match.homeTeamColor,
                      lighterHomeTeamColor
                    );
                    const awayTeamStyles = getTeamStyles(
                      match.awayTeamColor,
                      lighterAwayTeamColor
                    );

                    return (
                      <Row
                        key={index}
                        className="mb-3 align-items-center d-flex justify-content-center"
                        onClick={() => handleMatchClick(match.matchId)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Col md={6}>
                          <Row
                            className="d-flex justify-content-between align-items-center"
                            style={{ gap: "0.25rem", padding: "0.5rem" }}
                          >
                            <Col
                              style={homeTeamStyles.containerStyle}
                              className="text-left" // Alinear a la izquierda
                            >
                              <h5 style={homeTeamStyles.textStyle}>
                                {match.homeTeam}
                              </h5>
                            </Col>
                            <Col
                              style={awayTeamStyles.containerStyle}
                              className="text-right" // Alinear a la derecha
                            >
                              <h5 style={awayTeamStyles.textStyle}>
                                {match.awayTeam}
                              </h5>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="text-center">
                              <img
                                src={icons.stadium}
                                alt="place-icon"
                                className="icon-size"
                              />{" "}
                              {match.place}
                            </Col>
                            <Col className="text-center">
                              <img
                                src={icons.calendar}
                                alt="date-icon"
                                className="icon-size"
                              />{" "}
                              {new Date(match.date).toLocaleTimeString()}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    );
                  })}
                </Row>
              </Container>
            ))}
          </>
        ) : (
          <div className="text-center mt-4">
            No se encontraron partidos para la jornada seleccionada.
          </div>
        )}
      </Container>
    </Container>
  );
};

export default Rounds;
