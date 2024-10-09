import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Spinner,
  Card,
  Alert,
  Badge,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Loading from "../Utils/Loading";

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
    return <Loading />;
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
      <h3
        className="text-center mb-4"
        onClick={() => handleTableClick()}
        style={{ cursor: "pointer" }}
      >
        TABLAS
      </h3>
      {Object.keys(groups).map((groupName, index) => (
        <Card key={index} className="mb-4 shadow">
          <Card.Header className="bg-primary text-white text-center">
            <h4>{groupName.toUpperCase()}</h4>
          </Card.Header>
          <Card.Body className="p-0 m-0">
            <ListGroup variant="flush" className="text-center p-0 m-0">
              {groups[groupName].map((team, teamIndex) => (
                <ListGroup.Item
                  key={teamIndex}
                  className="d-flex justify-content-between align-items-center p-0 m-0"
                  onClick={() => handleTeamClick(team.teamId)}
                  style={{ backgroundColor: team.color, cursor: "pointer" }}
                >
                  <h2 className="mb-0">{team.teamName}</h2>
                  <Badge className="points">
                    {team.points} puntos
                  </Badge>
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
