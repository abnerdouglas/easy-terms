import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import TermsPage from './pages/terms/TermsPage';
import UserPage from './pages/users/UserPage';
import TermsAcceptancePage from './pages/termsAcceptance/TermsAcceptancePage';
import ConfirmConsentPage from './pages/confirmConsent/ConfirmConsentPage';
import PrivateRoutes from './routes/PrivateRoutes';

export default function App() {
  return (
    <Routes>
      {/* Rota pública (sem autenticação, sem layout) */}
      <Route path="/" element={<Login />} />
      <Route path="/confirm-consent" element={<ConfirmConsentPage />} />

      {/* Rotas privadas (com Navbar e auth obrigatória) */}
      <Route element={<PrivateRoutes />}>
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/termsAcceptance" element={<TermsAcceptancePage />} />
      </Route>
    </Routes>
  );
}
