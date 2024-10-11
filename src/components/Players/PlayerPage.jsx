import { useState } from "react";
import {
  Badge,
  Card,
  Col,
  Container,
  Image,
  ListGroup,
  ProgressBar,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import useFetchPlayerInfo from "../../hooks/useFetchPlayerInfo";
import useFetchPlayerStats from "../../hooks/useFetchPlayerStats";
import EmptyData from "../Administration/EmptyData";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import getTeamStyles from "../Utils/TeamBannerStyle";

const PlayerPage = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const { playerInfo, loadingInfo, errorInfo } = useFetchPlayerInfo(playerId);
  const { playerStats, loadingStats, errorStats } =
    useFetchPlayerStats(playerId);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [key, setKey] = useState("info");

  if (loadingInfo || loadingStats) {
    return <p>Loading...</p>;
  }

  if (errorInfo || errorStats) {
    return <p>{errorInfo || errorStats}</p>;
  }

  if (!playerInfo || !playerStats) {
    return (
      <Container fluid className=" m-0 p-0 w-100">
        <Header />
        <EmptyData message="No se ha encontrado el jugador" />
      </Container>
    );
  }

  const team_color = playerStats?.teamColor || "#000";
  const teamStyles = getTeamStyles({ teamColor: team_color });

  const {
    firstName,
    lastName,
    jerseyNumber,
    age,
    height,
    status,
    photoUrl,
    position,
  } = playerInfo;

  const {
    teamId,
    teamName,
    teamLogoUrl,
    teamColor,
    unbeatenMatches,
    minutesPlayed,
    fouls,
    passes,
    goals,
    assists,
    redCards,
    yellowCards,
    aerials,
    ballStolen,
    clearances,
    goalsShots,
    totalShots,
  } = playerStats;

  const isGoalkeeper = position.toLowerCase() === "goalkeeper";
  const isActive = status.toLowerCase() === "active";

  const totalStats = goals + assists + redCards + yellowCards;
  const goalkeeperStats = unbeatenMatches + passes + assists;

  const statsList = [
    { name: "Partidos Imbatido", value: unbeatenMatches },
    { name: "Faltas Cometidas", value: fouls },
    { name: "Pases", value: passes },
    { name: "Goles", value: goals },
    { name: "Asistencias", value: assists },
    { name: "Tarjetas Amarillas", value: yellowCards },
    { name: "Tarjetas Rojas", value: redCards },
    { name: "Duelos Aéreos", value: aerials },
    { name: "Robos de Balón", value: ballStolen },
    { name: "Disparos Totales", value: totalShots },
    { name: "Disparos al Arco", value: goalsShots },
    { name: "Despejes", value: clearances },
  ];

  const sortedStatsList = statsList.sort((a, b) => {
    if (b.value !== a.value) {
      return b.value - a.value;
    }
    return a.name.localeCompare(b.name);
  });

  const handleTeamSelection = (teamId) => {
    setSelectedTeam(teamId);
    navigate(`/team/${teamId}`);
  };

  return (
    <Container fluid className="p-0">
      <Header />

      <Container
        fluid
        style={{
          ...teamStyles.containerStyle,
          padding: "0.5rem 0",
          width: "100%",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col>
              <Image
                src={photoUrl.trim()}
                fluid
                style={{ width: "20rem", height: "20rem", marginRight: "20px" }}
              />
            </Col>
            <Col>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "1.5rem" }}>
                {firstName}
              </p>
              <h2 style={{ margin: 0, fontWeight: "bold", fontSize: "2.5rem" }}>
                {lastName}
              </h2>
            </Col>
            <Col>
              <h2 className="text-white">#{jerseyNumber}</h2>
            </Col>
          </Row>
        </Container>
      </Container>

      <Container className="mt-4">
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
          <Tab eventKey="info" title="Información Básica">
            <Card className="p-4 shadow-sm">
              <Row>
                <Col md={7}>
                  <Image
                    src={teamLogoUrl}
                    fluid
                    style={{cursor: "pointer", width: "5rem", height: "5rem" }}
                    onClick={() => handleTeamSelection(teamId)}
                  />
                  <p>
                    <strong>Equipo:</strong> {teamName}
                  </p>
                  <p>
                    <strong>Edad:</strong> {age} años
                  </p>
                  <p>
                    <strong>Altura:</strong> {height}m
                  </p>
                </Col>
                <Col md={5}>
                  {isGoalkeeper ? (
                    <>
                      {isActive ? (
                        <Badge bg="danger" className="mb-2">
                          {status}
                        </Badge>
                      ) : (
                        <Badge bg="success" className="mb-2">
                          {status}
                        </Badge>
                      )}
                      <p>
                        <strong>Minutos jugados:</strong> {minutesPlayed}
                      </p>

                      <Row className="mt-3">
                        <Col xs={12}>
                          <h6>Desempeño General</h6>
                          <ProgressBar
                            striped
                            variant="success"
                            now={(unbeatenMatches / goalkeeperStats) * 100}
                            label={`${unbeatenMatches} Porterias Imbatidas`}
                            className="mb-2"
                          />
                          <ProgressBar
                            striped
                            variant="info"
                            now={(assists / totalStats) * 100}
                            label={`${assists} Asistencias`}
                            className="mb-2"
                          />
                          <ProgressBar
                            striped
                            variant="danger"
                            now={(passes / totalStats) * 100}
                            label={`${passes} Pases`}
                            className="mb-2"
                          />
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      {isActive ? (
                        <Badge bg="success" className="mb-2">
                          {status}
                        </Badge>
                      ) : (
                        <Badge bg="danger" className="mb-2">
                          {status}
                        </Badge>
                      )}
                      <p>
                        <strong>Minutos jugados:</strong> {minutesPlayed}
                      </p>

                      <Row className="mt-3">
                        <Col xs={12}>
                          <h6>Desempeño General</h6>
                          <ProgressBar
                            striped
                            variant="success"
                            now={(goals / totalStats) * 100}
                            label={`${goals} Goles`}
                            className="mb-2"
                          />
                          <ProgressBar
                            striped
                            variant="info"
                            now={(assists / totalStats) * 100}
                            label={`${assists} Asistencias`}
                            className="mb-2"
                          />
                          <ProgressBar
                            striped
                            variant="danger"
                            now={(redCards / totalStats) * 100}
                            label={`${redCards} Tarjetas Rojas`}
                            className="mb-2"
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                </Col>
              </Row>
            </Card>
          </Tab>

          <Tab eventKey="stats" title="Otras Estadísticas">
            <Card className="p-4 shadow-sm">
              <Row>
                <Col md={12}>
                  <ListGroup variant="flush">
                    {sortedStatsList.map((stat, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex justify-content-between align-items-center"
                      >
                        {stat.name}
                        <Badge bg="primary" pill>
                          {stat.value}
                        </Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Col>
              </Row>
            </Card>
          </Tab>
        </Tabs>
      </Container>

      <Footer />
    </Container>
  );
};

export default PlayerPage;
