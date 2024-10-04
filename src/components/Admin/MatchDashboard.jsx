import React, { useEffect, useState } from "react";
import { Button, Form, Table, Tab, Tabs } from "react-bootstrap";
import {
  useGetMatches,
  useCreateMatch,
  useUpdateMatch,
  useDeleteMatch,
} from "../../api/Service/MatchService";
import { useGetTeams } from "../../api/Service/TeamService"; // Hook para obtener equipos

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

  const { data: allMatches, getMatches } = useGetMatches();
  const { data: allTeams, getTeams } = useGetTeams();
  console.log("Fetched Matches:", allMatches);
  const { createMatch } = useCreateMatch();
  const { updateMatch } = useUpdateMatch();
  const { deleteMatch } = useDeleteMatch();
  console.log("Teams:", allTeams);

  useEffect(() => {
    getMatches();
    getTeams();
  }, []);
  console.log("Matches:", matches);

  useEffect(() => {
    if (allMatches) setMatches(allMatches);
  }, [allMatches]);
  console.log("Matches:", matches);

  const handleCreateMatch = async (newMatch) => {
    await createMatch(newMatch);
    getMatches();
    setActiveTab("list");
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este partido?")) {
      await deleteMatch(matchId);
      getMatches();
      setActiveTab("list");
    }
  };

  const handleEditClick = (match) => {
    setSelectedMatch(match);
    setActiveTab("edit");
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Partidos">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipo Local</th>
              <th>Equipo Visitante</th>
              <th>Fase</th>
              <th>Fecha</th>
              <th>Lugar</th>
              <th>Duración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.matchId}>
                <td>{match.matchId}</td>
                <td>{match.homeTeam?.teamName}</td>
                <td>{match.awayTeam?.teamName}</td>
                <td>{phases.find((p) => p.value === match.phase)?.label}</td>
                <td>{new Date(match.schedule.date).toLocaleDateString()}</td>
                <td>{match.schedule.place}</td>
                <td>{match.duration}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(match)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteMatch(match.matchId)}
                  >
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
          teams={allTeams}
          buttonText="Crear Partido"
        />
      </Tab>

      <Tab eventKey="edit" title="Editar Partido">
        {selectedMatch ? (
          <MatchForm
            match={selectedMatch}
            teams={allTeams}
            onSubmit={async (updatedMatch) => {
              await updateMatch(selectedMatch.matchId, updatedMatch);
              getMatches();
              setSelectedMatch(null);
              setActiveTab("list");
            }}
            buttonText="Actualizar Partido"
          />
        ) : (
          <p>Selecciona un partido para editar.</p>
        )}
      </Tab>
    </Tabs>
  );
};

const MatchForm = ({ match = {}, teams = [], onSubmit, buttonText, }) => {
  const [formData, setFormData] = useState({
    duration: match.duration || "",
    phase: match.phase || "PRELIMINARY",
    homeTeam: match.homeTeam?.teamId || "",
    awayTeam: match.awayTeam?.teamId || "",
    schedule: {
      date: match.schedule?.date?.split("T")[0] || "",
      place: match.schedule?.place || "",
    },
  });

  useEffect(() => {
    if (match && match.matchId !== formData.matchId) {
      setFormData({
        duration: match.duration || "",
        phase: match.phase || "PRELIMINARY",
        homeTeam: match.homeTeam?.teamId || "",
        awayTeam: match.awayTeam?.teamId || "",
        schedule: {
          date: match.schedule?.date?.split("T")[0] || "",
          place: match.schedule?.place || "",
        },
      });
    }
  }, [match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.duration ||
      !formData.homeTeam ||
      !formData.awayTeam ||
      !formData.schedule.date ||
      !formData.schedule.place
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (formData.homeTeam === formData.awayTeam) {
      alert("El equipo local y visitante no pueden ser el mismo.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Duración (minutos)</Form.Label>
        <Form.Control
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duración del partido"
        />
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
        <Form.Label>Equipo Local</Form.Label>
        <Form.Control
          as="select"
          name="homeTeam"
          value={formData.homeTeam}
          onChange={handleChange}
        >
          <option value="">Selecciona el equipo local</option>
          {teams
            .filter((team) => team.teamId !== formData.awayTeam)
            .map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.teamName}
              </option>
            ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Equipo Visitante</Form.Label>
        <Form.Control
          as="select"
          name="awayTeam"
          value={formData.awayTeam}
          onChange={handleChange}
        >
          <option value="">Selecciona el equipo visitante</option>
          {teams
            .filter((team) => team.teamId !== formData.homeTeam)
            .map((team) => (
              <option key={team.teamId} value={team.teamId}>
                {team.teamName}
              </option>
            ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Fecha del partido</Form.Label>
        <Form.Control
          type="date"
          name="schedule.date"
          value={formData.schedule.date}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Lugar del partido</Form.Label>
        <Form.Control
          type="text"
          name="schedule.place"
          value={formData.schedule.place}
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
