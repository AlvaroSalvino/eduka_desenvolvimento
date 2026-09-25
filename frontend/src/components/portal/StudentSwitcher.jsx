/**
 * Seletor de dependente para o perfil "Responsável".
 * Exibe um dropdown com todos os alunos vinculados ao responsável.
 */
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, GraduationCap, Check } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { studentsApi } from '@/services/api';
import { useSelectedStudent } from '@/lib/SelectedStudentContext';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';

export default function StudentSwitcher() {
  const { selectedStudent, setSelectedStudent } = useSelectedStudent();
  const { user } = useAuth();

  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: studentsApi.list,
  });

  // Filtra alunos vinculados ao responsável logado (guardian_ids inclui o user.id)
  // Se não houver vínculo, mostra todos (contexto de demo/dev)
  const myStudents = students.filter(
    (s) => Array.isArray(s.guardian_ids) && s.guardian_ids.includes(user?.id)
  );
  const displayStudents = myStudents.length > 0 ? myStudents : students;

  // Seleciona automaticamente o primeiro se ainda não há seleção
  useEffect(() => {
    if (!selectedStudent && displayStudents.length > 0) {
      setSelectedStudent(displayStudents[0]);
    }
  }, [displayStudents, selectedStudent, setSelectedStudent]);

  if (displayStudents.length === 0) return null;

  const current = selectedStudent || displayStudents[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 pr-3 pl-2.5 font-medium max-w-[200px]"
        >
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
            {current.full_name?.charAt(0)}
          </div>
          <span className="truncate text-sm">{current.full_name?.split(' ')[0]}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5" />
          Selecionar dependente
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {displayStudents.map((s) => (
          <DropdownMenuItem
            key={s.id}
            onClick={() => setSelectedStudent(s)}
            className={cn('flex items-center gap-3 py-2.5 cursor-pointer', current.id === s.id && 'bg-muted')}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {s.full_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{s.full_name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {s.grade_level || '—'} {s.class_name && `• Turma ${s.class_name}`}
              </div>
            </div>
            {current.id === s.id && <Check className="w-4 h-4 text-primary shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}