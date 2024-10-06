import React, { useState, useEffect } from "react";
import {
  useGetMatches,
  useStartMatch,
  usePauseMatch,
  useResumeMatch,
  useStopMatch,
  useSetLineUp,
  useRegisterMatchEvent,
  useChangePlayer,
} from "../../api/Service/MatchService";
import { useAddRefereeToMatch } from "../../api/Service/RefereeService";
import LineUpManager from "./LineUpManager";
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';

const MatchManager = () => {
  const [viewMode, setViewMode] = useState("live");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [matchTimer, setMatchTimer] = useState(0);
  const [currentTab, setCurrentTab] = useState('list'); // Tab to manage List vs Admin tabs

  const { data: matches, getMatches } = useGetMatches();
  const { startMatch } = useStartMatch();
  const { pauseMatch } = usePauseMatch();
  const { resumeMatch } = useResumeMatch();
  const { stopMatch } = useStopMatch();
  const { addRefereeToMatch } = useAddRefereeToMatch();

  useEffect(() => {
    getMatches();
  }, []);

  useEffect(() => {
    let timer;
    if (matchTimer > 0) {
      timer = setTimeout(() => setMatchTimer(matchTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [matchTimer]);

  const handleMatchStart = (matchId) => {
    startMatch(matchId);
    setMatchTimer(selectedMatch.duration * 60);
  };

  const handleMatchPause = (matchId) => pauseMatch(matchId);

  const handleMatchResume = (matchId) => resumeMatch(matchId);

  const handleMatchStop = (matchId) => stopMatch(matchId);

  const handleShowCanvas = () => setShowCanvas(true);
  const handleCloseCanvas = () => setShowCanvas(false);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setCurrentTab('admin');
  };

  return (
    <div className="container">
      {/* Button to open Offcanvas */}
      <Button variant="primary" onClick={handleShowCanvas}>
        Seleccionar Vista
      </Button>

      {/* Offcanvas to switch between "Live" and "Finished" matches */}
      <Offcanvas show={showCanvas} onHide={handleCloseCanvas}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Seleccionar Vista</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Button variant="success" className="w-100 mb-2" onClick={() => { setViewMode("live"); handleCloseCanvas(); }}>
            Partidos en Vivo
          </Button>
          <Button variant="secondary" className="w-100" onClick={() => { setViewMode("finished"); handleCloseCanvas(); }}>
            Partidos Finalizados
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Tabs for List and Admin view */}
      <Tabs activeKey={currentTab} onSelect={(k) => setCurrentTab(k)} className="mt-3">
        <Tab eventKey="list" title="Lista de Partidos">
          <div className="mt-4">
            {viewMode === "live" ? (
              <>
                <h2>Partidos en Vivo</h2>
                <ul className="list-group">
                  {matches && matches.filter((match) => match.status === "NOT_STARTED").map((match) => (
                    <li key={match.id} className="list-group-item">
                      <Button variant="link" onClick={() => handleSelectMatch(match)}>
                        {match.homeTeam.name} vs {match.awayTeam.name} - {match.schedule.date}
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h2>Partidos Finalizados</h2>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Equipo Local</th>
                      <th>Equipo Visitante</th>
                      <th>Resultado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches && matches.filter((match) => match.status === "FINISHED").map((match) => (
                      <tr key={match.id}>
                        <td>{match.date}</td>
                        <td>{match.homeTeam.name}</td>
                        <td>{match.awayTeam.name}</td>
                        <td>{match.homeTeamGoals} - {match.awayTeamGoals}</td>
                        <td>
                          <Button variant="info" onClick={() => handleSelectMatch(match)}>
                            Ver Detalles
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </div>
        </Tab>

        <Tab eventKey="admin" title="Administrar Partido" disabled={!selectedMatch}>
          {selectedMatch ? (
            <div className="mt-4">
              <Card>
                <Card.Header>
                  <h3>{selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}</h3>
                </Card.Header>
                <Card.Body>
                  <p>Duración: {matchTimer} segundos restantes</p>
                  <Button variant="success" onClick={() => handleMatchStart(selectedMatch.id)}>Iniciar</Button>{' '}
                  <Button variant="warning" onClick={() => handleMatchPause(selectedMatch.id)}>Pausar</Button>{' '}
                  <Button variant="primary" onClick={() => handleMatchResume(selectedMatch.id)}>Reanudar</Button>{' '}
                  <Button variant="danger" onClick={() => handleMatchStop(selectedMatch.id)}>Detener</Button>
                </Card.Body>
              </Card>

              {/* LineUp Manager Component */}
              <LineUpManager matchId={selectedMatch.id} homeTeam={selectedMatch.homeTeam} awayTeam={selectedMatch.awayTeam} />

              <div className="mt-3">
                <h5>Selecciona Árbitro</h5>
                <select className="form-select" onChange={(e) => addRefereeToMatch(e.target.value, selectedMatch.id)}>
                  <option value="1">Árbitro 1</option>
                  <option value="2">Árbitro 2</option>
                  {/* Cargar árbitros desde la API */}
                </select>
              </div>
            </div>
          ) : (
            <p className="mt-4">Por favor, selecciona un partido de la lista para administrar.</p>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default MatchManager;
