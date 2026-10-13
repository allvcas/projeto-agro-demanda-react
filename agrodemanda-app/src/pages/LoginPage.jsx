import React from 'react';
import AuthPage from './AuthPage';

/**
 * Página de Login — Área do Agricultor
 * Renderiza o componente de autenticação com a aba "Entrar" selecionada.
 */
export default function LoginPage() {
  return <AuthPage defaultTab="login" />;
}
