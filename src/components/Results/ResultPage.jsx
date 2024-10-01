import React from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import useFetchMatchById from "../../hooks/useFetchMatchById";
import useFetchMatchEventsById from "../../hooks/useFetchMatchEventsById";
import useFetchMatchStats from "../../hooks/useFetchMatchStats";
import EmptyData from "../Administration/EmptyData";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Loading from "../Utils/Loading";
import LineUps from "./LineUps";
import ResultBanner from "./ResultBanner";
import Timeline from "./Timeline";
import MatchOverview from "./MatchOverview";

const ResultPage = () => {
  const { matchId } = useParams();

  const { matchStats, matchLoading, matchError } = useFetchMatchStats(matchId);
  const { events, isLoading: eventsLoading, error: eventsError} = useFetchMatchEventsById(matchId);
  const { matchDetails, loading: matchDetailsLoading, error: matchDetailsError } = useFetchMatchById(matchId);

  if (eventsLoading || matchDetailsLoading || matchLoading) return <Loading />;
  if (eventsError || matchDetailsError || matchError)
    return <div>Error: {eventsError || matchDetailsError || matchError}</div>;

  if (!matchStats || !matchDetails) {
    return <EmptyData message={"No se encontraron datos del partido"} />;
  }
  console.log(matchStats, matchDetails);

  return (
    <Container fluid className="mt-0 p-0">
      <Header />
      <Container fluid className="m-0">
        <ResultBanner
          events={events}
          matchDetails={matchDetails}
          className="m-0"
        />
        <Timeline events={events} matchDetails={matchDetails} />
        <LineUps matchDetails={matchDetails} />
        <MatchOverview matchDetails={matchDetails} matchStats={matchStats} />
      </Container>
      <Footer />
    </Container>
  );
};

export default ResultPage;
