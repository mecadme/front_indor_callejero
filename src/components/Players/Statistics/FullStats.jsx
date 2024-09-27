import React from "react";
import { useLocation, useParams } from "react-router-dom";
import PlayerStatistics from "./PlayerStatistics"; // Reutiliza el componente de estadísticas

const FullStatistics = () => {
  const { eventType } = useParams();
  const location = useLocation();

  return (
    <div>
      <h2 className="text-center">{location.state?.name || "Estadísticas"}</h2>
      <PlayerStatistics eventType={eventType} name={location.state?.name} />
    </div>
  );
};

export default FullStatistics;
