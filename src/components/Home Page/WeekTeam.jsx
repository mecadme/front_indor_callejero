import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Image } from "react-bootstrap";
import useWeekAward from "../../hooks/useWeekAward";
import "./css/WeekTeam.css";
import { useNavigate } from "react-router-dom";

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
      <span className="player-name mb-2">{`${player.firstName} ${player.lastName}`}</span>
    </div>
  );
};

const WeekTeam = ({ date }) => {
  const { weekAward, isLoading, error } = useWeekAward(date);
  const navigate = useNavigate();


  if (isLoading) {
    return <div>Cargando equipo...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const team = weekAward.team?.players || [];
 const teamId = weekAward.team?.teamId

  let defensaCount = 0;
  let medioCount = 0;

  const handleTeamClick = () => {
    navigate(`/team/${teamId}`);
  };

  return (
    <Container
      className="week-team"
      onClick={() => handleTeamClick()}
      style={{ cursor: "pointer" }}
    >
      <Container className="cancha justify-content-center">
        {team.map((player) => {
          let gridArea = "";

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

          return (
            <PlayerCard
              key={player.playerId}
              player={player}
              gridArea={gridArea}
            />
          );
        })}
      </Container>
    </Container>
  );
};

export default WeekTeam;
