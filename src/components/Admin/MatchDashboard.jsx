import React, { useState, useEffect } from "react";
import { Button, Container, Form, Table, Tabs, Tab } from "react-bootstrap";
import {
  useGetMatches,
  useCreateMatch,
  useUpdateMatch,
  useDeleteMatch,
} from "../../api/Service/MatchService"; 
import { useGetTeams } from "../../api/Service/TeamService"; 

const phases = [
  { value: "PRELIMINARY", label: "Grupos" },
  { value: "QUARTER_FINAL", label: "Cuartos de final" },
  { value: "SEMI_FINAL", label: "Semifinales" },
  { value: "FINAL", label: "Final" },
];

const MatchDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [teams, setTeams] = useState([]);

  const { data: allMatches, getMatches } = useGetMatches();
  const { data: allTeams, getTeams } = useGetTeams();
  const { createMatch } = useCreateMatch();
  const { updateMatch } = useUpdateMatch();
  const { deleteMatch } = useDeleteMatch();

  useEffect(() => {
    getMatches(); 
    getTeams();   
  }, []);

  useEffect(() => {
    if (allMatches) setMatches(allMatches);
    if (allTeams) setTeams(allTeams);
  }, [allMatches, allTeams]);

  const handleCreateMatch = async (newMatch) => {
    await createMatch(newMatch);
    getMatches(); 
    setActiveTab("list");
  };

  const handleEditClick = (match) => {
    setSelectedMatch(match);
    setActiveTab("edit");
  };

  const handleDeleteClick = async (matchId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este partido?")) {
      await deleteMatch(matchId);
      getMatches();
    }
  };

  const getPhaseLabel = (phaseValue) => {
    const phase = phases.find(p => p.value === phaseValue);
    return phase ? phase.label : phaseValue;
  };

  return (
    <Container>
      <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
        <Tab eventKey="list" title="Lista de Partidos">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Local</th>
                <th>Visitante</th>
                <th>Fase</th>
                <th>Duración</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((match) => (
                <tr key={match.matchId}>
                  <td>{match.matchId}</td>
                  <td>{match.homeTeam.neighborhood}</td>
                  <td>{match.awayTeam.neighborhood}</td>
                  <td>{getPhaseLabel(match.phase)}</td>
                  <td>{match.duration}</td>
                  <td>{new Date(match.schedule.date).toLocaleString()}</td>
                  <td>
                    <Button onClick={() => handleEditClick(match)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteClick(match.matchId)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="create" title="Crear Partido">
          <MatchForm
            onSubmit={handleCreateMatch}
            teams={teams}
            buttonText="Crear Partido"
          />
        </Tab>

        <Tab eventKey="edit" title="Editar Partido">
          {selectedMatch ? (
            <MatchForm
              match={selectedMatch}
              onSubmit={async (updatedMatch) => {
                await updateMatch(selectedMatch.matchId, updatedMatch);
                setSelectedMatch(null);
                getMatches();
                setActiveTab("list");
              }}
              teams={teams}
              buttonText="Actualizar Partido"
            />
          ) : (
            <p>Selecciona un partido para editar.</p>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

const MatchForm = ({ match = {}, teams = [], onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({
    homeTeamId: match.homeTeam?.teamId || "",
    awayTeamId: match.awayTeam?.teamId || "",
    phase: match.phase || "PRELIMINARY",
    duration: match.duration || 40,
    date: match.schedule?.date || "",
    place: match.schedule?.place || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.homeTeamId === formData.awayTeamId) {
      alert("El equipo local y visitante no pueden ser el mismo.");
      return;
    }

    const matchPayload = {
      duration: formData.duration,
      phase: formData.phase,
      homeTeam: { teamId: formData.homeTeamId },
      awayTeam: { teamId: formData.awayTeamId },
      schedule: {
        date: formData.date,
        place: formData.place,
      },
    };

    onSubmit(matchPayload);
  };

  const filteredAwayTeams = teams.filter((team) => team.teamId !== formData.homeTeamId);
  const filteredHomeTeams = teams.filter((team) => team.teamId !== formData.awayTeamId);

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Equipo Local</Form.Label>
        <Form.Control
          as="select"
          name="homeTeamId"
          value={formData.homeTeamId}
          onChange={handleChange}
        >
          <option value="">Selecciona un equipo</option>
          {filteredHomeTeams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.neighborhood}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Equipo Visitante</Form.Label>
        <Form.Control
          as="select"
          name="awayTeamId"
          value={formData.awayTeamId}
          onChange={handleChange}
        >
          <option value="">Selecciona un equipo</option>
          {filteredAwayTeams.map((team) => (
            <option key={team.teamId} value={team.teamId}>
              {team.neighborhood}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Fase</Form.Label>
        <Form.Control
          as="select"
          name="phase"
          value={formData.phase}
          onChange={handleChange}
        >
          {phases.map((phase) => (
            <option key={phase.value} value={phase.value}>
              {phase.label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Duración (minutos)</Form.Label>
        <Form.Control
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Fecha</Form.Label>
        <Form.Control
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Lugar</Form.Label>
        <Form.Control
          type="text"
          name="place"
          value={formData.place}
          onChange={handleChange}
          placeholder="Ingresa el lugar del partido"
        />
      </Form.Group>

      <Button variant="success" type="submit">
        {buttonText}
      </Button>
    </Form>
  );
};

export default MatchDashboard;
