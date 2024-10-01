import axios from "../api/axios";
import useAuth from "./useAuth";
import { jwtDecode } from "jwt-decode";

const useRefreshToken = () => {
  const REFRESH_URL = "auth/refresh";
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get(REFRESH_URL, {
      withCredentials: true,
    });

    const decodedToken = jwtDecode(response.data.accessToken);
    const userRoles = decodedToken?.authorities
        ? decodedToken.authorities.split(",")
        : [];

    setAuth((prev) => {
      return { ...prev, roles: userRoles, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
