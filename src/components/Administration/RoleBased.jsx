import useAuth from "../../hooks/useAuth";

const RoleBased = ({ allowedRoles, children }) => {
  const { auth } = useAuth();
  console.log(auth);
  const roles = auth?.roles || [];

  const hasAccess = roles.some(role => allowedRoles.includes(role));

  return hasAccess ? children : null; 
};

export default RoleBased;
