import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Card, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useWeekAward from "../../hooks/useWeekAward"; 
import "./css/WeekCoach.css";

const WeekCoach = ({ date }) => {
  const { weekAward, isLoading, error } = useWeekAward(date);
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Cargando técnico...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const coach = weekAward?.ethicOfficer;

  if (!coach) {
    return <div className="alert alert-info">No hay técnico disponible</div>;
  }

  const handleCoachClick = (coachId) => {
    navigate(`/coach/${coachId}`);
  };

  return (
    <Container
      className="week-coach container"
      onClick={() => handleCoachClick(coach.ethicOfficerId)}
      style={{ cursor: "pointer" }}
    >
      <Row className="row_coach">
        <Card className="card text-center" style={{ alignItems: "center" }}>
          <h4 className="text-center mb-4">Técnico de la Fecha</h4>
          <Card.Img
            src={coach.ethicOfficerPhotoUrl}
            alt={coach.ethicOfficerName}
            style={{ width: "4rem", height: "4rem" }}
          />
          <Card.Body className="card-body">
            <h5 className="card-title">{coach.ethicOfficerName}</h5>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default WeekCoach;
