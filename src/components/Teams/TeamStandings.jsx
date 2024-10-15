import React, { useEffect, useState } from "react";
import { Alert, Col, Container, Image, Row, Table } from "react-bootstrap";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import EmptyData from "../Administration/EmptyData";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Loading from "../Utils/Loading";
import PageBanner from "../Utils/PageBanner";
import StyleUtils from "../Utils/StyleUtils";
import "./css/TeamStandings.css";

const TeamStandings = () => {
  const STANDINGS_URL = "/teams/all_standings_by_group";
  const [groupedStandings, setGroupedStandings] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getStandings = async () => {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get(STANDINGS_URL, {
          signal: controller.signal,
        });
        if (isMounted) {
          setGroupedStandings(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError("Error al cargar los datos de las posiciones");
          setIsLoading(false);
        }
      }
    };

    getStandings();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!groupedStandings || Object.keys(groupedStandings).length === 0) {
    return (
      <Container fluid>
        <Header />
        <EmptyData />
        <Footer />
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <Header />
      <Container className="banner-container">
        <PageBanner title="Tablas" />
        <Row className="phase-name">
          <h2 className="text-center m-0 p-0">Fase de Grupos</h2>
        </Row>

        {Object.keys(groupedStandings).map((group) => {
          const groupLength = groupedStandings[group].length;

          return (
            <Container key={group} className="table-container mb-5">
              <Row className="group-name">
                <h3 className="text-left mb-3">{group}</h3>
              </Row>
              <Table
                hover
                responsive="md"
                className="position-table d-table align-middle"
              >
                <thead>
                  <tr>
                    <th> </th>
                    <th>Barrio</th>
                    <th>PJ</th> {/* Partidos Jugados */}
                    <th>PG</th> {/* Ganados */}
                    <th>PE</th> {/* Empatados */}
                    <th>PP</th> {/* Perdidos */}
                    <th>GF</th> {/* Goles a Favor */}
                    <th>GC</th> {/* Goles en Contra */}
                    <th>Pts</th>
                    <th>GD</th> {/* Diferencia de Goles */}
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody className="table-body text-center">
                  {groupedStandings[group].map((standing, index) => {
                    const teamColor = standing.team.color;
                    const lighterColor = lightenColor(teamColor, 40);
                    const textColor = getTextColor(lighterColor);
                    const isLastPlace = index === groupLength - 1;

                    return (
                      <tr key={standing.standingId}>
                        <td>
                          <h4>{index + 1}</h4>
                        </td>
                        <td>
                          <Row
                            className="d-flex flex-row align-items-center w-100 m-0 p-0"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                                zigZagSvg(lighterColor, teamColor)
                              )}")`,
                              backgroundSize: "cover",
                              transition:
                                "background-image 0.2s ease, color 0.2s ease",
                            }}
                          >
                            <Col xs={5}>
                              <Image
                                src={standing.team.logoUrl}
                                alt={standing.team.name}
                                className="img-fluid"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  marginRight: "10px",
                                }}
                              />
                            </Col>
                            <Col>
                              <h6
                                style={{
                                  fontSize: "3rem",
                                  fontWeight: "bold",
                                  color: textColor,
                                }}
                              >
                                {standing.team.name}
                              </h6>
                            </Col>
                          </Row>
                        </td>
                        <td>{standing.gamesPlayed}</td>
                        <td>{standing.wins}</td>
                        <td>{standing.draws}</td>
                        <td>{standing.losses}</td>
                        <td>{standing.goalsFor}</td>
                        <td>{standing.goalsAgainst}</td>
                        <td
                          className="points"
                          style={{
                            color: isLastPlace ? "#E61B1F" : "#60b12e",
                          }}
                        >
                          {standing.points}
                        </td>
                        <td>{standing.goalsDifference}</td>
                        <td>
                          <div
                            className="team-status"
                            style={{
                              backgroundColor: isLastPlace
                                ? "#E61B1F"
                                : "#60b12e",
                            }}
                          ></div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Container>
          );
        })}
      </Container>
      <Footer />
    </Container>
  );
};

export default TeamStandings;
