// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { Signup } from './components/Signup';
import { Login } from './components/Login';
import { Survey } from './pages/Survey';
import { OnboardingWizard } from './pages/onboarding';
import { Dashboard } from './pages/Dashboard';
import { OnboardingGuard } from './components/OnboardingGuard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/onboarding" element={<OnboardingWizard />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <OnboardingGuard>
                <Dashboard />
              </OnboardingGuard>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
