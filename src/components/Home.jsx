import { useNavigate, Link } from "react-router-dom";

import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import MainContent from "./Home Page/MainContent";

import useLogOut from "../hooks/useLogOut";

const Home = () => {
  const navigate = useNavigate();

  const logOut = useLogOut();

  const SingOut = async () => {
    await logOut();
    navigate("/linkpage");
  };

  return (
    <section>
      <Header />
      <MainContent />
      <Footer />
      <br />
      <p>You are logged in!</p>
      <br />
      <Link to="/editor">Go to the Editor page</Link>
      <br />
      <Link to="/admin">Go to the Admin page</Link>
      <br />
      <Link to="/lounge">Go to the Lounge</Link>
      <br />
      <Link to="/linkpage">Go to the link page</Link>
      <div className="flexGrow">
        <button onClick={SingOut}>Cerrar Sesión</button>
      </div>
    </section>
  );
};

export default Home;
