import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import TermsPage from './pages/terms/TermsPage';
import UserPage from './pages/users/UserPage';
import TermsAcceptancePage from './pages/termsAcceptance/TermsAcceptancePage';
import ConfirmConsentPage from './pages/confirmConsent/ConfirmConsentPage';
import PrivateRoutes from './routes/PrivateRoutes';
import CreateUserPage from './pages/users/CreateUserPage';
import HistoryPage from './pages/history/HistoryPage';
import Unauthorized from './components/Unauthorized/Unauthorized';

export default function App() {
  return (
    <Routes>
      {/* Rota pública (sem autenticação, sem layout) */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/confirm-consent" element={<ConfirmConsentPage />} />
      <Route path="/user/create" element={<CreateUserPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Rotas privadas (com Navbar e auth obrigatória) */}
      <Route element={<PrivateRoutes  allowedRoles={['ADMIN']}/>}>
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Route>

      <Route element={<PrivateRoutes  allowedRoles={['ADMIN', 'EMPLOYEE']}/>}>
        <Route path="/termsAcceptance" element={<TermsAcceptancePage />} />
      </Route>
    </Routes>
  );
}
