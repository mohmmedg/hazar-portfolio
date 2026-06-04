import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-navy-dark text-white">
        Checking authentication...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/admin/login" state={{ from: location }} replace />;
}

export default ProtectedRoute;
