import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const REFRESH_URL = "auth/refresh";
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get(REFRESH_URL, {
      withCredentials: true
        });
        
        setAuth(prev => {
            return { ...prev, accessToken: response.data}
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
