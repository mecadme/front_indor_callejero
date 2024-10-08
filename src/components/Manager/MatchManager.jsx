import React, { useState, useEffect } from "react";
import { useGetMatches } from "../../api/Service/MatchService";
import ViewSelector from "./ViewSelector";
import LiveMatchAdmin from "./LiveMatchAdmin";
import FinishedMatchAdmin from "./FinishedMatchAdmin";

const MatchManager = () => {
  const [viewMode, setViewMode] = useState("live");

  const { data: matches, getMatches } = useGetMatches();

  useEffect(() => {
    getMatches();
  }, []);



  return (
    <div className="container">
      <ViewSelector viewMode={viewMode} setViewMode={setViewMode} />

      {viewMode === "live" && (
        <LiveMatchAdmin
          matches={matches?.filter((match) => match.status === "NOT_STARTED") || []}
        />
      )}
      {viewMode === "finished" && <FinishedMatchAdmin />}
    </div>
  );
};

export default MatchManager;
