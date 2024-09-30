import React from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Timeline from "./Timeline";
import useFetchMatchStats from "../../hooks/useFetchMatchStats";
import useFetchMatchById from "../../hooks/useFetchMatchById";
import useFetchMatchEventsById from "../../hooks/useFetchMatchEventsById";
import Loading from "../Utils/Loading";
import EmptyData from "../Administration/EmptyData";
import ResultBanner from "./ResultBanner";

const ResultPage = () => {
  const { matchId } = useParams();

  const { matchStats, matchLoading, matchError } = useFetchMatchStats(matchId);
  const {
    events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useFetchMatchEventsById(matchId);
  const {
    matchDetails,
    loading: matchDetailsLoading,
    error: matchDetailsError,
  } = useFetchMatchById(matchId);

  if (eventsLoading || matchDetailsLoading || matchLoading) return <Loading />; 
  if (eventsError || matchDetailsError || matchError)
    return <div>Error: {eventsError || matchDetailsError || matchError}</div>;

  if (!matchStats || !matchDetails) {
    return <EmptyData message={"No se encontraron datos del partido"} />;
  }

  return (
    <Container fluid className="mt-0 p-0">
      <Header />
      <Container fluid className="m-0">
        <ResultBanner events={events} matchDetails={matchDetails} />
        <Timeline events={events} matchDetails={matchDetails} />
      </Container>
      <Footer />
    </Container>
  );
};

export default ResultPage;
