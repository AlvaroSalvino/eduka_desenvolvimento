import React, { createContext, useContext, useEffect, useState } from 'react';

const RoleContext = createContext(null);

export const ROLES = {
  admin: { key: 'admin', label: 'Admin Geral', color: 'bg-primary' },
  secretaria: { key: 'secretaria', label: 'Secretaria', color: 'bg-sky-600' },
  financeiro: { key: 'financeiro', label: 'Financeiro', color: 'bg-emerald-600' },
  professor: { key: 'professor', label: 'Professor', color: 'bg-violet-600' },
  aluno: { key: 'aluno', label: 'Aluno', color: 'bg-amber-600' },
  responsavel: { key: 'responsavel', label: 'Responsável', color: 'bg-rose-600' },
};

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('csf_role') || 'admin');
  const [theme, setTheme] = useState(() => localStorage.getItem('csf_theme') || 'light');

  useEffect(() => {
    localStorage.setItem('csf_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('csf_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const isPortalUser = role === 'aluno' || role === 'responsavel';

  return (
    <RoleContext.Provider value={{ role, setRole, theme, setTheme, isPortalUser, roleMeta: ROLES[role] }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside RoleProvider');
  return ctx;
};