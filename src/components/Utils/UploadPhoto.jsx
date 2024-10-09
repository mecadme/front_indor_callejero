import React, { useState } from "react";
import { Form, Button, Col, Row, Image, Container, Modal } from "react-bootstrap";
import useUploadPhoto from "../../hooks/useUploadPhoto"; // Importamos el hook

const UploadPhoto = ({ entity, endpointUrl }) => {
  const { uploadPhoto, loading, error, uploadSuccess } = useUploadPhoto(
    entity,
    endpointUrl
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false); // Estado para manejar el modal

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadPhoto(selectedFile);
    }
  };

  const handleModalClose = () => setShowModal(false); // Cerrar modal
  const handleModalShow = () => setShowModal(true);   // Mostrar modal

  return (
    (entity.value && (
      <Container>
        <Button variant="primary" onClick={handleModalShow} className="mb-3">
          Cambiar Foto
        </Button>

        {/* Modal de Bootstrap */}
        <Modal show={showModal} onHide={handleModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cargar nueva foto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="p-3">
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label className="font-weight-bold">Selecciona una foto</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>

              {previewUrl && (
                <Row className="mb-3">
                  <Col xs={12} md={6} className="mx-auto text-center">
                    <Image src={previewUrl} rounded fluid alt="Vista previa" />
                    <Button
                      variant="danger"
                      className="mt-2"
                      onClick={handleRemovePhoto}
                    >
                      Eliminar
                    </Button>
                  </Col>
                </Row>
              )}

              {loading && <p>Cargando...</p>}
              {error && <p className="text-danger">Error: {error}</p>}
              {uploadSuccess && (
                <p className="text-success">
                  Foto subida con éxito: {uploadSuccess}
                </p>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleUpload();
                handleModalClose();
              }}
              disabled={!selectedFile || loading}
            >
              {loading ? "Actualizando..." : "Subir Foto"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    )) || <Row>Por favor crear primero la entidad para subir la foto</Row>
  );
};

export default UploadPhoto;
