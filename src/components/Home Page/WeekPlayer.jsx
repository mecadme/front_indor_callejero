import useWeekAward from "../../hooks/useWeekAward"; 

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/WeekPlayer.css";

const WeekPlayer = ({ date }) => {  // Corrección en la estructura del componente

  const { weekAward, isLoading, error } = useWeekAward(date);

  if (isLoading) {
    return <div>Cargando jugador...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const player = weekAward.player;

  // Si no hay jugador disponible
  if (!player) {
    return <div className="alert alert-info">No hay jugador disponible</div>;
  }

  return (
    <div className="week-player container">
      <h2 className="text-center mb-4">Jugador de la Fecha</h2>
      <div className="row_player">
        <div className="col-6 col-md-4 col-lg-3 mb-4">
          <div className="card text-center">
            {/* Mostramos la imagen del jugador */}
            <img 
              src={player.photoUrl} 
              alt={`${player.firstName} ${player.lastName}`} 
              className="card-img-top" 
            />
            <div className="card-body">
              {/* Nombre completo del jugador */}
              <h5 className="card-title">{`${player.firstName} ${player.lastName}`}</h5>
              {/* Posición del jugador */}
              <small className="text-muted">{player.position}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekPlayer;
