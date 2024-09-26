import Admin from "./components/Admin/Admin.jsx";
import Aerials from "./components/Players/Statistics/Aerials.jsx";
import Assists from "./components/Players/Statistics/Assists.jsx";
import BallsStolen from "./components/Players/Statistics/BallsStolen.jsx";
import Cards from "./components/Players/Statistics/Cards.jsx";
import Clearences from "./components/Players/Statistics/Clearences.jsx";
import Editor from "./components/Manager/Editor.jsx";
import ForgotPassword from "./components/Authentication/ForgotPassword.jsx";
import Goals from "./components/Players/Statistics/Goals.jsx";
import GoalShots from "./components/Players/Statistics/GoalShots.jsx";
import HistoricalEvents from "./components/Header/HistoricalEvents.jsx";
import Home from "./components/Home";
import Layout from "./components/Administration/Layout.jsx";
import LinkPage from "./components/Admin/LinkPage.jsx";
import Login from "./components/Authentication/Login.jsx";
import Lounge from "./components/Manager/Lounge.jsx";
import Matches from "./components/Matches/Matches.jsx";
import MinutesPlayed from "./components/Players/Statistics/MinutesPlayed.jsx";
import Missing from "./components/Administration/Missing.jsx";
import Passes from "./components/Players/Statistics/Passes.jsx";
import PersistLogin from "./components/Authentication/PersistLogin.jsx";
import Register from "./components/Authentication/Register.jsx";
import RequiredAuth from "./components/Authentication/RequiredAuth.jsx";
import ResultPredict from "./components/Header/ResultPredict.jsx";
import Rounds from "./components/Home Page/Rounds.jsx";
import Statistics from "./components/Players/Statistics.jsx";
import StreetProject from "./components/Header/StreetProject.jsx";
import Teams from "./components/Teams/Teams.jsx";
import TeamPage from "./components/Teams/TeamPage.jsx";
import TeamStandings from "./components/Teams/TeamStandings.jsx";
import TLQDS from "./components/Header/TLQDS.jsx";
import TotalShots from "./components/Players/Statistics/TotalShots.jsx";
import Unauthorized from "./components/Authentication/Unauthorized.jsx";
import UmbeatenMatches from "./components/Players/Statistics/UnbeatenMatches.jsx";
import { Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import useFetchTeams from "./hooks/useFetchTeams.jsx";
import useFetchRounds from "./hooks/useFetchRounds.jsx";
import { Card } from "react-bootstrap";

const ROLES = {
  User: "ROLE_USER",
  Editor: "ROLE_ADMIN",
  Admin: "ROLE_ADMIN",
};

function App() {
  const { teams } = useFetchTeams();
  const { RoundsData, loading, error } = useFetchRounds();
  console.log(RoundsData);

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
          <Route path="proyecto_callejero" element={<StreetProject />} />
          <Route path="todo_lo_que_debes_saber" element={<TLQDS />} />
          <Route path="palmares_historicos" element={<HistoricalEvents />} />
          <Route path="pronostico_resultados" element={<ResultPredict />} />
          <Route path="jornadas" element={<Rounds RoundsData={RoundsData} />} />
          <Route path="partidos" element={<Matches />} />
          <Route path="/team/:teamId" element={<TeamPage teams={teams} />} />
          <Route path="tablas_grupos" element={<TeamStandings />} />
          <Route path="/estadisticas" element={<Statistics />} />
          <Route path="equipos" element={<Teams />} />
          <Route path="/estadisticas" element={<Statistics />} />
          <Route path="/goleadores" element={<Goals />} />
          <Route path="/asistencias" element={<Assists />} />
          <Route path="/tarjetas" element={<Cards />} />
          <Route path="/porterias_imbatidas" element={<UmbeatenMatches />} />
          <Route path="/duelos_aereos" element={<Aerials />} />
          <Route path="/robos_balon" element={<BallsStolen />} />
          <Route path="/minutos_jugados" element={<MinutesPlayed />} />
          <Route path="/pases" element={<Passes />} />
          <Route path="/disparos_totales" element={<TotalShots />} />
          <Route path="/disparos_arco" element={<GoalShots />} />
          <Route path="/despejes" element={<Clearences />} />

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
