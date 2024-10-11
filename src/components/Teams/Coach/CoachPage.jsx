import React, { useEffect } from "react";
import Header from "../../Header/Header";
import EmptyData from "../../Administration/EmptyData";
import Footer from "../../Footer/Footer";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useGetEthicsOfficerById } from "../../../api/Service/EthicsOfficerService";
import { useParams } from "react-router-dom";
import Loading from "../../Utils/Loading";
import PageBanner from "../../Utils/PageBanner";
import getTeamStyles from "../../Utils/TeamBannerStyle";

const CoachPage = () => {
  const { coachId } = useParams();
  const { data, loading, error, getEthicsOfficerById } =
    useGetEthicsOfficerById();

  useEffect(() => {
    getEthicsOfficerById(coachId);
  }, [coachId]);

  loading && <Loading />;

  if (error || data === null  ) {
    return (
      <div>
        Error: {error?.message || "Algo salió mal"}
        <EmptyData message={"No hay infomación sobre el técnico"} />
      </div>
    );
  }
console.log(data)
const teamColor = data?.team.color
const teamStyle = getTeamStyles({teamColor})
console.log(teamStyle)
  return (
    <Container fluid className="p-0">
      <Header />
      <Container className="banner-container">
        <PageBanner title={"Entrenador"} />
        <Card>
          <Card.Header
          style={teamStyle.containerStyle}
          >
            <Row className="align-items-center">
              <Col xs={12} md={6} className="text-center">
                <Card.Img
                  variant="top"
                  src={data?.photoUrl}
                  alt={data}
                  style={{ width: "15rem", height: "15rem", margin: "1rem" }}
                />
              </Col>
              <Col xs={12} md={6} className="text-center">
                <h1>{data?.ethicsOfficer}</h1>
                <h3>{data?.team.neighborhood}</h3>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Container>
              <h3 className="text-center mb-4"></h3>
              <Row className="justify-content-center">
                {data?.bio}
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </Container>
  );
};

export default CoachPage;
