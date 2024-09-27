import useWeekAward from "../../hooks/useWeekAward";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/WeekTeam.css";
import { Container, Row, Col, Image } from "react-bootstrap";

const gridPositionMap = {
  GOALKEEPER: "portero",
  DEFENDER1: "defensa1",
  DEFENDER2: "defensa2",
  MIDFIELDER1: "medio1",
  MIDFIELDER2: "medio2",
  ATTACKER: "delantero",
};

const PlayerCard = ({ player, gridArea }) => {
  return (
    <div className={`player player-${gridArea}`}>
      <Image
        src={player.photoUrl}
        alt={`${player.firstName} ${player.lastName}`}
        style={{ width: "3.5rem", height: "3.5rem" }}
        className="img-player"
      />
      <span className="player-name mb-2" >{`${player.firstName} ${player.lastName}`}</span>
    </div>
  );
};

const WeekTeam = ({ date }) => {
  const { weekAward, isLoading, error } = useWeekAward(date);

  if (isLoading) {
    return <div>Cargando equipo...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const team = weekAward.team?.players || [];

  let defensaCount = 0;
  let medioCount = 0;

  return (
    <Container className="week-team">
    
      <Container className="cancha justify-content-center">
      {team.map((player) => {
          let gridArea = "";

          // Asignar el área del grid dependiendo de la posición del jugador
          if (player.position === "GOALKEEPER") {
            gridArea = gridPositionMap.GOALKEEPER;
          } else if (player.position === "DEFENDER") {
            defensaCount++;
            gridArea = gridPositionMap[`DEFENDER${defensaCount}`];
          } else if (player.position === "MIDFIELDER") {
            medioCount++;
            gridArea = gridPositionMap[`MIDFIELDER${medioCount}`];
          } else if (player.position === "ATTACKER") {
            gridArea = gridPositionMap.ATTACKER;
          }

          return <PlayerCard key={player.playerId} player={player} gridArea={gridArea} />;
        })}
      </Container>
    </Container>
  );
};

export default WeekTeam;
