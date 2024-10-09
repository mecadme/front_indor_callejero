import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomeButton = () => {
  const home = "https://cdn-icons-png.flaticon.com/512/17821/17821825.png";
  return (
    <Button variant="primary" className="mb-1" size="xs" style={{ width: "5rem" }}>
      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
      <img src={home} alt="home-icon" className="icon-size" />
      </Link>
    </Button>
  );
};

export default HomeButton;
