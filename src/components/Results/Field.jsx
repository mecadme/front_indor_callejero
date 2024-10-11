import React from "react";
import fieldImage from "../../assets/field.png";
import "./css/Field.css";

const Circle = ({ color }) => (
  <svg width="40" height="40">
    <circle cx="15" cy="15" r="8" fill={color} />
  </svg>
);

const players = {
  home: ["home1", "home2", "home3", "home4", "home5", "home6"],
  away: ["away1", "away2", "away3", "away4", "away5", "away6"],
};

const Field = ({ homeTeamColor, awayTeamColor }) => {
  const fieldStyle = {
    backgroundImage: `url(${fieldImage})`,
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
