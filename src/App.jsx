import { Route, Routes } from "react-router-dom";
import Admin from "./components/Admin/Admin.jsx";
import LinkPage from "./components/Admin/LinkPage.jsx";
import Layout from "./components/Administration/Layout.jsx";
import Missing from "./components/Administration/Missing.jsx";
import ForgotPassword from "./components/Authentication/ForgotPassword.jsx";
import Login from "./components/Authentication/Login.jsx";
import PersistLogin from "./components/Authentication/PersistLogin.jsx";
import Register from "./components/Authentication/Register.jsx";
import RequiredAuth from "./components/Authentication/RequiredAuth.jsx";
import Unauthorized from "./components/Authentication/Unauthorized.jsx";
import HistoricalEvents from "./components/Header/HistoricalEvents.jsx";
import ResultPredict from "./components/Header/ResultPredict.jsx";
import StreetProject from "./components/Header/StreetProject.jsx";
import TLQDS from "./components/Header/TLQDS.jsx";
import Home from "./components/Home";
import Editor from "./components/Manager/Editor.jsx";
import Lounge from "./components/Manager/Lounge.jsx";
import Matches from "./components/Matches/Matches.jsx";
import PlayerPage from "./components/Players/PlayerPage.jsx";
import Statistics from "./components/Players/Statistics.jsx";
import Cards from "./components/Players/Statistics/Cards.jsx";
import FullStatistics from "./components/Players/Statistics/FullStats.jsx";
import MinutesPlayed from "./components/Players/Statistics/MinutesPlayed.jsx";
import RoundsPage from "./components/Matches/RoundsPage.jsx";
import TeamPage from "./components/Teams/TeamPage.jsx";
import Teams from "./components/Teams/Teams.jsx";
import TeamStandings from "./components/Teams/TeamStandings.jsx";
import ResultPage from "./components/Results/ResultPage.jsx"; 

import "bootstrap/dist/css/bootstrap.min.css";

import useFetchTeams from "./hooks/useFetchTeams.jsx";

const ROLES = {
  User: "ROLE_USER",
  Editor: "ROLE_ADMIN",
  Admin: "ROLE_ADMIN",
};

function App() {
  const { teams } = useFetchTeams();
  

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route element={<PersistLogin />}>
          <Route path="/" element={<Home />} />
          <Route path="linkpage" element={<LinkPage />} />
          <Route path="street_project" element={<StreetProject />} />
          <Route path="all_you_need_to_know" element={<TLQDS />} />
          <Route path="historical_events" element={<HistoricalEvents />} />
          <Route path="predict_result" element={<ResultPredict />} />
          <Route path="rounds" element={<RoundsPage/>} />
          <Route path="matches" element={<Matches />} />
          <Route path="/team/:teamId" element={<TeamPage teams={teams} />} />
          <Route path="/player/:playerId" element={<PlayerPage />} />
          <Route path="/result/:matchId" element={<ResultPage />} />
          <Route path="group_standings" element={<TeamStandings />} />
          <Route path="/:eventType" element={<FullStatistics />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/card" element={<Cards />} />
          <Route path="/minutes_played" element={<MinutesPlayed />} />

          <Route element={<RequiredAuth allowedRoles={[ROLES.Editor]} />}>
            <Route path="editor" element={<Editor />} />
          </Route>

          <Route element={<RequiredAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>

          <Route
            element={
              <RequiredAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />
            }
          >
            <Route path="lounge" element={<Lounge />} />
          </Route>
        </Route>

        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
