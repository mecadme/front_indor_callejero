import React from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./css/StatisticsFoot.css";

const StatisticsFoot = () => {
  const eventNames = {
    goal: "Goleadores",
    assist: "Asistencias",
    card: "Tarjetas",
    unbeaten_matches: "Porterías Imbatidas",
    aerials: "Duelos Aéreos",
    balls_stolen: "Robos de Balón",
    minutes_played: "Minutos Jugados",
    pass: "Pases",
    totalShots: "Disparos Totales",
    goals_shots: "Disparos al Arco",
    clearances: "Despejes",
  };

  return (
    <ListGroup className="statistics-foot">
      <Link to="/statistics" className="nav-link">
        <h5>Estadísticas</h5>
      </Link>
      {Object.keys(eventNames).map((eventType) => (
        <ListGroup.Item key={eventType} className="event-link p-0 m-0">
          <Link
            to={`/${eventType}`}
            className="nav-link"
            state={{ name: eventNames[eventType] }}
          >
            {eventNames[eventType]}
          </Link>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default StatisticsFoot;
