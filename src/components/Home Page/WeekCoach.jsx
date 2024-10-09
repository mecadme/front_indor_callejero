import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/WeekCoach.css";
import useWeekAward from "../../hooks/useWeekAward"; // Asegúrate de que esta ruta sea correcta
import { Card, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const WeekCoach = ({ date }) => {
  const { weekAward, isLoading, error } = useWeekAward(date);
  const navigate = useNavigate();


  if (isLoading) {
    return <div>Cargando técnico...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  
  const tecnico = weekAward?.ethicOfficer;

  if (!tecnico) {
    return <div className="alert alert-info">No hay técnico disponible</div>;
  }

   const handleCoachClick = () => {
    navigate(`/coach`);
  };

  return (
    <Container className="week-coach container"
    onClick={() => handleCoachClick()}
      style={{ cursor: "pointer" }}
    >
      <Row className="row_coach">
        <Card className="card text-center" style={{ alignItems: "center" }}>
          <h4 className="text-center mb-4">Técnico de la Fecha</h4>
          <Card.Img
            src={tecnico.ethicOfficerPhotoUrl}
            alt={tecnico.ethicOfficerName}
            style={{ width: "4rem", height: "4rem" }}
          />
          <Card.Body className="card-body">
            <h5 className="card-title">{tecnico.ethicOfficerName}</h5>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default WeekCoach;
