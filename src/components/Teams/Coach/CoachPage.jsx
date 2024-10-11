import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useGetEthicsOfficerById } from "../../../api/Service/EthicsOfficerService";
import EmptyData from "../../Administration/EmptyData";
import Footer from "../../Footer/Footer";
import Header from "../../Header/Header";
import Loading from "../../Utils/Loading";
import PageBanner from "../../Utils/PageBanner";
import getTeamStyles from "../../Utils/TeamBannerStyle";

const CoachPage = () => {
  const { coachId } = useParams();
  const { data, loading, error, getEthicsOfficerById } =
    useGetEthicsOfficerById();
  const [selectedTeam, setSelectedTeam] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    getEthicsOfficerById(coachId);
  }, [coachId]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <Loading />
      </div>
    );
  }

  if (error || data === null) {
    return (
      <Container className="text-center py-5">
        <h4 className="text-danger">
          Error: {error?.message || "Algo salió mal"}
        </h4>
        <EmptyData message={"No hay información sobre el técnico"} />
      </Container>
    );
  }

  const teamColor = data?.team.color || "#f0f0f0";
  const teamStyle = getTeamStyles({ teamColor });
  const fallbackImage = "https://via.placeholder.com/150"; 

  const handleTeamSelection = (teamId) => {
    setSelectedTeam(teamId);
    navigate(`/team/${teamId}`);
  };
  return (
    <>
      <Header />
      <Container fluid className="p-0">
        <Container className="banner-container">
          <PageBanner title={"Oficial de Ética"} />

          <div
            style={{
              ...teamStyle.containerStyle,
              padding: "0.5rem 0",
              width: "100%",
            }}
          >
            <Container>
              <Row className="align-items-center">
                <Col xs={12} md={6} className="text-center mb-3 mb-md-0">
                  <Image
                    variant="top"
                    src={data?.photoUrl || fallbackImage}
                    alt={data?.ethicsOfficer || "Técnico"}
                    style={{
                      width: "12.25rem",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "2px solid #ddd",
                    }}
                  />
                </Col>
                <Col xs={12} md={6} className="text-center">
                  <h1
                    className="mb-2"
                    style={{ color: teamStyle.textColor || "#333" }}
                  >
                    {data?.ethicsOfficer}
                  </h1>
                  <h3
                    className="mb-2 text-muted"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleTeamSelection(data?.team.teamId)}
                  >
                    {data?.team.neighborhood}
                  </h3>
                </Col>
              </Row>
            </Container>
          </div>
          <Container>
            <h3 className="text-center mb-4">Biografía</h3>
            <Row className="justify-content-center">
              <Col xs={12} md={10} lg={8} className="text-center">
                <p style={{ lineHeight: "1.6", fontSize: "1.1rem" }}>
                  {data?.bio ||
                    "No hay biografía disponible para este técnico."}
                </p>
              </Col>
            </Row>
          </Container>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default CoachPage;
