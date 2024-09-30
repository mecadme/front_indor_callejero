import React from "react";
import fieldImage from "../../assets/field.png";

// Componente que genera un círculo con un color dinámico
const Circle = ({ color }) => (
  <svg width="50" height="50">
    <circle cx="25" cy="25" r="15" fill={color} />
  </svg>
);

// Componente principal del campo de fútbol con CSS Grid
const Field = ({ homeTeamColor, awayTeamColor }) => {
  // Estilo para el campo usando CSS Grid
  const fieldStyle = {
    backgroundImage: `url(${fieldImage})`, // Usamos la imagen importada
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "500px",
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)", // 5 columnas en total
    gridTemplateRows: "repeat(5, 1fr)", // 5 filas en total
    gridTemplateAreas: `
      "home1 . . . away1"
      ". home2 . away2 ."
      "home3 . . . away3"
      ". home4 . away4 ."
      "home5 . . . away5"
    `,
  };

  return (
    <div style={fieldStyle}>
      {/* Jugadores del equipo local */}
      <div style={{ gridArea: "home1" }}>
        <Circle color={homeTeamColor} />
      </div>
      <div style={{ gridArea: "home2" }}>
        <Circle color={homeTeamColor} />
      </div>
      <div style={{ gridArea: "home3" }}>
        <Circle color={homeTeamColor} />
      </div>
      <div style={{ gridArea: "home4" }}>
        <Circle color={homeTeamColor} />
      </div>
      <div style={{ gridArea: "home5" }}>
        <Circle color={homeTeamColor} />
      </div>

      {/* Jugadores del equipo visitante */}
      <div style={{ gridArea: "away1" }}>
        <Circle color={awayTeamColor} />
      </div>
      <div style={{ gridArea: "away2" }}>
        <Circle color={awayTeamColor} />
      </div>
      <div style={{ gridArea: "away3" }}>
        <Circle color={awayTeamColor} />
      </div>
      <div style={{ gridArea: "away4" }}>
        <Circle color={awayTeamColor} />
      </div>
      <div style={{ gridArea: "away5" }}>
        <Circle color={awayTeamColor} />
      </div>
    </div>
  );
};

export default Field;
