import React from "react";
import { Alert, Container } from "react-bootstrap";

const EmptyData = ({ message }) => {
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ height: "30rem", textAlign: "center", maxWidth: "4rem" }}
    >
      <Alert
        variant="info"
        style={{
          fontSize: "1.25rem",
          width: "80%",
          height: "60%",
          padding: "1.5rem",
          position: "absolute",
          top: "50%",
          transform: "translateY(-35%)",
        }}
      >
        <h3>¡Anima a tu barrio!</h3>

        <p>
          {message}
          <br />
          ¡Tu apoyo puede hacer la diferencia en el próximo partido! <br />
        </p>
        <div className="mt-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/10368/10368405.png"
            alt="Motivate"
            style={{
              width: "5rem",
              margin: "1rem auto",
              display: "block",
            }}
          />
        </div>
        <p> Juntos, ¡podemos lograr grandes cosas! </p>
      </Alert>
    </Container>
  );
};

export default EmptyData;
