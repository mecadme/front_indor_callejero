import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  console.log(auth, persist);

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
    auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

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
          <FontAwesomeIcon icon={faSpinner} spin /> Cargando...
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
