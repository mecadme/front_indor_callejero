import useWeekAward from "../../hooks/useWeekAward";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/WeekPlayer.css";
import { Card, Col, Container, Row } from "react-bootstrap";

const WeekPlayer = ({ date }) => {
  // Corrección en la estructura del componente

  const { weekAward, isLoading, error } = useWeekAward(date);

  if (isLoading) {
    return <div>Cargando jugador...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const player = weekAward.player;

  // Si no hay jugador disponible
  if (!player) {
    return <div className="alert alert-info">No hay jugador disponible</div>;
  }

  return (
    <Container className="week-player container">
      <Row className="row_player">
        <Card className="card text-center" style={{ alignItems: "center" }}>
          <h4 className="text-center mb-4">Jugador de la Fecha</h4>
          <Card.Img
            variant="top"
            src={player.photoUrl}
            alt={`${player.firstName} ${player.lastName}`}
            style={{ width: "4rem", height: "4rem" }}
          />

          <Card.Body className="card-body">
            <h5 className="card-title">{`${player.firstName} ${player.lastName}`}</h5>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default WeekPlayer;
