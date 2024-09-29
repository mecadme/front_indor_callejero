import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

import ComparasonsFoot from "./ComparisonsFoot";
import PoweredBy from "./PoweredBy";
import PredictionsFoot from "./PredictionsFoot";
import ScheduleFoot from "./ScheduleFoot";
import Sponsors from "../Home Page/Sponsors";
import StandingsFoot from "./StandingsFoot";
import StatisticsFoot from "./StatisticsFoot";
import TeamsFoot from "./TeamsFoot";

import useFetchTeams from "../../hooks/useFetchTeams";
import useFetchRounds from "../../hooks/useFetchRounds";

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
      <Container fluid className="mt-5">
        <Row>
          <Sponsors maxContributions={100} />
        </Row>

        <Row>
          <Col>
            <TeamsFoot content={teams} getAllTeams={getAllTeams} />
          </Col>
          <Col>
            <ScheduleFoot />
          </Col>
          <Col>
            <StandingsFoot />
          </Col>
          <Col>
            <StatisticsFoot />
          </Col>
          <Col>
            <PredictionsFoot />
          </Col>
          <Col>
            <ComparasonsFoot />
          </Col>
        </Row>

        <Row>
          <PoweredBy />
        </Row>
      </Container>
  );
};

export default Footer;
