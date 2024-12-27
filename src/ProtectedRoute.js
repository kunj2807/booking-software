import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
const ProtectedRoute = ({ children }) => {

  useProtectedRoute();
  return <>
    <div className='h-100'>
      <div className='child'>
        <Outlet />
      </div>
    </div>
  </>;
};


const useProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);
};

export default ProtectedRoute;
