import { useNavigate, Link } from "react-router-dom";
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
      <h1>Home</h1>
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
