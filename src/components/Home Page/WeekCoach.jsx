import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/WeekCoach.css";
import useWeekAward from "../../hooks/useWeekAward"; // Asegúrate de que esta ruta sea correcta
import { Card, Container, Row } from "react-bootstrap";

const WeekCoach = ({ date }) => {
  const { weekAward, isLoading, error } = useWeekAward(date);

  if (isLoading) {
    return <div>Cargando técnico...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Extraer el técnico (ethicOfficer) desde la respuesta de weekAward
  const tecnico = weekAward?.ethicOfficer;

  if (!tecnico) {
    return <div className="alert alert-info">No hay técnico disponible</div>;
  }

  return (
    <Container className="week-coach container">
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
