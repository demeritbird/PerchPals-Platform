import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from './../hooks/useAuth';
import { Roles } from './../utils/constants/types.constants';

interface AllowedRoles {
  allowedRoles: Array<Roles>;
}

function RequireAuth(props: AllowedRoles) {
  const { allowedRoles } = props;
  const { user } = useAuth();
  const location = useLocation();

  return user?.role.find((role: Roles) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}

export default RequireAuth;