import "bootstrap/dist/css/bootstrap.min.css";
import { shuffle } from "lodash";
import { Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useWeekAward from "../../hooks/useWeekAward";
import Loading from "../Utils/Loading";
import "./css/WeekTeam.css";

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
        className="img-player"
      />
      <p className="player-name mb-2">{`${player.firstName} ${player.lastName}`}</p>
    </div>
  );
};

const WeekTeam = ({ date }) => {
  const { weekAward, isLoading, error } = useWeekAward(date);
  const navigate = useNavigate();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const team = weekAward.team?.players || [];
  const teamId = weekAward.team?.teamId;

  const goalkeepers = shuffle(
    team.filter((player) => player.position === "GOALKEEPER")
  );
  const defenders = shuffle(
    team.filter((player) => player.position === "DEFENDER")
  );
  const midfielders = shuffle(
    team.filter((player) => player.position === "MIDFIELDER")
  );
  const attackers = shuffle(
    team.filter((player) => player.position === "ATTACKER")
  );

  const selectedPlayers = [
    ...goalkeepers.slice(0, 1),
    ...defenders.slice(0, 2),
    ...midfielders.slice(0, 2),
    ...attackers.slice(0, 1),
  ];

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
        {selectedPlayers.map((player) => {
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
