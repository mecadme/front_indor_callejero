import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  DropdownButton,
  Form,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import { useGetMatches } from "../../api/Service/MatchService";
import {
  useCreateRound,
  useDeleteRound,
  useGetRounds,
  useUpdateRound,
} from "../../api/Service/RoundService";

const RoundDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);

  const { data: allRounds, getRounds } = useGetRounds();
  const { data: allMatches, getMatches } = useGetMatches();
  const { createRound } = useCreateRound();
  const { updateRound } = useUpdateRound();
  const { deleteRound } = useDeleteRound();

  useEffect(() => {
    getRounds();
    getMatches();
  }, []);

  useEffect(() => {
    if (allRounds) setRounds(allRounds);
    if (allMatches) setMatches(allMatches);
  }, [allRounds, allMatches]);

  const handleCreateRound = async (newRound) => {
    await createRound(newRound);
    getRounds();
    setActiveTab("list");
  };

  const handleEditClick = (round) => {
    setSelectedRound(round);
    setSelectedMatches(round.matches.map((match) => match.matchId));
    setActiveTab("edit");
  };

  const handleDeleteClick = async (roundId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta jornada?")) {
      await deleteRound(roundId);
      getRounds();
    }
  };

  return (
    <Container>
      <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
        <Tab eventKey="list" title="Lista de Jornadas">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Partidos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((round) => (
                <tr key={round.roundId}>
                  <td>{round.roundId}</td>
                  <td>{round.name}</td>
                  <td>
                    {round.matches.map((match) => (
                      <div key={match.matchId}>
                        {match.homeTeam.neighborhood} vs{" "}
                        {match.awayTeam.neighborhood}
                      </div>
                    ))}
                  </td>
                  <td>
                    <Button onClick={() => handleEditClick(round)}>
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(round.roundId)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="create" title="Crear Jornada">
          <RoundForm
            onSubmit={handleCreateRound}
            matches={matches}
            selectedMatches={selectedMatches}
            setSelectedMatches={setSelectedMatches}
            buttonText="Crear Jornada"
          />
        </Tab>

        <Tab eventKey="edit" title="Editar Jornada">
          {selectedRound ? (
            <RoundForm
              round={selectedRound}
              onSubmit={async (updatedRound) => {
                await updateRound(selectedRound.roundId, updatedRound);
                setSelectedRound(null);
                getRounds();
                setActiveTab("list");
              }}
              matches={matches}
              selectedMatches={selectedMatches}
              setSelectedMatches={setSelectedMatches}
              buttonText="Actualizar Jornada"
            />
          ) : (
            <p>Selecciona una jornada para editar.</p>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

const RoundForm = ({
  round = {},
  matches = [],
  selectedMatches,
  setSelectedMatches,
  onSubmit,
  buttonText,
}) => {
  const [formData, setFormData] = useState({
    name: round.name || "",
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

    const roundPayload = {
      name: formData.name,
      matches: selectedMatches.map((id) => ({ matchId: id })),
    };

    onSubmit(roundPayload);
  };

  const getSelectedMatchLabels = () =>
    selectedMatches
      .map((id) => {
        const match = matches.find((m) => m.matchId === id);
        return match
          ? `${match.homeTeam.neighborhood} vs ${match.awayTeam.neighborhood}`
          : "Unknown Match";
      })
      .join(", ");
  const handleMatchSelection = (matchId) => {
    setSelectedMatches((prev) =>
      prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId]
    );
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Nombre de la Jornada</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ingresa el nombre de la jornada"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Selecciona los partidos</Form.Label>
        <DropdownButton
          id="dropdown-basic-button"
          title={
            selectedMatches.length
              ? getSelectedMatchLabels()
              : "Selecciona partidos"
          }
        >
          {matches.map((match) => (
            <Form.Check
              key={match.matchId}
              type="checkbox"
              label={`${match.homeTeam.neighborhood} vs ${match.awayTeam.neighborhood}`}
              checked={selectedMatches.includes(match.matchId)}
              onChange={() => handleMatchSelection(match.matchId)}
            />
          ))}
        </DropdownButton>
      </Form.Group>

      <Button variant="success" type="submit">
        {buttonText}
      </Button>
    </Form>
  );
};

export default RoundDashboard;
