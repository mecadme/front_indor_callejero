import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Tab,
  Table,
  Tabs
} from "react-bootstrap";
import {
  useCreateCurrentValue,
  useDeleteCurrentValue,
  useGetCurrentValue,
  useUpdateCurrentValue,
} from "../../api/Service/CurrentValuesService";

const CurrentValueDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [currentValue, setCurrentValue] = useState(null); // Solo un objeto
  const [selectedCurrentValue, setSelectedCurrentValue] = useState(null);

  const { data: fetchedCurrentValue, getCurrentValue } = useGetCurrentValue(); // data es un objeto
  const { createCurrentValue } = useCreateCurrentValue();
  const { updateCurrentValue } = useUpdateCurrentValue();
  const { deleteCurrentValue } = useDeleteCurrentValue();

  useEffect(() => {
    getCurrentValue();
  }, []);

  useEffect(() => {
    if (fetchedCurrentValue) {
      setCurrentValue(fetchedCurrentValue); // Guardar el valor actual como objeto
    }
  }, [fetchedCurrentValue]);

  const handleCreateCurrentValue = async (newCurrentValue) => {
    await createCurrentValue(newCurrentValue);
    getCurrentValue();
    setActiveTab("list");
  };

  const handleDeleteCurrentValue = async (currentValueId) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este valor actual?")
    ) {
      await deleteCurrentValue(currentValueId);
      getCurrentValue();
      setActiveTab("list");
    }
  };

  const handleEditClick = () => {
    setSelectedCurrentValue(currentValue); // Solo un objeto
    setActiveTab("edit");
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Valor Actual">
        {/* Renderizar el valor actual si existe */}
        {currentValue ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Round ID</th>
                <th>Mínimo Presupuesto</th>
                <th>Fecha de la Ronda</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentValue.currentValueId}</td>
                <td>{currentValue.roundId}</td>
                <td>{currentValue.minBudget}</td>
                <td>{new Date(currentValue.roundDate).toLocaleDateString()}</td>
                <td>
                  <Button variant="primary" onClick={handleEditClick}>
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDeleteCurrentValue(currentValue.currentValueId)
                    }
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <p>No se ha encontrado ningún valor actual.</p>
        )}
      </Tab>

      <Tab eventKey="create" title="Crear Valor Actual">
        <CurrentValueForm
          onSubmit={handleCreateCurrentValue}
          buttonText="Crear Valor Actual"
        />
      </Tab>

      <Tab eventKey="edit" title="Editar Valor Actual">
        {selectedCurrentValue ? (
          <CurrentValueForm
            currentValue={selectedCurrentValue}
            onSubmit={async (updatedCurrentValue) => {
              await updateCurrentValue(
                selectedCurrentValue.currentValueId,
                updatedCurrentValue
              );
              setSelectedCurrentValue(null);
              getCurrentValue();
              setActiveTab("list");
            }}
            buttonText="Actualizar Valor Actual"
          />
        ) : (
          <p>Selecciona un valor actual para editar.</p>
        )}
      </Tab>
    </Tabs>
  );
};

const CurrentValueForm = ({ currentValue = {}, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({
    roundId: currentValue.roundId || "",
    minBudget: currentValue.minBudget || "",
    roundDate: currentValue.roundDate
      ? new Date(currentValue.roundDate).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
    if (
      currentValue &&
      currentValue.currentValueId !== formData.currentValueId
    ) {
      setFormData({
        roundId: currentValue.roundId || "",
        minBudget: currentValue.minBudget || "",
        roundDate: currentValue.roundDate
          ? new Date(currentValue.roundDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [currentValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Round ID</Form.Label>
        <Form.Control
          type="number"
          name="roundId"
          value={formData.roundId}
          onChange={handleChange}
          placeholder="Ingresa el Round ID"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Mínimo Presupuesto</Form.Label>
        <Form.Control
          type="number"
          name="minBudget"
          value={formData.minBudget}
          onChange={handleChange}
          placeholder="Ingresa el mínimo presupuesto"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Fecha de la Ronda</Form.Label>
        <Form.Control
          type="date"
          name="roundDate"
          value={formData.roundDate}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="success" type="submit">
        {buttonText}
      </Button>
    </Form>
  );
};

export default CurrentValueDashboard;
