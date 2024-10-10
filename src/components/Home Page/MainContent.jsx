import { useEffect } from "react";

import { useGetCurrentValue } from "../../api/Service/CurrentValuesService";
import Rounds from "./Rounds";
import Sponsors from "./Sponsors";
import Standings from "./Standings";
import WeekCoach from "./WeekCoach";
import WeekPlayer from "./WeekPlayer";
import WeekTeam from "./WeekTeam";
import WeekVideos from "./WeekVideos";

import useFetchRounds from "../../hooks/useFetchRounds";

import { Col, Container, Row } from "react-bootstrap";
import "./css/MainContent.css";

const MainContent = () => {
  const {data: currentValues, getCurrentValue } = useGetCurrentValue();

  useEffect(() => {
    getCurrentValue();
  }, []);

  const MIN_CONTRIBUTION = currentValues?.minBudget;
  const selectedDate = currentValues?.roundDate;
  const { RoundsData, loading, error } = useFetchRounds(currentValues?.roundId);

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
            <Rounds RoundsData={RoundsData} showPagination = {false} />
          </Col>
          <Col xs={12} md={12} lg={8}>
            <Row className="row_week">
              <Row className="mb-0">
                <Col xs={12} md={7} className="text-center p-0 mt-5">
                  <h4>Equipo de la Semana</h4>
                </Col>
                <Col></Col>
              </Row>
              <Col xs={12} md={12} className="week_team m-0">
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
