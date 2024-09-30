import React from "react";

const FinalScore = ({ events, homeTeam, awayTeam }) => {
  if (!events || events.length === 0) {
    return (
      <div 
        className="final-score text-white"
        style={{
          textAlign: "center",
          padding: "1.5rem",
          fontSize: "4rem",
          fontWeight: "bold",
          backgroundColor: "#33173C",
          width: "100%",
        }}
      >
        0 - 0
      </div>
    );
  }

  // Filtrar los eventos para obtener solo los goles
  const goals = events.filter((event) => event.eventType === "GOAL");

  // Contar goles del equipo local (home)
  const homeGoals = goals.filter(
    (goal) => goal.teamId === homeTeam.teamId
  ).length;

  // Contar goles del equipo visitante (away)
  const awayGoals = goals.filter(
    (goal) => goal.teamId === awayTeam.teamId
  ).length;

  return (
    <div
      className="final-score text-white"
      style={{
        textAlign: "center",
        padding: "1.5rem",
        fontSize: "4rem",
        fontWeight: "bold",
        backgroundColor: "#33173C",
        width: "100%",
      }}
    >
      <div>
        {homeGoals} - {awayGoals}
      </div>
    </div>
  );
};

export default FinalScore;
