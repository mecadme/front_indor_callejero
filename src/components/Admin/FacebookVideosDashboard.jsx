import React, { useEffect, useState } from "react";
import { Button, Form, Tab, Table, Tabs } from "react-bootstrap";
import {
  useGetFacebookVideos,
  useCreateFacebookVideo,
  useUpdateFacebookVideo,
  useDeleteFacebookVideo,
} from "../../api/Service/FacebookVideosService";

const FacebookVideosDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [facebookVideos, setFacebookVideos] = useState([]);
  const [selectedFacebookVideo, setSelectedFacebookVideo] = useState(null);

  const { data: fetchedFacebookVideos, getFacebookVideos } = useGetFacebookVideos();
  const { createFacebookVideo } = useCreateFacebookVideo();
  const { updateFacebookVideo } = useUpdateFacebookVideo();
  const { deleteFacebookVideo } = useDeleteFacebookVideo();

  useEffect(() => {
    getFacebookVideos();
  }, []);

  useEffect(() => {
    if (fetchedFacebookVideos) {
      setFacebookVideos(fetchedFacebookVideos);
    }
  }, [fetchedFacebookVideos]);

  const handleCreateFacebookVideo = async (newFacebookVideo) => {
    await createFacebookVideo(newFacebookVideo);
    getFacebookVideos();
    setActiveTab("list");
  };

  const handleDeleteFacebookVideo = async (facebookVideoId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este video?")) {
      await deleteFacebookVideo(facebookVideoId);
      getFacebookVideos();
      setActiveTab("list");
    }
  };

  const handleEditClick = (video) => {
    setSelectedFacebookVideo(video);
    setActiveTab("edit");
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(tab) => setActiveTab(tab)}
      className="mb-3"
    >
      <Tab eventKey="list" title="Lista de Videos de Facebook">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>URL</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {facebookVideos.length > 0 ? (
              facebookVideos.map((video) => (
                <tr key={video.facebookVideoId}>
                  <td>{video.facebookVideoId}</td>
                  <td>{video.videoUrl}</td>
                  <td>{video.videoTitle}</td>
                  <td>{video.videoDescription}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleEditClick(video)}>
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteFacebookVideo(video.facebookVideoId)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No se encontraron videos.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Tab>

      <Tab eventKey="create" title="Crear Nuevo Video">
        <FacebookVideoForm
          onSubmit={handleCreateFacebookVideo}
          buttonText="Crear Video"
        />
      </Tab>

      <Tab eventKey="edit" title="Editar Video">
        {selectedFacebookVideo ? (
          <FacebookVideoForm
            facebookVideo={selectedFacebookVideo}
            onSubmit={async (updatedFacebookVideo) => {
              await updateFacebookVideo(selectedFacebookVideo.facebookVideoId, updatedFacebookVideo);
              setSelectedFacebookVideo(null);
              getFacebookVideos();
              setActiveTab("list");
            }}
            buttonText="Actualizar Video"
          />
        ) : (
          <p>Selecciona un video para editar.</p>
        )}
      </Tab>
    </Tabs>
  );
};

const FacebookVideoForm = ({ facebookVideo = {}, onSubmit, buttonText }) => {
  const [formData, setFormData] = useState({
    videoUrl: facebookVideo.videoUrl || "",
    videoTitle: facebookVideo.videoTitle || "",
    videoDescription: facebookVideo.videoDescription || "",
  });

  useEffect(() => {
    if (facebookVideo && facebookVideo.facebookVideoId !== formData.facebookVideoId) {
      setFormData({
        videoUrl: facebookVideo.videoUrl || "",
        videoTitle: facebookVideo.videoTitle || "",
        videoDescription: facebookVideo.videoDescription || "",
      });
    }
  }, [facebookVideo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.videoUrl || !formData.videoTitle || !formData.videoDescription) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>URL del Video</Form.Label>
        <Form.Control
          type="text"
          name="videoUrl"
          value={formData.videoUrl}
          onChange={handleChange}
          placeholder="Ingresa la URL del video"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Título del Video</Form.Label>
        <Form.Control
          type="text"
          name="videoTitle"
          value={formData.videoTitle}
          onChange={handleChange}
          placeholder="Ingresa el título del video"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Descripción del Video</Form.Label>
        <Form.Control
          as="textarea"
          name="videoDescription"
          value={formData.videoDescription}
          onChange={handleChange}
          placeholder="Ingresa la descripción del video"
        />
      </Form.Group>

      <Button variant="success" type="submit">
        {buttonText}
      </Button>
    </Form>
  );
};

export default FacebookVideosDashboard;
