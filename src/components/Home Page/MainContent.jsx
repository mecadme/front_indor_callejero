import Sponsors from "../Sponsors"
import Standings from "./Standings";
import WeekCoach from "./WeekCoach";
import Rounds from "./Rounds";
import WeekPlayer from "./WeekPlayer";
import WeekTeam from "./WeekTeam";
import WeekVideos from "./WeekVideos";

import "./css/MainContent.css";
import { Container, Row, Col } from "react-bootstrap";
const MainContent = () => {
  return <main className="mainContent">
    <Container>
        <div className="round_container">
            <Rounds />
        </div>
        <Row className="row_week" >
            <Col md={4} className="week_team">
                <WeekTeam />
            </Col>
            <Col md={4} className="week_player">
                <WeekPlayer />
            </Col>
            <Col md={4} className="week_coach">
                <WeekCoach />
            </Col>
        </Row>
        <div className="sponsor_container text-center my-4">
          Franja de auspicios
          <Sponsors />
        </div>

        <Row className="row_standings" >
            <Col md={6} className="standings">
                <Standings />
            </Col>
            <Col md={6} className="week_videos">
                <WeekVideos />
            </Col>
        </Row>

    </Container>
  </main>;
};

export default MainContent;
