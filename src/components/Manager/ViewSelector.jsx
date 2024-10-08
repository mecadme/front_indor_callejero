import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";

const ViewSelector = ({ viewMode, setViewMode }) => {
  const [showCanvas, setShowCanvas] = useState(false);

  const handleShowCanvas = () => setShowCanvas(true);
  const handleCloseCanvas = () => setShowCanvas(false);

  return (
    <>
      <Button variant="primary" onClick={handleShowCanvas}>
        Seleccionar Vista
      </Button>

      <Offcanvas show={showCanvas} onHide={handleCloseCanvas}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Seleccionar Vista</Offcanvas.Title>
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
    </>
  );
};

export default ViewSelector;
