import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Container } from "react-bootstrap";

const Rounds = ({ RoundsData }) => {

  return (
    <Container className="Rounds container">
      {RoundsData.length > 0 ? (
        RoundsData.map((round) => (
          <div key={round.roundId} className="Rounds-card">
            <h4 className="Rounds-title">{round.roundName}</h4>
            {round.matches.map((match, index) => (
              <div key={index} className="match-details">
                <p className="Rounds-date">
                  <strong>{new Date(match.date).toLocaleDateString()}</strong> -{" "}
                  {match.place}
                </p>
                <ul className="list-group">
                  <li className="list-group-item match-card d-flex flex-column align-items-center">
                    <div className="d-flex justify-content-between">
                      <span className="team team1">{match.homeTeam}</span>
                      <span className="score">
                        {match.goalsHomeTeam} - {match.goalsAwayTeam}
                      </span>
                      <span className="team team2">{match.awayTeam}</span>
                    </div>
                    <span className="match-time">
                      {new Date(match.date).toLocaleTimeString()}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        ))
      ) : (
        <div>No se encontraron partidos para la jornada seleccionada.</div>
      )}
    </Container>
  );
};

export default Rounds;
