import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  Pagination,
  Tab,
  Table,
  Tabs
} from "react-bootstrap";
import {
  useCreateSponsor,
  useDeleteSponsor,
  useGetSponsors,
  useUpdateSponsor,
} from "../../api/Service/SponsorService";
import UploadPhoto from "../Utils/UploadPhoto";

const handleImageError = (e) => {
  e.target.src = "https://cdn-icons-png.flaticon.com/512/2102/2102633.png";
};

const SponsorDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [sponsors, setSponsors] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const sponsorsPerPage = 5;

  const { data: allSponsors, getSponsors } = useGetSponsors();
  const { createSponsor } = useCreateSponsor();
  const { updateSponsor } = useUpdateSponsor();
  const { deleteSponsor } = useDeleteSponsor();

  useEffect(() => {
    getSponsors();
  }, []);

  useEffect(() => {
    if (allSponsors) {
      setSponsors(allSponsors);
    }
  }, [allSponsors]);

  const indexOfLastSponsor = currentPage * sponsorsPerPage;
  const indexOfFirstSponsor = indexOfLastSponsor - sponsorsPerPage;
  const currentSponsors = sponsors.slice(
    indexOfFirstSponsor,
    indexOfLastSponsor
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreateSponsor = async (newSponsor) => {
    await createSponsor(newSponsor);
    getSponsors();
    setActiveTab("list");
  };

  const handleDeleteSponsor = async (sponsorId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este sponsor?")) {
      await deleteSponsor(sponsorId);
      getSponsors();
      setActiveTab("list");
    }
  };

  const handleEditClick = (sponsor) => {
    setSelectedSponsor(sponsor);
    setActiveTab("edit");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSponsors = sponsors.filter((sponsor) =>
    sponsor.sponsor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(sponsors.length / sponsorsPerPage);
    return (
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
    );
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Lista de Sponsors">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Foto</th>
              <th>Nombre del Sponsor</th>
              <th>Bio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentSponsors.map((sponsor) => (
              <tr key={sponsor.sponsorId}>
                <td>{sponsor.sponsorId}</td>
                <td>
                  <img
                    src={sponsor.photoUrl}
                    alt={sponsor.sponsor}
                    className="sponsor-photo"
                    width="40"
                    height="40"
                    onError={handleImageError}
                  />
                </td>
                <td>{sponsor.sponsor}</td>
                <td>{sponsor.bio}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEditClick(sponsor)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteSponsor(sponsor.sponsorId)}
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

      <Tab eventKey="create" title="Crear Sponsor">
        <SponsorForm
          onSubmit={handleCreateSponsor}
          buttonText="Crear Sponsor"
        />
      </Tab>

      <Tab eventKey="edit" title="Editar Sponsor">
        <h4>Buscar Sponsor</h4>

        <InputGroup className="mb-3">
          <FormControl
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedSponsor(null);
            }}
          />
        </InputGroup>

        {searchTerm && filteredSponsors.length > 0 && (
          <div className="sponsor-suggestions">
            {filteredSponsors.map((sponsor) => (
              <div
                key={sponsor.sponsorId}
                className="sponsor-suggestion-item"
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ccc",
                }}
                onClick={() => {
                  setSelectedSponsor(sponsor);
                  setSearchTerm(sponsor.sponsor);
                }}
              >
                {sponsor.sponsor}
              </div>
            ))}
          </div>
        )}

        {searchTerm && filteredSponsors.length === 0 && (
          <p>No se encontraron sponsors.</p>
        )}

        {selectedSponsor ? (
          <SponsorForm
            sponsor={selectedSponsor}
            onSubmit={async (updatedSponsor) => {
              await updateSponsor(selectedSponsor.sponsorId, updatedSponsor);
              setSelectedSponsor(null);
              setSearchTerm("");
              getSponsors();
              setActiveTab("list");
            }}
            buttonText="Actualizar Sponsor"
          />
        ) : (
          <p>Selecciona un sponsor para editar.</p>
        )}
      </Tab>
    </Tabs>
  );
};

const SponsorForm = ({ sponsor = {}, onSubmit, buttonText }) => {
  const isUpdating = Boolean(sponsor.sponsorId);
  const [formData, setFormData] = useState({
    sponsor: sponsor.sponsor || "",
    bio: sponsor.bio || "",
    contributionAmount: sponsor.contributionAmount || "",
    sponsorPageUrl: sponsor.sponsorPageUrl || "",
    photoUrl: sponsor.photoUrl || null,
  });

  useEffect(() => {
    if (sponsor && sponsor.sponsorId !== formData.sponsorId) {
      setFormData({
        sponsor: sponsor.sponsor || "",
        bio: sponsor.bio || "",
        contributionAmount: sponsor.contributionAmount || "",
        sponsorPageUrl: sponsor.sponsorPageUrl || "",
        photoUrl: sponsor.photoUrl || null,
      });
    }
  }, [sponsor]);

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

  const SPONSOR_KEY_VALUE = { key: "sponsor_id", value: sponsor.sponsorId };
  const SPONSOR_UPLOAD_PHOTO_URL = "sponsors/upload_photo";

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Nombre del Sponsor</Form.Label>
        <Form.Control
          type="text"
          name="sponsor"
          value={formData.sponsor}
          onChange={handleChange}
          placeholder="Ingresa el nombre del sponsor"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Ingresa una descripción"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Monto de Contribución</Form.Label>
        <Form.Control
          type="number"
          name="contributionAmount"
          value={formData.contributionAmount}
          onChange={handleChange}
          placeholder="Monto de contribución"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>URL de la página del sponsor</Form.Label>
        <Form.Control
          type="url"
          name="sponsorPageUrl"
          value={formData.sponsorPageUrl}
          onChange={handleChange}
          placeholder="URL de la página web del sponsor"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Foto</Form.Label>
        {isUpdating && sponsor.photoUrl && (
          <div className="mt-3 mb-3">
            <img
              src={sponsor.photoUrl}
              alt={sponsor.sponsor}
              className="player-photo-preview"
              onError={handleImageError}
            />
          </div>
        )}

        <UploadPhoto
          entity={SPONSOR_KEY_VALUE}
          endpointUrl={SPONSOR_UPLOAD_PHOTO_URL}
          onFileUpload={handleFileChange}
        />
      </Form.Group>

      <Button type="submit">{buttonText}</Button>
    </Form>
  );
};

export default SponsorDashboard;
