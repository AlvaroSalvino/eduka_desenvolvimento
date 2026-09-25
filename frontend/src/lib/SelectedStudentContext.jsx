/**
 * Contexto para o responsável selecionar qual dependente está visualizando.
 * Persiste no localStorage para manter a seleção entre navegações.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const SelectedStudentContext = createContext(null);

export function SelectedStudentProvider({ children }) {
  const [selectedStudent, setSelectedStudent] = useState(() => {
    try {
      const saved = localStorage.getItem('csf_selected_student');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (selectedStudent) {
      localStorage.setItem('csf_selected_student', JSON.stringify(selectedStudent));
    } else {
      localStorage.removeItem('csf_selected_student');
    }
  }, [selectedStudent]);

  return (
    <SelectedStudentContext.Provider value={{ selectedStudent, setSelectedStudent }}>
      {children}
    </SelectedStudentContext.Provider>
  );
}

export const useSelectedStudent = () => {
  const ctx = useContext(SelectedStudentContext);
  if (!ctx) throw new Error('useSelectedStudent must be used inside SelectedStudentProvider');
  return ctx;
};