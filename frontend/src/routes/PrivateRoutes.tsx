import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavbarLayout from '../components/Navbar';

export default function PrivateRoutes() {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <NavbarLayout>
      <Outlet />
    </NavbarLayout>
  );
}
