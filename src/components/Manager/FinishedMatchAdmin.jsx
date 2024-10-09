import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { useGetAllResults } from "../../api/Service/ResultService";
import Loading from "../Utils/Loading";
import 'bootstrap/dist/css/bootstrap.min.css';
import MatchEvents from "./MatchEvents";

const FinishedMatchAdmin = () => {
  const { data: results, loading: loadingResults, error: errorResults, getAllResults } = useGetAllResults();
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [activeTab, setActiveTab] = useState("matches");

  useEffect(() => {
    getAllResults();
  }, []);

  if (loadingResults) return <Loading />;
  if (errorResults) return <p className="alert alert-danger">Error al cargar los partidos: {errorResults.message}</p>;

  
  const finishedMatches = results?.map((result) => ({
    ...result.match,
    homeTeamGoals: result.goalsHomeTeam,
    awayTeamGoals: result.goalsAwayTeam,
  })) || [];

  const handleEventClick = (matchId) => {
    setSelectedMatchId(matchId); 
    setActiveTab("events"); 
  };

  return (
    <div className="container mt-4 finished-match-admin">
      <h2 className="mb-4">Partidos Finalizados</h2>
      <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} className="mb-3">
        <Tab eventKey="matches" title="Partidos">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>Id</th>
                <th>Fecha</th>
                <th>Equipos</th>
                <th>Resultado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {finishedMatches.length > 0 ? (
                finishedMatches.map((match) => (
                  <tr key={match.matchId}>
                    <td>{match.matchId}</td>
                    <td>{new Date(match.schedule.date).toLocaleDateString()}</td>
                    <td>{match.homeTeam.name} vs {match.awayTeam.name}</td>
                    <td>{match.homeTeamGoals} - {match.awayTeamGoals}</td>
                    <td>
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleEventClick(match.matchId)}
                      >
                        Agregar Eventos
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No hay partidos finalizados disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Tab>
        <Tab eventKey="events" title="Eventos">
          {selectedMatchId ? (
            <div className="mt-4">
              <h3>Eventos del Partido</h3>
              <MatchEvents matchId={selectedMatchId} />
            </div>
          ) : (
            <p className="text-center mt-4">Seleccione un partido para ver los eventos.</p>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default FinishedMatchAdmin;
