import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { UserRole } from "@/interfaces/userInterface";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const { isAuthenticated, role } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default RoleRoute;
