import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="flex items-center space-x-3 mb-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <span className="text-2xl font-bold text-stone-800">AgriAdvisory</span>
        </div>
        <p className="text-stone-500 text-sm font-medium">Verifying credentials and field telemetry...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
