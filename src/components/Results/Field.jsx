import React from "react";
import fieldImage from "../../assets/field.png";
import "./css/Field.css";

// Componente que genera un círculo con un color dinámico
const Circle = ({ color }) => (
  <svg width="50" height="50">
    <circle cx="25" cy="25" r="6" fill={color} />
  </svg>
);

// Datos de los jugadores con sus áreas de la cuadrícula
const players = {
  home: ["home1", "home2", "home3", "home4", "home5", "home6"],
  away: ["away1", "away2", "away3", "away4", "away5", "away6"],
};

// Componente principal del campo de fútbol con CSS Grid
const Field = ({ homeTeamColor, awayTeamColor }) => {
  const fieldStyle = {
    backgroundImage: `url(${fieldImage})`
  };

  const renderPlayers = (team, color) =>
    players[team].map((position) => (
      <div key={position} style={{ gridArea: position }}>
        <Circle color={color} />
      </div>
    ));

  return (
    <div className="field m-0 p-0" style={fieldStyle}>
      {renderPlayers("home", homeTeamColor)}
      {renderPlayers("away", awayTeamColor)}
    </div>
  );
};

export default Field;
