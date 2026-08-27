import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: ReactElement;
  forUnauthorized?: boolean;
};

export const ProtectedRoute = ({
  children,
  forUnauthorized = false
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isAuthChecked } = useSelector((state) => state.user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (forUnauthorized && user) {
    return <Navigate to='/profile' replace />;
  }

  if (!forUnauthorized && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
