import React, { useContext } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth"; // Asegúrate de que la ruta sea correcta

const LogOut = () => {
  const LOGOUT_URL = "/auth/logout";
  const { auth, setAuth } = useAuth();

  const handleLogout = async () => {
    try {
      console.log("auth.token:", auth.accessToken);
      await axios.post(LOGOUT_URL, null, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`, // Incluye el token de autorización
        },
      });
      setAuth(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return <button onClick={handleLogout}>Log Out</button>;
};

export default LogOut;
