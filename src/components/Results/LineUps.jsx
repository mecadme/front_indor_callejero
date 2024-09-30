import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import useFetchLineUp from "../../hooks/useFetchLineUp";
import Loading from "../Utils/Loading";

import Field from "./Field";
const LineUps = ({matchDetails}) => {
    const {matchId, homeTeam, awayTeam} = matchDetails
    const {lineUp, isLoading, error} = useFetchLineUp(matchId)
    console.log(lineUp)

    if (isLoading) return <Container> <Loading/></Container>

    if (error) return <Container>Error: {error}</Container>
    

const renderLineUps = (team) => {
  return (
    <div>
      <h3>{team.name}</h3>
      <Row>
        <Col>{team.players[0]}</Col>
        <Col>{team.players[1]}</Col>
        <Col>{team.players[2]}</Col>
        <Col>{team.players[3]}</Col>
      </Row>
    </div>
  );
}    
  return (
    <Container>
      {" "}
      <Row>
        <Col>{matchId}</Col>
        <Col>
          <Field homeTeamColor={homeTeam.color} awayTeamColor={awayTeam.color} />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
};

export default LineUps;
