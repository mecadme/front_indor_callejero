import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useFetchTeams from "../../hooks/useFetchTeams";
import EmptyData from "../Administration/EmptyData";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import StyleUtils from "../Utils/StyleUtils";
import PageBanner from "../Utils/PageBanner";

const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();

const Teams = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { teams, isLoading, error } = useFetchTeams();
  const navigate = useNavigate();

  const handleTeamSelection = (teamId) => {
    setSelectedTeam(teamId);
    navigate(`/team/${teamId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!teams || teams.length === 0) {
    return <EmptyData />;
  }

  return (
    <Container fluid>
      <Header />
      <Container className="banner-container">
        <PageBanner title={"Plantillas"} />

        <Row>
          {teams.map((team) => {
            const lighterColor = lightenColor(team.color, 40);
            const textColor = getTextColor(lighterColor);
            const zigZagBackground = zigZagSvg(team.color, lighterColor);

            return (
              <Col
                key={team.teamId}
                xs={6}
                md={4}
                lg={4}
                className="justify-content-center align-items-center text-center  mb-4"
              >
                <img
                  src={team.logoUrl}
                  alt={team.name}
                  style={{
                    objectFit: "contain",
                    height: "15rem",
                    margin: "0.5rem",
                  }}
                />
                <Card
                  className="team-card "
                  onClick={() => handleTeamSelection(team.teamId)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                      zigZagBackground
                    )}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    transition: "background-image 0.2s ease, color 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                    <Card.Title>
                      <img
                        src={team.logoUrl}
                        alt={team.name}
                        style={{
                          objectFit: "contain",
                          height: "5rem",
                          margin: "0.5rem",
                        }}
                      />

                      <Link
                        to={`/team/${team.teamId}`}
                        className="text-decoration-none"
                        style={{
                          color: textColor,
                          fontWeight: "bold",
                          fontSize: "5.2rem",
                          fontVariant: "small-caps",
                        }}
                      >
                        {team.name}
                      </Link>
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
      <Footer />
    </Container>
  );
};

export default Teams;
