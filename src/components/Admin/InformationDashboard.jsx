import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  Pagination,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import {
  useCreateInformation,
  useDeleteInformation,
  useGetInformation,
  useUpdateInformation,
} from "../../api/Service/Information_Service.js";

import UploadPhoto from "../Utils/UploadPhoto";

const InformationType = {
  PROJECT_STREET: "Proyecto Callejero",
  ALL_YOU_HAVE_TO_KNOW: "Todo lo que tienes que saber",
  HISTORICAL_EVENTS: "Palmares Históricos",
};
const handleImageError = (e) => {
  e.target.src = "https://cdn-icons-png.flaticon.com/512/2102/2102633.png";
};

const InformationForm = ({ information = {}, onSubmit, buttonText }) => {
  const isUpdating = Boolean(information.informationId);
  const [formData, setFormData] = useState({
    title: information.title || "",
    description: information.description || "",
    type: information.type || "",
    photoUrl: information.photoUrl || null,
  });

  useEffect(() => {
    if (information && information.informationId !== formData.informationId) {
      setFormData({
        title: information.title || "",
        description: information.description || "",
        type: information.type || "",
        photoUrl: information.photoUrl || null,
      });
    }
  }, [information]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (photoUrl) => {
    setFormData((prevState) => ({
      ...prevState,
      photoUrl,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Título</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ingresa el título"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Ingresa una descripción"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Tipo</Form.Label>
        <Form.Control
          as="select"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="">Seleccione el tipo</option>
          {Object.entries(InformationType).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Foto</Form.Label>
        {isUpdating && information.photoUrl && (
          <div className="mt-3 mb-3">
            <img
              src={information.photoUrl}
              alt={information.title}
              className="info-photo-preview"
              onError={handleImageError}
            />
          </div>
        )}

        <UploadPhoto
          entity={{ key: "information_id", value: information.informationId }}
          endpointUrl="information/upload_photo"
          onFileUpload={handleFileChange}
        />
      </Form.Group>

      <Button type="submit">{buttonText}</Button>
    </Form>
  );
};

const InformationDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [informationList, setInformationList] = useState([]);
  const [selectedInformation, setSelectedInformation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: allInformation, getInformation } = useGetInformation();
  const { createInformation } = useCreateInformation();
  const { updateInformation } = useUpdateInformation();
  const { deleteInformation } = useDeleteInformation();

  useEffect(() => {
    getInformation();
  }, []);

  useEffect(() => {
    if (allInformation) {
      setInformationList(allInformation);
    }
  }, [allInformation]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = informationList.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreateInformation = async (newInfo) => {
    await createInformation(newInfo);
    getInformation();
    setActiveTab("list");
  };

  const handleDeleteInformation = async (informationId) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta información?")
    ) {
      await deleteInformation(informationId);
      getInformation();
      setActiveTab("list");
    }
  };

  const handleEditClick = (information) => {
    setSelectedInformation(information);
    setActiveTab("edit");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedInformation(null);
  };

  const filteredInformation = informationList.filter((info) =>
    info.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(informationList.length / itemsPerPage);
    return totalPages > 1 ? (
      <Pagination>
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => paginate(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    ) : null;
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Lista de Información">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Foto</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((info) => (
              <tr key={info.informationId}>
                <td>{info.informationId}</td>
                <td>
                  <img
                    src={info.photoUrl}
                    alt={info.title}
                    className="info-photo"
                    width="40"
                    height="40"
                    onError={handleImageError}
                  />
                </td>
                <td>{info.title}</td>
                <td>{info.description}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(info)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteInformation(info.informationId)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {renderPagination()}
      </Tab>

      <Tab eventKey="create" title="Crear Información">
        <InformationForm
          onSubmit={handleCreateInformation}
          buttonText="Crear Información"
        />
      </Tab>

      <Tab eventKey="edit" title="Editar Información">
        <h4>Buscar Información</h4>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por título..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </InputGroup>

        {searchTerm && filteredInformation.length > 0 && (
          <div className="info-suggestions">
            {filteredInformation.map((info) => (
              <div
                key={info.informationId}
                className="info-suggestion-item"
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                }}
                onClick={() => {
                  setSelectedInformation(info);
                  setSearchTerm(info.title);
                }}
              >
                {info.title}
              </div>
            ))}
          </div>
        )}

        {searchTerm && filteredInformation.length === 0 && (
          <p>No se encontró información.</p>
        )}

        {selectedInformation ? (
          <InformationForm
            information={selectedInformation}
            onSubmit={async (updatedInfo) => {
              await updateInformation(
                selectedInformation.informationId,
                updatedInfo
              );
              setSelectedInformation(null);
              setSearchTerm("");
              getInformation();
              setActiveTab("list");
            }}
            buttonText="Actualizar Información"
          />
        ) : (
          <p>Selecciona una información para editar.</p>
        )}
      </Tab>
    </Tabs>
  );
};

export default InformationDashboard;
