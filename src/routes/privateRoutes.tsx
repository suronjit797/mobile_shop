import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

const PrivateRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
