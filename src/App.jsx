import Admin from "./components/Admin";
import Editor from "./components/Editor.jsx";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Layout from "./components/Layout";
import LinkPage from "./components/LinkPage";
import Login from "./components/Login";
import Lounge from "./components/Lounge";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import Register from "./components/Register";
import RequiredAuth from "./components/RequiredAuth";
import { Routes, Route } from "react-router-dom";
import PersistLogin from "./components/PersistLogin.jsx";

const ROLES = {
  User: "ROLE_USER",
  Editor: "ROLE_ADMIN",
  Admin: "ROLE_ADMIN",
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={
              <RequiredAuth
                allowedRoles={[ROLES.User, ROLES.Editor, ROLES.Admin]}
              />
            }
          >
            <Route path="/" element={<Home />} />
          </Route>

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
