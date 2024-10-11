import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Sponsors from "../Home Page/Sponsors";
import ComparasonsFoot from "./ComparisonsFoot";
import PoweredBy from "./PoweredBy";
import ScheduleFoot from "./ScheduleFoot";
import StandingsFoot from "./StandingsFoot";
import StatisticsFoot from "./StatisticsFoot";
import TeamsFoot from "./TeamsFoot";

import useFetchRounds from "../../hooks/useFetchRounds";
import useFetchTeams from "../../hooks/useFetchTeams";
import "./css/Footer.css";

const Footer = () => {
  // Define el estado y la función para actualizarlo correctamente
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();

  const { teams, isLoadingTeams, errorTeams } = useFetchTeams();
  const { RoundData, isLoadingRounds, errorRounds } = useFetchRounds();

  const getAllTeams = (teamId) => {
    setSelectedTeam(teamId);
  };

  return (
      <Container fluid className="footer mt-5">
        <Row className="sponsors-row pt-3 m-0">
          <Sponsors maxContributions={100} />
        </Row>

        <Row className="footer-row pt-3 m-0" >
          <Col xs={2} md={2} lg={2}>
            <TeamsFoot content={teams} getAllTeams={getAllTeams} />
          </Col>
          <Col xs={2} md={2} lg={2}>
            <ScheduleFoot />
          </Col>
          <Col xs={2} md={2} lg={2}>
            <StandingsFoot />
          </Col>
          <Col xs={2} md={2} lg={2}>
            <StatisticsFoot />
          </Col>
       
          <Col xs={2} md={2} lg={2}>
            <ComparasonsFoot />
          </Col>
        </Row>

        <Row className="powerBy-row m-0">
          <PoweredBy />
        </Row>
      </Container>
  );
};

export default Footer;
