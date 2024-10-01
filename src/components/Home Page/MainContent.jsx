import { useEffect, useState } from "react";

import Rounds from "./Rounds";
import Sponsors from "./Sponsors";
import Standings from "./Standings";
import WeekCoach from "./WeekCoach";
import WeekPlayer from "./WeekPlayer";
import WeekTeam from "./WeekTeam";
import WeekVideos from "./WeekVideos";

import axios from "../../api/axios";
import useFetchRounds from "../../hooks/useFetchRounds";

import { Col, Container, Row } from "react-bootstrap";
import "./css/MainContent.css";

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
        setCurrentValues(response.data);
      } else {
        setCurrentValues({ roundDate: "2024-09-24", roundId: 3 });
      }

      setIsLoadingCurrentValues(false);
    } catch (error) {
      setErrorCurrentValues(error.message);
      setIsLoadingCurrentValues(false);
      console.log(error.message);
    } finally {
      setIsLoadingCurrentValues(false);
      setCurrentValues({ roundDate: "2024-09-24", roundId: 5 });
    }
  };

  useEffect(() => {
    fetchCurrentValues();
  }, []);

  const selectedDate = currentValues.roundDate;
  const { RoundsData, loading, error } = useFetchRounds(currentValues.roundId);


  if (loading) {
    return <div>Cargando jornada...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  return (
    <main className="mainContent">
      <Container className="m-4" fluid>
        <Row>
          <Col xs={12} md={12} lg={4}>
            <Rounds RoundsData={RoundsData} />
          </Col>
          <Col xs={12} md={12} lg={8}>
            <Row className="row_week">
              <Row className="mb-0">
                <Col xs={12} md={7} className="text-center p-0 m-0">
                  <h4>Equipo de la Semana</h4>
                </Col>
                <Col></Col>
              </Row>
              <Col xs={12} md={12} className="week_team">
                <WeekTeam date={selectedDate} />
              </Col>
              <Col>
                <Row className="row_player m-4">
                  <WeekPlayer date={selectedDate} />
                </Row>
                <Row className="row_coach m-4">
                  <WeekCoach date={selectedDate} />
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="sponsor_container text-center my-4">
          <Sponsors maxContributions={MIN_CONTRIBUTION} />
        </Row>

        <Row className="row_standings">
          <Col xs={7} md={4} lg={3} className="standings">
            <Standings />
          </Col>
          <Col xs={11} md={8} lg={9} className="week_videos">
            <WeekVideos />
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default MainContent;
