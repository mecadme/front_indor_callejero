import { useState, useEffect } from "react";

import Sponsors from "./Sponsors";
import Standings from "./Standings";
import WeekCoach from "./WeekCoach";
import Rounds from "./Rounds";
import WeekPlayer from "./WeekPlayer";
import WeekTeam from "./WeekTeam";
import WeekVideos from "./WeekVideos";
import RoleBased from "../Administration/RoleBased";

import useFetchRounds from "../../hooks/useFetchRounds";
import axios from "../../api/axios";

import "./css/MainContent.css";
import { Container, Row, Col, Form } from "react-bootstrap";

const MainContent = () => {
  const [currentValues, setCurrentValues] = useState({});
  const [isLoadingCurrentValues, setIsLoadingCurrentValues] = useState(true);
  const [errorCurrentValues, setErrorCurrentValues] = useState(null);

  const CURRENT_VALUES_URL = "/currentValues";
  const MIN_CONTRIBUTION = 1000;

  const fetchCurrentValues = async () => {
    try {
      setIsLoadingCurrentValues(true);

      const response = await axios.get(CURRENT_VALUES_URL);

      if (response.data) {
        console.log(response.data);
        setCurrentValues(response.data);
      } else {
        setCurrentValues({ roundDate: "2024-09-24", roundId: 3 });
      }

      setIsLoadingCurrentValues(false);
    } catch (error) {
      setErrorCurrentValues(error.message);
      setIsLoadingCurrentValues(false);
      console.log(error.message);
    }finally{
      setIsLoadingCurrentValues(false);
      setCurrentValues({ roundDate: "2024-09-24", roundId: 3 });
    }

  };

  useEffect(() => {
    fetchCurrentValues();
  }, []);

  const selectedDate = currentValues.roundDate;
  const { RoundsData, loading, error } = useFetchRounds(currentValues.roundId);

  console.log(RoundsData);

  if (loading) {
    return <div>Cargando jornada...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  return (
    <main className="mainContent">
      <Container>
        <div className="round_container">
          <Rounds RoundsData={RoundsData} />
        </div>
        <Row className="row_week">
          <Col md={4} className="week_team">
            <WeekTeam date={selectedDate} />
          </Col>
          <Col md={4} className="week_player">
            <WeekPlayer date={selectedDate} />
          </Col>
          <Col md={4} className="week_coach">
            <WeekCoach date={selectedDate} />
          </Col>
        </Row>
        <div className="sponsor_container text-center my-4">
          <Sponsors maxContributions={MIN_CONTRIBUTION} />
        </div>

        <Row className="row_standings">
          <Col md={6} className="standings">
            <Standings />
          </Col>
          <Col md={6} className="week_videos">
            <WeekVideos />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default MainContent;
