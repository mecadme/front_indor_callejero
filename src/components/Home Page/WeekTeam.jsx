import useWeekAward from "../../hooks/useWeekAward"; 

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/WeekTeam.css";

const gridPositionMap = {
  GOALKEEPER: "portero",  // Modificado para seguir el formato de tu respuesta
  DEFENDER1: "defensa1",
  DEFENDER2: "defensa2",
  MIDFIELDER1: "medio1",
  MIDFIELDER2: "medio2",
  FORWARD: "delantero",
};

const WeekTeam = ({ date }) => {
  const { weekAward, isLoading, error } = useWeekAward(date);

  // Cargando o manejando errores
  if (isLoading) {
    return <div>Cargando equipo...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Obtener el equipo de la respuesta
  const team = weekAward.team?.players || [];

  // Contadores para asignar posiciones únicas
  let defensaCount = 0;
  let medioCount = 0;

  return (
    <div className="week-team container">
      <h2 className="text-center mb-4">Equipo de la Semana</h2>
      <div className="cancha justify-content-center">
        <div className="field">
          <div className="team-grid">
            {team.map((player) => {
              let gridArea = "";

              // Asignación de posiciones según el backend
              if (player.position === "GOALKEEPER") {
                gridArea = gridPositionMap.GOALKEEPER;
              } else if (player.position === "DEFENDER") {
                defensaCount++;
                gridArea = gridPositionMap[`DEFENDER${defensaCount}`];
              } else if (player.position === "MIDFIELDER") {
                medioCount++;
                gridArea = gridPositionMap[`MIDFIELDER${medioCount}`];
              } else if (player.position === "FORWARD") {
                gridArea = gridPositionMap.FORWARD;
              }

              return (
                <div
                  key={player.playerId}
                  className={`player player-${player.playerId}`}
                  style={{ gridArea }}
                >
                  <img
                    src={player.photoUrl}
                    alt={player.firstName}
                    className="img-player"
                  />
                  <span>{`${player.firstName} ${player.lastName}`}</span>
                  <small className="text-muted">{player.position}</small>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekTeam;
