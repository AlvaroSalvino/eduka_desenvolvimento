import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/services/api';
import { Search, User, GraduationCap, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import StudentFinanceModal from './StudentFinanceModal';

const EDUCATION_LABELS = {
  infantil: 'Ed. Infantil', fundamental_1: 'Fund. I', fundamental_2: 'Fund. II',
  medio: 'Ensino Médio', tecnico: 'Técnico', graduacao: 'Graduação', pos_graduacao: 'Pós-Graduação',
};

const STATUS_COLOR = {
  ativo: 'bg-emerald-500',
  inativo: 'bg-muted-foreground',
  transferido: 'bg-sky-500',
  formado: 'bg-primary',
  trancado: 'bg-amber-500',
};

export default function StudentFinanceSearch() {
  const [query, setQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: studentsApi.list,
  });

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return students.filter(
      (s) =>
        s.full_name?.toLowerCase().includes(q) ||
        s.registration_number?.toLowerCase().includes(q) ||
        s.cpf?.includes(q)
    ).slice(0, 8);
  }, [students, query]);

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-6 premium-shadow mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-serif text-base font-semibold">Consulta de Aluno</h3>
            <p className="text-xs text-muted-foreground">Busque por nome, matrícula ou CPF</p>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Nome, número de matrícula ou CPF..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="mt-3 border border-border rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground text-center">Carregando...</div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">Nenhum aluno encontrado para "{query}"</div>
            ) : (
              <div className="divide-y divide-border">
                {filtered.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => { setSelectedStudent(student); setQuery(''); }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                      {student.full_name?.charAt(0) ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{student.full_name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {student.registration_number && <span>Mat: {student.registration_number}</span>}
                        {student.education_level && <span>• {EDUCATION_LABELS[student.education_level]}</span>}
                        {student.grade_level && <span>• {student.grade_level}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {student.status && (
                        <span className={cn('w-2 h-2 rounded-full', STATUS_COLOR[student.status] || 'bg-muted-foreground')} title={student.status} />
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedStudent && (
        <StudentFinanceModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </>
  );
}