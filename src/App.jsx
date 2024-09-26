import Admin from "./components/Admin/Admin.jsx";
import Editor from "./components/Manager/Editor.jsx";
import ForgotPassword from "./components/Authentication/ForgotPassword.jsx";
import HistoricalEvents from "./components/Header/HistoricalEvents.jsx";
import Home from "./components/Home";
import Layout from "./components/Administration/Layout.jsx";
import LinkPage from "./components/Admin/LinkPage.jsx";
import Login from "./components/Authentication/Login.jsx";
import Lounge from "./components/Manager/Lounge.jsx";
import Missing from "./components/Administration/Missing.jsx";
import PersistLogin from "./components/Authentication/PersistLogin.jsx";
import Register from "./components/Authentication/Register.jsx";
import RequiredAuth from "./components/Authentication/RequiredAuth.jsx";
import ResultPredict from "./components/Header/ResultPredict.jsx";
import Rounds from "./components/Home Page/Rounds.jsx";
import StreetProject from "./components/Header/StreetProject.jsx";
import TeamPage from "./components/Teams/TeamPage.jsx";
import TLQDS from "./components/Header/TLQDS.jsx";
import Unauthorized from "./components/Authentication/Unauthorized.jsx";
import { Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import useFetchTeams from "./hooks/useFetchTeams.jsx";
import useFetchRounds from "./hooks/useFetchRounds.jsx";

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
        {/* public routes */}
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

        {/* we want to protect these routes */}

        <Route path="/team/:teamId" element={<TeamPage teams={teams} />} />
          

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
