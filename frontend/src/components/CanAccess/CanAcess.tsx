import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface CanAccessProps {
  allowedRoles: ('ADMIN' | 'EMPLOYEE')[];
  children: ReactNode;
}

export const CanAccess = ({ allowedRoles, children }: CanAccessProps) => {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    return null; // ou <div>Acesso negado</div>
  }

  return <>{children}</>;
};
