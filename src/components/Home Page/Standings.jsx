import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Alert, Badge, Card, Container, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Loading from "../Utils/Loading";
import getTeamStyles from "../Utils/TeamBannerStyle";
import "./css/Standings.css";

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
    <Container className="standings-container mt-4">
      <h3
        className="text-center mb-4"
        onClick={handleTableClick}
        style={{ cursor: "pointer" }}
      >
        TABLAS
      </h3>
      {Object.keys(groups).map((groupName, index) => (
        <Card key={index} className=" standings-card shadow mx-4">
          <Card.Header className="text-white text-center">
            <h4>{groupName}</h4>
          </Card.Header>
          <Card.Body className="p-0 m-0">
            <ListGroup  className="home-standings text-center p-0 m-0">
              {groups[groupName].map((team, teamIndex) => {
                const teamStyles = getTeamStyles({ teamColor: team.color });

                return (
                  <ListGroup.Item
                    key={teamIndex}
                    className="d-flex justify-content-between align-items-center p-0 m-0"
                    onClick={() => handleTeamClick(team.teamId)}
                    style={{
                      ...teamStyles.containerStyle,
                      padding: "0.5rem 0",
                      width: "100%",
                    }}
                  >
                    <h2
                      className="mb-0"
                      style={{
                        ...teamStyles.textStyle,
                      }}
                    >
                      {team.teamName}
                    </h2>
                    <span
                      className="points"
                      style={{
                        ...teamStyles.textStyle,
                        fontSize: "1.5rem",
                      }}
                    >
                      {team.points} puntos
                    </span>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Standings;
