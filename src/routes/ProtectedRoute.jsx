import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotFound from './../common/NotFound/NotFound';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return <NotFound />
  }

  return <Outlet />;
};

export default ProtectedRoute;
