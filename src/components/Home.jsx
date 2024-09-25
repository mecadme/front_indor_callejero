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
   
    </section>
  );
};

export default Home;
