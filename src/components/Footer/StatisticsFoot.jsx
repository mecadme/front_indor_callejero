import React from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const StatisticsFoot = () => {
  return (
    <ListGroup>
      <Link to="/estadisticas" className="nav-link">
        <h5>Estadísticas</h5>
      </Link>
      <ListGroup.Item>
        <Link to="/goleadores" className="nav-link">
          Goleadores
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/asistencias" className="nav-link">
          Asistencias
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/tarjetas" className="nav-link">
          Tarjetas
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/porterias_imbatidas" className="nav-link">
          Porterias imbatidas
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/duelos_aereos" className="nav-link">
          Duelos Aéreos
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/robos_balon" className="nav-link">
          Robos de Balón
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/minutos_jugados" className="nav-link">
          Minutos Jugados
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/pases" className="nav-link">
          Pases
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/disparos_totales" className="nav-link">
          Disparos Totales
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/disparos_arco" className="nav-link">
          Disparos al Arco
        </Link>
      </ListGroup.Item>
      <ListGroup.Item>
        <Link to="/despejes" className="nav-link">
          Despejes
        </Link>
      </ListGroup.Item>
    </ListGroup>
  );
};

export default StatisticsFoot;
