import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemandDraftProvider } from './context/DemandDraftContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import DemandStep1Page from './pages/DemandStep1Page';
import DemandStep2Page from './pages/DemandStep2Page';
import DemandSuccessPage from './pages/DemandSuccessPage';
import TrackingPage from './pages/TrackingPage';
import AdminPage from './pages/AdminPage';

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/inicio" replace />;
  }
  return children;
}

function AdminProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'admin' && user?.username !== 'admin') {
    return <Navigate to="/inicio" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DemandDraftProvider>
          <Routes>
            {/* Rotas de Autenticação */}
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <AuthPage defaultTab="login" />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/cadastro"
              element={
                <PublicOnlyRoute>
                  <AuthPage defaultTab="register" />
                </PublicOnlyRoute>
              }
            />

            {/* Tela Inicial (Pós-login) — Imagem 1 */}
            <Route
              path="/inicio"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

            {/* Passo 1: Nova Solicitação ("Do que você precisa?") — Imagem 2 */}
            <Route
              path="/solicitacao"
              element={
                <ProtectedRoute>
                  <DemandStep1Page />
                </ProtectedRoute>
              }
            />

            {/* Passo 2: Localização ("Onde o serviço é necessário?") — Imagem 3 */}
            <Route
              path="/solicitacao/localizacao"
              element={
                <ProtectedRoute>
                  <DemandStep2Page />
                </ProtectedRoute>
              }
            />

            {/* Passo 3: Confirmação e Protocolo ("Seu pedido foi recebido!") — Imagem 4 */}
            <Route
              path="/solicitacao/sucesso"
              element={
                <ProtectedRoute>
                  <DemandSuccessPage />
                </ProtectedRoute>
              }
            />

            {/* Acompanhar Pedidos vinculados à conta do usuário */}
            <Route
              path="/acompanhar"
              element={
                <ProtectedRoute>
                  <TrackingPage />
                </ProtectedRoute>
              }
            />

            {/* Painel do Administrador */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminPage />
                </AdminProtectedRoute>
              }
            />

            {/* Redirecionamentos e Fallbacks */}
            <Route path="/demanda" element={<Navigate to="/inicio" replace />} />
            <Route path="/" element={<Navigate to="/inicio" replace />} />
            <Route path="*" element={<Navigate to="/inicio" replace />} />
          </Routes>
        </DemandDraftProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

