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
import {
  useGetReferees,
  useCreateReferee,
  useUpdateReferee,
  useDeleteReferee,
} from "../../api/Service/RefereeService";
import { useGetMatches } from "../../api/Service/MatchService";

const RefereeDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [referees, setReferees] = useState([]);
  const [selectedReferee, setSelectedReferee] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const { data: allReferees, getReferees } = useGetReferees();
  const { data: allMatches, getMatches } = useGetMatches();
  const { createReferee } = useCreateReferee();
  const { updateReferee } = useUpdateReferee();
  const { deleteReferee } = useDeleteReferee();

  useEffect(() => {
    getReferees();
    getMatches();
  }, []);

  useEffect(() => {
    if (allReferees) setReferees(allReferees);
    if (allMatches) setMatches(allMatches);
  }, [allReferees, allMatches]);

  const handleCreateReferee = async (newReferee) => {
    await createReferee(newReferee);
    getReferees();
    setActiveTab("list");
  };

  const handleEditClick = (referee) => {
    setSelectedReferee(referee);
    setSelectedMatch(referee.match.matchId); // Seleccionamos el partido actual
    setActiveTab("edit");
  };

  const handleDeleteClick = async (refereeId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este árbitro?")) {
      await deleteReferee(refereeId);
      getReferees();
    }
  };

  return (
    <Container>
      <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
        <Tab eventKey="list" title="Lista de Árbitros">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Partido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {referees.map((referee) => (
                <tr key={referee.refereeId}>
                  <td>{referee.refereeId}</td>
                  <td>{`${referee.name} ${referee.lastName}`}</td>
                  <td>
                    {`${referee.match.homeTeam.neighborhood} vs ${referee.match.awayTeam.neighborhood}`}
                  </td>
                  <td>
                    <Button onClick={() => handleEditClick(referee)}>
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteClick(referee.refereeId)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="create" title="Crear Árbitro">
          <RefereeForm
            onSubmit={handleCreateReferee}
            matches={matches}
            selectedMatch={selectedMatch}
            setSelectedMatch={setSelectedMatch}
            buttonText="Crear Árbitro"
          />
        </Tab>

        <Tab eventKey="edit" title="Editar Árbitro">
          {selectedReferee ? (
            <RefereeForm
              referee={selectedReferee}
              onSubmit={async (updatedReferee) => {
                await updateReferee(selectedReferee.refereeId, updatedReferee);
                setSelectedReferee(null);
                getReferees();
                setActiveTab("list");
              }}
              matches={matches}
              selectedMatch={selectedMatch}
              setSelectedMatch={setSelectedMatch}
              buttonText="Actualizar Árbitro"
            />
          ) : (
            <p>Selecciona un árbitro para editar.</p>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

const RefereeForm = ({
  referee = {},
  matches = [],
  selectedMatch,
  setSelectedMatch,
  onSubmit,
  buttonText,
}) => {
  const [formData, setFormData] = useState({
    name: referee.name || "",
    lastName: referee.lastName || "",
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

    const refereePayload = {
      name: formData.name,
      lastName: formData.lastName,
      match: { matchId: selectedMatch },
    };

    onSubmit(refereePayload);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Nombre del Árbitro</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ingresa el nombre del árbitro"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Apellido del Árbitro</Form.Label>
        <Form.Control
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Ingresa el apellido del árbitro"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Selecciona el Partido</Form.Label>
        <DropdownButton
          id="dropdown-basic-button"
          title={
            selectedMatch
              ? `${
                  matches.find((m) => m.matchId === selectedMatch)?.homeTeam
                    .neighborhood
                } vs ${
                  matches.find((m) => m.matchId === selectedMatch)?.awayTeam
                    .neighborhood
                }`
              : "Selecciona un partido"
          }
        >
          {matches.map((match) => (
            <Form.Check
              key={match.matchId}
              type="radio"
              label={`${match.homeTeam.neighborhood} vs ${match.awayTeam.neighborhood}`}
              checked={selectedMatch === match.matchId}
              onChange={() => setSelectedMatch(match.matchId)}
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

export default RefereeDashboard;
