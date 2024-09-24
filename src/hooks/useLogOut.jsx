import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogOut = () => {
  const LOGOUT_URL = "/auth/logout";
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth(null);
    try {
      await axios.get(LOGOUT_URL, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return logout;
};

export default useLogOut;
