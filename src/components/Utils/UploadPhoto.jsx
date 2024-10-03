import React, { useState } from 'react';
import { Form, Button, Col, Row, Image } from 'react-bootstrap';
import useUploadPhoto from '../../hooks/useUploadPhoto';  // Importamos el hook

const UploadPhoto = ({ entity, endpointUrl }) => {
  const { uploadPhoto, loading, error, uploadSuccess } = useUploadPhoto(entity, endpointUrl);
  console.log(entity.value)
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  return (
    entity.value &&(<Form className="p-3 border rounded shadow-sm">
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label className="font-weight-bold">Sube una foto</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
      </Form.Group>

      {previewUrl && (
        <Row className="mb-3">
          <Col xs={12} md={6} className="mx-auto text-center">
            <Image src={previewUrl} rounded fluid alt="Vista previa" />
            <Button variant="danger" className="mt-2" onClick={handleRemovePhoto}>
              Eliminar
            </Button>
          </Col>
        </Row>
      )}

      {loading && <p>Cargando...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {uploadSuccess && <p className="text-success">Foto subida con éxito: {uploadSuccess}</p>}

      <Button variant="primary" type="button" onClick={handleUpload} disabled={!selectedFile || loading}>
        {loading ? "Subiendo..." : "Subir foto"}
      </Button>
    </Form>) || <Row>Por favor crear primero la entidad para subir la foto</Row>
  );
};

export default UploadPhoto;
