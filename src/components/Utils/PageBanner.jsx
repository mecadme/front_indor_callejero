import React from "react";
import { Row } from "react-bootstrap";

const PageBanner = ({ title }) => {
  return (
    <Row className="banner-row mb-2">
      <h2 className="text-center">{title}</h2>
    </Row>
  );
};

export default PageBanner;
