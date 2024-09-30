import React from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import useSponsors from "../../hooks/useSponsors";

const Sponsors = ({ maxContributions }) => {
  const { sponsors, isLoading, error } = useSponsors();

  if (isLoading) {
    return (
      <Container className="text-center my-4">
        <Spinner animation="border" variant="primary" />
        <p>Cargando auspiciantes...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <footer className="footer">
      <Container fluid>
        <Row className="justify-content-center text-center">
          {sponsors.length > 0 ? (
            sponsors.map(
              (sponsor) =>
                sponsor.contributionAmount > maxContributions && (
                  <Col
                    key={sponsor.sponsorId}
                    xs={6}
                    md={4}
                    lg={2}
                    className="mb-4"
                    onClick={() => handleTeamClick()}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={sponsor.photoUrl}
                      alt={sponsor.sponsor}
                      className="img-fluid"
                      style={{ height: "3rem", objectFit: "contain" }}
                    />
                  </Col>
                )
            )
          ) : (
            <Col>
              <p>No hay patrocinadores disponibles</p>
            </Col>
          )}
        </Row>
      </Container>
    </footer>
  );
};

export default Sponsors;
