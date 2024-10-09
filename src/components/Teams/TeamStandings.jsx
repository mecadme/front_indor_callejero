import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Table, Card, Spinner, Alert, Container } from "react-bootstrap";
import EmptyData from "../Administration/EmptyData";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const TeamStandings = () => {
  const STANDINGS_URL = "/teams/all_standings_by_group"; 
  const [groupedStandings, setGroupedStandings] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
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
    <Container fluid>
      <Header />
    <Container className="container mt-4">
      <h2 className="text-center mb-4">Tabla de Posiciones por Grupo</h2>

      {/* Iteramos por cada grupo */}
      {Object.keys(groupedStandings).map((group) => (
        <div key={group} className="mb-5">
          <h3 className="text-center mb-3">{group}</h3>
          <Table striped bordered hover responsive="md">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>PJ</th> {/* Partidos Jugados */}
                <th>G</th> {/* Ganados */}
                <th>E</th> {/* Empatados */}
                <th>P</th> {/* Perdidos */}
                <th>GF</th> {/* Goles a Favor */}
                <th>GC</th> {/* Goles en Contra */}
                <th>Dif</th> {/* Diferencia de Goles */}
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {/* Iteramos por cada equipo dentro del grupo */}
              {groupedStandings[group].map((standing) => (
                <tr key={standing.standingId}>
                  <td>
                    <Card className="d-flex flex-row align-items-center">
                      <Card.Img
                        src={standing.team.logoUrl}
                        alt={standing.team.name}
                        className="img-fluid"
                        style={{
                          width: "40px",
                          height: "40px",
                          marginRight: "10px",
                        }}
                      />
                      <Card.Body>
                        <h6>{standing.team.name}</h6>
                        <small className="text-muted">
                          {standing.team.neighborhood} - Grupo{" "}
                          {standing.team.teamGroup}
                        </small>
                      </Card.Body>
                    </Card>
                  </td>
                  <td>{standing.gamesPlayed}</td>
                  <td>{standing.wins}</td>
                  <td>{standing.draws}</td>
                  <td>{standing.losses}</td>
                  <td>{standing.goalsFor}</td>
                  <td>{standing.goalsAgainst}</td>
                  <td>{standing.goalsDifference}</td>
                  <td>{standing.points}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ))}
    </Container>
    <Footer />
    </Container>
  );
};

export default TeamStandings;
