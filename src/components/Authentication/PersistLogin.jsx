import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useRefreshToken from "../../hooks/useRefreshToken";
import Loading from "../Utils/Loading";
const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <>
          <Loading/>
          </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
