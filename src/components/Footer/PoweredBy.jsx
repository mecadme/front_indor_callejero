import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import nelasmi from "../../assets/nelasmi.png";
import ipsum from "../../assets/ipsum.png";
import "./css/PoweredBy.css";

const PoweredBy = () => {
  return (
    <Container fluid className="powered-by m-0">
      <Row>
        <h3>Powered By</h3>
        
        </Row>
      <Row>
        <Col>
          <img src={ipsum} alt="imagen" className="ipsum-logo"
          onClick={() => window.open("https://ipsumsolutio.com/", "_blank")} />
        </Col>
        <Col>
          <img src={nelasmi} alt="imagen" className="nelasmi-logo"
          onClick={() => window.open("https://github.com/mecadme", "_blank")} />
        </Col>
      </Row>
    </Container>
  );
};

export default PoweredBy;
