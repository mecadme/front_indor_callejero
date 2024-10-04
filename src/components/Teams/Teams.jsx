import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import useFetchTeams from "../../hooks/useFetchTeams";
import EmptyData from "../Administration/EmptyData";
import StyleUtils from "../Utils/StyleUtils";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const { lightenColor, getTextColor, zigZagSvg } = StyleUtils();

const grayZigZagSvg = zigZagSvg("#b6bdc0", "#D3D3D3");

const Teams = () => {
  const { teams, isLoading, error } = useFetchTeams();

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
    <Container fluid >
      <Header />
    <Container fluid className="mt-5 mb-5">
      <h2 className="text-center">{"PLANTILLAS"}</h2>

      <Row>
        {teams.map((team) => {
          const lighterColor = lightenColor(team.color, 30); 
          const defaultTextColor = getTextColor("#b6bdc0"); 
          const hoverTextColor = getTextColor(team.color); 
          const zigZagBackground = zigZagSvg(team.color, lighterColor); 


          return (
            <Col key={team.teamId} xs={6} md={4} lg={4} className="mb-4">
              <Card
                className="team-card "
                style={{
                  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
                    grayZigZagSvg
                  )}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  transition: "background-image 0.2s ease, color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector("a").style.color = hoverTextColor;
                  e.currentTarget.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(
                    zigZagBackground
                  )}")`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector("a").style.color = defaultTextColor;
                  e.currentTarget.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(
                    grayZigZagSvg
                  )}")`;
                }}
              >
                <Card.Img
                  variant="top"
                  src={team.logoUrl}
                  alt={team.name}
                  style={{ objectFit: "contain", height: "5rem" , margin: "0.5rem"}}
                />
                <Card.Body>
                  <Card.Title>
                    <Link
                      to={`/team/${team.teamId}`}
                      className="text-decoration-none"
                      style={{
                        color: defaultTextColor,
                        fontWeight: "bold",
                        fontSize: "2.2rem",
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
