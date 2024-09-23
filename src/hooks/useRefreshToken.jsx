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
            console.log("response:", response.data);
            console.log("data from prev:",JSON.stringify(prev));
            console.log("accessToken", response.data);
            return { ...prev, accessToken: response.data}
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
