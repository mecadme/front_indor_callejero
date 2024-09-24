import Admin from "./components/Admin";
import Editor from "./components/Editor.jsx";
import ForgotPassword from "./components/ForgotPassword";
import HistoricalEvents from "./components/Header/HistoricalEvents.jsx";
import Home from "./components/Home";
import Layout from "./components/Layout";
import LinkPage from "./components/LinkPage";
import Login from "./components/Login";
import Lounge from "./components/Lounge";
import Missing from "./components/Missing";
import PersistLogin from "./components/PersistLogin.jsx";
import Register from "./components/Register";
import RequiredAuth from "./components/RequiredAuth";
import ResultPredict from "./components/Header/ResultPredict.jsx";
import StreetProject from "./components/Header/StreetProject.jsx";
import TeamPage from "./components/TeamPage.jsx";
import TLQDS from "./components/Header/TLQDS.jsx";
import Unauthorized from "./components/Unauthorized";
import { Routes, Route } from "react-router-dom";

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
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="proyecto_callejero" element={<StreetProject />} />
        <Route path="todo_lo_que_debes_saber" element={<TLQDS />} />
        <Route path="palmares_historicos" element={<HistoricalEvents />} />
        <Route path="pronostico_resultados" element={<ResultPredict />} />

        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>

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
