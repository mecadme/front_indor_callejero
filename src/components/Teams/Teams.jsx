import React from 'react';
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import useFetchTeams from "../../hooks/useFetchTeams";
import EmptyData from "../Administration/EmptyData";

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
    <Container>
      <h2 className="text-center">{'PLANTILLAS'}</h2>

      <Row>
        {teams.map((team) => (
          <Col key={team.teamId} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={team.logoUrl} alt={team.name} />
              <Card.Body>
                <Card.Title>
                  <Link to={`/team/${team.teamId}`} className="text-decoration-none text-dark">
                    {team.name}
                  </Link>
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Teams;
