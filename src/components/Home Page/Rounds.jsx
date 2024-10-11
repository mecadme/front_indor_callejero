import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Col, Container, Pagination, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import StyleUtils from "../Utils/StyleUtils";
import "./css/Rounds.css";

const Rounds = ({ RoundsData, showPagination = true }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();
  const roundsPerPage = 2;

  const icons = {
    calendar: "https://cdn-icons-png.flaticon.com/512/2838/2838779.png",
    stadium: "https://cdn-icons-png.flaticon.com/512/6409/6409911.png",
  };

  const handleMatchClick = (matchId) => {
    navigate(`/result/${matchId}`);
  };

  const handleRoundClick = () => {
    navigate(`/rounds`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastRound = currentPage * roundsPerPage;
  const indexOfFirstRound = indexOfLastRound - roundsPerPage;
  const currentRounds = RoundsData.slice(indexOfFirstRound, indexOfLastRound);

  const groupMatchesByDate = (matches) => {
    return matches.reduce((acc, match) => {
      const matchDate = new Date(match.date).toLocaleDateString();
      if (!acc[matchDate]) {
        acc[matchDate] = [];
      }
      acc[matchDate].push(match);
      return acc;
    }, {});
  };

  const getTeamStyles = (teamColor, lighterColor) => {
    return {
      containerStyle: {
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          zigZagSvg(teamColor, lighterColor)
        )}")`,
        backgroundSize: "cover",
        width: "20%",
        display: "flex",
        transition: "background-image 0.2s ease, color 0.2s ease",
      },
      textStyle: {
        color: getTextColor(lighterColor),
        fontSize: "2rem",
        fontWeight: "bold",
      },
    };
  };

  return (
    <Container fluid>
      <Container className="Rounds p-0">
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
            {currentRounds.map((round) => (
              <Container key={round.roundId} className="m-0 shadow-sm p-1 ">
                <Row
                  onClick={() => handleRoundClick()}
                  style={{ cursor: "pointer" }}
                  className="round-name m-0"
                >
                  <h3>{round.roundName}</h3>
                </Row>
                <Row className="round-matches m-0">
                  {Object.entries(groupMatchesByDate(round.matches)).map(
                    ([date, matches]) => (
                      <React.Fragment key={date}>
                        <Col className="m-0 p-0">
                          <Row className="row-date">
                            <h4>{date}</h4>
                          </Row>
                          {matches.map((match, index) => {
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
                                <Col md={12}>
                                  <Row
                                    className= "teams-names-row"
                                    style={{
                                      padding: "1rem",
                                    }}
                                  >
                                    <Col
                                      style={homeTeamStyles.containerStyle}
                                      className="home-team-name"
                                    >
                                      <h5 style={homeTeamStyles.textStyle}>
                                        {match.homeTeam}
                                      </h5>
                                    </Col>
                                    <Col
                                      style={awayTeamStyles.containerStyle}
                                      className="away-team-name"
                                    >
                                      <h5 style={awayTeamStyles.textStyle}>
                                        {match.awayTeam}
                                      </h5>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col className="text-center"
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() => window.open(`https://www.google.com/maps/search/${match.place}`, "_blank")}
                                    
                                    >
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
                                      {new Date(
                                        match.date
                                      ).toLocaleTimeString()}
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            );
                          })}
                        </Col>
                      </React.Fragment>
                    )
                  )}
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
