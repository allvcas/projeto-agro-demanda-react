import React from 'react';
import AuthPage from './AuthPage';

/**
 * Página de Cadastro — Área do Agricultor
 * Renderiza o componente de autenticação com a aba "Criar conta" selecionada.
 */
export default function RegisterPage() {
  return <AuthPage defaultTab="register" />;
}
