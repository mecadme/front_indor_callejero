import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import "./css/PlayerSearch.css"; 

const PlayerSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchIcon = "https://cdn-icons-png.flaticon.com/512/751/751463.png";

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <Form className="player-search  mb-4">
      <Row className="justify-content-center">
        <Col xs={8} md={6}>
          <div style={{ position: "relative" }}>
            <img
              src={searchIcon}
              alt="Search Icon"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "1.5rem",
                height: "1.5rem",
              }}
            />
            <Form.Control
              className="player-form-control"
              type="text"
              placeholder="Buscar jugador"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ paddingLeft: "40px",
                backgroundColor: "#33173c89",
               }} // Espacio para el ícono
            />
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default PlayerSearch;
