import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavbarLayout from '../components/Navbar/Navbar';
import { SweetAlert } from '../components/SweetAlert/SweetAlert';

interface PrivateRoutesProps {
  allowedRoles: ('ADMIN' | 'EMPLOYEE')[];
}

export default function PrivateRoutes({ allowedRoles }: PrivateRoutesProps) {
  const { authenticated, user } = useAuth();
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (authenticated && user && !allowedRoles.includes(user.role)) {
      SweetAlert.error('Acesso Negado', 'Você não tem permissão para acessar esta página.');
      setAccessDenied(true);
    }
  }, [authenticated, user, allowedRoles]);

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (accessDenied) {
    return null;
  }

  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return null;
  }

  return (
    <NavbarLayout>
      <Outlet />
    </NavbarLayout>
  );
}
