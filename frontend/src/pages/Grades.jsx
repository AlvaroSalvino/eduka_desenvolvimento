import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { studentsApi, gradesApi } from '@/services/api';
import { GradeLevelSelect } from '@/lib/educationLevels.jsx';
import { toast } from 'sonner';

export default function Grades() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [subject, setSubject] = useState('Matemática');
  const [period, setPeriod] = useState('1_bimestre');
  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: studentsApi.list });

  const [grades, setGrades] = useState({});

  const classOptions = useMemo(() => [...new Set(students.map((s) => `${s.grade_level}${s.class_name ? ' ' + s.class_name : ''}`).filter(Boolean))], [students]);

  const filtered = useMemo(() => {
    if (selectedClass === 'all') return students;
    return students.filter((s) => `${s.grade_level}${s.class_name ? ' ' + s.class_name : ''}` === selectedClass);
  }, [students, selectedClass]);

  const updateGrade = (studentId, field, value) => {
    setGrades((p) => {
      const curr = p[studentId] || {};
      const next = { ...curr, [field]: parseFloat(value) || 0 };
      const nums = [next.grade_1, next.grade_2, next.assignment].filter((v) => !isNaN(v) && v > 0);
      next.average = nums.length ? (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2) : 0;
      return { ...p, [studentId]: next };
    });
  };

  return (
    <div>
      <PageHeader
        title="Lançamento de Notas"
        subtitle="Registre as notas por turma e disciplina"
        icon={BookOpen}
        actions={<Button onClick={() => toast.success('Notas salvas')} className="bg-primary"><Save className="w-4 h-4 mr-1.5" />Salvar</Button>}
      />

      <div className="bg-card border border-border rounded-2xl p-4 mb-6 premium-shadow">
        <div className="grid md:grid-cols-3 gap-3">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger><SelectValue placeholder="Turma" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as turmas</SelectItem>
              {classOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['Matemática', 'Português', 'História', 'Geografia', 'Ciências', 'Inglês', 'Educação Física', 'Artes'].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1_bimestre">1º Bimestre</SelectItem>
              <SelectItem value="2_bimestre">2º Bimestre</SelectItem>
              <SelectItem value="3_bimestre">3º Bimestre</SelectItem>
              <SelectItem value="4_bimestre">4º Bimestre</SelectItem>
              <SelectItem value="1_semestre">1º Semestre</SelectItem>
              <SelectItem value="2_semestre">2º Semestre</SelectItem>
              <SelectItem value="1_modulo">1º Módulo</SelectItem>
              <SelectItem value="2_modulo">2º Módulo</SelectItem>
              <SelectItem value="3_modulo">3º Módulo</SelectItem>
              <SelectItem value="4_modulo">4º Módulo</SelectItem>
              <SelectItem value="final">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden premium-shadow">
        {filtered.length === 0 ? (
          <EmptyState icon={BookOpen} title="Sem alunos" description="Nenhum aluno para os filtros aplicados." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Aluno</th>
                  <th className="text-center font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-3 w-28">Nota 1</th>
                  <th className="text-center font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-3 w-28">Nota 2</th>
                  <th className="text-center font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-3 w-28">Trabalho</th>
                  <th className="text-center font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-3 w-28">Média</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const g = grades[s.id] || {};
                  const avg = parseFloat(g.average) || 0;
                  return (
                    <tr key={s.id} className="border-b last:border-b-0 hover:bg-muted/30">
                      <td className="py-2 px-5 font-medium">{s.full_name}</td>
                      <td className="py-2 px-3"><Input type="number" min="0" max="10" step="0.1" value={g.grade_1 || ''} onChange={(e) => updateGrade(s.id, 'grade_1', e.target.value)} className="text-center h-9" /></td>
                      <td className="py-2 px-3"><Input type="number" min="0" max="10" step="0.1" value={g.grade_2 || ''} onChange={(e) => updateGrade(s.id, 'grade_2', e.target.value)} className="text-center h-9" /></td>
                      <td className="py-2 px-3"><Input type="number" min="0" max="10" step="0.1" value={g.assignment || ''} onChange={(e) => updateGrade(s.id, 'assignment', e.target.value)} className="text-center h-9" /></td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${avg >= 7 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : avg >= 5 ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400' : avg > 0 ? 'bg-red-500/10 text-red-700 dark:text-red-400' : 'text-muted-foreground'}`}>
                          {avg > 0 ? avg.toFixed(1) : '—'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}