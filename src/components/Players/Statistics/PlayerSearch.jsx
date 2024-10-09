import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const PlayerSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);  // Pasar el término de búsqueda al componente principal
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row className="justify-content-center">
        <Col xs={8} md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar jugador por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col xs={4} md={2}>
          <Button type="submit" variant="primary">
            Buscar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PlayerSearch;
