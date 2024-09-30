import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Spinner,
  Card,
  Alert,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Standings = () => {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const STANDINGS_URL = "/teams/standings_by_group";

  const fetchGroupsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(STANDINGS_URL);

      if (response.data && typeof response.data === "object") {
        setGroups(response.data);
        console.log(response.data)
      } else {
        throw new Error("Formato de datos incorrecto");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error al cargar las tablas:", err);
      setError(err.message || "No se pudo cargar las tablas");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando tablas...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const handleTableClick = () => {
    navigate(`/group_standings`);
  };
  const handleTeamClick = (teamId) => {
    navigate(`/team/${teamId}`);
  };

  return (
    <Container className="standings mt-4">
      <h2
        className="text-center mb-4"
        onClick={() => handleTableClick()}
        style={{ cursor: "pointer" }}
      >
        Tablas de Posiciones
      </h2>
      {Object.keys(groups).map((groupName, index) => (
        <Card key={index} className="mb-4 shadow">
          <Card.Header className="bg-primary text-white text-center">
            <h4>{groupName}</h4>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {groups[groupName].map((team, teamIndex) => (
                <ListGroup.Item
                  key={teamIndex}
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => handleTeamClick(team.teamId)}
                  style={{ backgroundColor: team.color, cursor: "pointer" }}
                >
                  <span>{team.teamName}</span>
                  <span className="badge bg-secondary rounded-pill">
                    {team.points} puntos
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Standings;
