import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useGetMatches } from "../../api/Service/MatchService";
import FinishedMatchAdmin from "./FinishedMatchAdmin";
import LiveMatchAdmin from "./LiveMatchAdmin";
import ViewSelector from "./ViewSelector";
import HomeButton from "../Utils/HomeButton";

const MatchManager = () => {
  const [viewMode, setViewMode] = useState("live");

  const { data: matches, getMatches } = useGetMatches();

  useEffect(() => {
    getMatches();
  }, []);



  return (
    <Container className="container">

      <HomeButton />
      
      <ViewSelector viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === "live" && (
        <LiveMatchAdmin
          matches={matches?.filter((match) => match.status === "NOT_STARTED") || []}
        />
      )}
      {viewMode === "finished" && <FinishedMatchAdmin />}
    </Container>
  );
};

export default MatchManager;
