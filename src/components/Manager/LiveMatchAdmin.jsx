import React, { useState } from "react";
import LineUpManager from "./LineUpManager";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Card from "react-bootstrap/Card";
import { ButtonGroup } from "react-bootstrap";
import {
  useStartMatch,
  usePauseMatch,
  useStopMatch,
  useResumeMatch,
} from "../../api/Service/MatchService";
import { format } from "date-fns";
import { useUpdatePlayer } from "../../api/Service/PlayerService";
import Countdown from "react-countdown";

const LiveMatchAdmin = ({ matches }) => {
  const [matchTimer, setMatchTimer] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTab, setCurrentTab] = useState("list");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { startMatch } = useStartMatch();
  const { pauseMatch } = usePauseMatch();
  const { stopMatch } = useStopMatch();
  const { resumeMatch } = useResumeMatch();
  const { updatePlayer } = useUpdatePlayer();

  const startIcon = "https://cdn-icons-png.flaticon.com/512/9581/9581128.png";
  const pauseIcon = "https://cdn-icons-png.flaticon.com/512/2920/2920686.png";
  const resumeIcon = "https://cdn-icons-png.flaticon.com/512/9581/9581132.png";
  const stopIcon = "https://cdn-icons-png.flaticon.com/512/4029/4029077.png";

  const handleMatchStart = (matchId) => {
    startMatch(matchId);
    if (selectedMatch) {
      const endTime = Date.now() + selectedMatch.duration * 60 * 1000;
      setMatchTimer(endTime);
      setIsPaused(false);
    }
  };

  const handleMatchPause = (matchId) => {
    pauseMatch(matchId);
    if (matchTimer) {
      setTimeRemaining(matchTimer - Date.now());
      setIsPaused(true);
    }
  };

  const handleMatchResume = (matchId) => {
    resumeMatch(matchId);
    if (isPaused && timeRemaining) {
      const newEndTime = Date.now() + timeRemaining;
      setMatchTimer(newEndTime);
      setIsPaused(false);
    }
  };

  const handleMatchStop = async (matchId) => {
    try {
      await stopMatch(matchId);
      setMatchTimer(0);
      setTimeRemaining(0);
      setIsPaused(false);
      setSelectedMatch(null);
    } catch (error) {
      console.error("Error stopping the match:", error);
    }
  };

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setCurrentTab("admin");
  };

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <span>Partido Finalizado</span>;
    } else {
      return (
        <div className="timer text-center my-3">
          <span>
            Tiempo Restante: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </div>
      );
    }
  };

  return (
    <Tabs
      activeKey={currentTab}
      onSelect={(k) => setCurrentTab(k)}
      className="mt-3"
    >
      <Tab eventKey="list" title="Lista de Partidos">
        <div className="mt-4">
          <h2>Partidos en Vivo</h2>
          <ul className="list-group">
            {matches &&
              matches
                .filter((match) => match.status === "NOT_STARTED")
                .map((match) => (
                  <li key={match.matchId} className="list-group-item">
                    <Button
                      variant="outline-primary"
                      onClick={() => handleSelectMatch(match)}
                    >
                      {match.homeTeam.name} vs {match.awayTeam.name} -{" "}
                      {format(
                        new Date(match.schedule.date),
                        "dd MMM yy, HH:mm"
                      )}
                    </Button>
                  </li>
                ))}
          </ul>
        </div>
      </Tab>
      <Tab
        eventKey="admin"
        title="Administrar Partido"
        disabled={!selectedMatch}
      >
        {selectedMatch ? (
          <div className="mt-4">
            <Card>
              <Card.Header>
                <h3>
                  {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}
                </h3>
              </Card.Header>
              <Card.Body>
                {matchTimer > 0 && !isPaused ? (
                  <Countdown date={matchTimer} renderer={renderer} />
                ) : (
                  <div className="timer text-center my-3">
                    <span>El temporizador está detenido.</span>
                  </div>
                )}
                <ButtonGroup aria-label="match-control-buttons" size="lg" className="mb-3 w-50 d-flex justify-content-center mx-auto">
                  <Button
                    variant="success"
                    onClick={() => handleMatchStart(selectedMatch.matchId)}
                  >
                    <img
                      src={startIcon}
                      alt="Start Icon"
                      width="20"
                      height="20"
                    />
                  </Button>{" "}
                  <Button
                    variant="warning"
                    onClick={() => handleMatchPause(selectedMatch.matchId)}
                  >
                    <img
                      src={pauseIcon}
                      alt="Pause Icon"
                      width="20"
                      height="20"
                    />
                  </Button>{" "}
                  <Button
                    variant="primary"
                    onClick={() => handleMatchResume(selectedMatch.matchId)}
                  >
                    <img
                      src={resumeIcon}
                      alt="Resume Icon"
                      width="20"
                      height="20"
                    />
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleMatchStop(selectedMatch.matchId)}
                  >
                    <img
                      src={stopIcon}
                      alt="Stop Icon"
                      width="20"
                      height="20"
                    />
                  </Button>
                </ButtonGroup>
              </Card.Body>
            </Card>

            <LineUpManager
              matchId={selectedMatch.matchId}
              homeTeam={selectedMatch.homeTeam}
              awayTeam={selectedMatch.awayTeam}
            />

            <div className="mt-3">
              <h5>Selecciona Árbitro</h5>
              <select
                className="form-select"
                onChange={(e) =>
                  addRefereeToMatch(e.target.value, selectedMatch.matchId)
                }
              >
                <option value="1">Árbitro 1</option>
                <option value="2">Árbitro 2</option>
                {/* Cargar árbitros desde la API */}
              </select>
            </div>
          </div>
        ) : (
          <p className="mt-4">
            Por favor, selecciona un partido de la lista para administrar.
          </p>
        )}
      </Tab>
    </Tabs>
  );
};

export default LiveMatchAdmin;
