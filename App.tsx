import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

const AppRoutes: React.FC = () => {
  const authContext = React.useContext(AuthContext);

  if (authContext?.initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!authContext?.user ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!authContext?.user ? <RegisterPage /> : <Navigate to="/" />} />
      <Route path="/forgot-password" element={!authContext?.user ? <ForgotPasswordPage /> : <Navigate to="/" />} />
      <Route path="/reset-password/:token" element={!authContext?.user ? <ResetPasswordPage /> : <Navigate to="/" />} />
      <Route path="/" element={authContext?.user ? <DashboardPage /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;