import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { config } from "dotenv";

const useAxiosPrivate = () => {
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response, 
      async (error) => {
        const prevRequest = error?.config;
    
        
        if (
          error?.response?.status === 403 ||
          (error?.response?.status === 500 &&
            error?.response?.data?.message ===
              "Expired or invalid JWT accessToken" &&
            !prevRequest?.sent) 
        ) {
          prevRequest.sent = true; 
    
          try {
            const newAccessToken = await refresh(); 
    
            
            if (!newAccessToken) {
              console.error("Error: no se recibió un nuevo token");
              throw new Error("No se pudo renovar el token");
            }
    
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`; 
    
            
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            
            console.error("Error al intentar refrescar el token:", refreshError);
            
            
            return Promise.reject(refreshError);
          }
        }
    
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
