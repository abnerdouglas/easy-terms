import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import TermsPage from './pages/terms/TermsPage';
import UserPage from './pages/users/UserPage';
import NavbarLayout from './components/Navbar';
import TermsAcceptancePage from './pages/termsAcceptance/TermsAcceptancePage';
import ConfirmConsentPage from './pages/confirmConsent/ConfirmConsentPage';

function App() {
  const { authenticated } = useAuth();

  if (!authenticated) {
    return <Login />;
  }

  return (
    <>
      <NavbarLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/terms" />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/users" element={<UserPage />} />
          <Route path="/termsAcceptance" element={<TermsAcceptancePage />} />
          <Route path="/confirm-consent" element={<ConfirmConsentPage />} />
        </Routes>
      </NavbarLayout>
    </>
  );
}

export default App;
