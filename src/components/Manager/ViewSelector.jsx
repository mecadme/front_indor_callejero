import React, { useState } from "react";
import { Button, Offcanvas, Row, Col } from "react-bootstrap";

const ViewSelector = ({ viewMode, setViewMode }) => {
  const [showCanvas, setShowCanvas] = useState(false);

  const handleShowCanvas = () => setShowCanvas(true);
  const handleCloseCanvas = () => setShowCanvas(false);

  return (
    <Row>
      <Col xs={1}>
      <Button variant="primary" onClick={handleShowCanvas}>
      ☰
      </Button>
      </Col>
      <Col>

      <Offcanvas show={showCanvas} onHide={handleCloseCanvas}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Partidos</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Button
            variant="success"
            className="w-100 mb-2"
            onClick={() => {
              setViewMode("live");
              handleCloseCanvas();
            }}
          >
            Partidos en Vivo
          </Button>
          <Button
            variant="secondary"
            className="w-100"
            onClick={() => {
              setViewMode("finished");
              handleCloseCanvas();
            }}
          >
            Partidos Finalizados
          </Button>
        </Offcanvas.Body>
      </Offcanvas>

      </Col>
    </Row>
  );
};

export default ViewSelector;
