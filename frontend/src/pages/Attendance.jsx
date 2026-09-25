import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClipboardCheck, Check, X, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import { studentsApi } from '@/services/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Attendance() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedClass, setSelectedClass] = useState('all');
  const [attendance, setAttendance] = useState({});

  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: studentsApi.list });

  const classOptions = useMemo(() => [...new Set(students.map((s) => `${s.grade_level}${s.class_name ? ' ' + s.class_name : ''}`).filter(Boolean))], [students]);
  const filtered = useMemo(() => selectedClass === 'all' ? students : students.filter((s) => `${s.grade_level}${s.class_name ? ' ' + s.class_name : ''}` === selectedClass), [students, selectedClass]);

  const mark = (id, status) => setAttendance((p) => ({ ...p, [id]: status }));

  const counts = useMemo(() => {
    const c = { presente: 0, falta: 0, justificado: 0 };
    Object.values(attendance).forEach((v) => c[v] !== undefined && c[v]++);
    return c;
  }, [attendance]);

  return (
    <div>
      <PageHeader
        title="Chamada / Frequência"
        subtitle="Registro diário de presença"
        icon={ClipboardCheck}
        actions={<Button onClick={() => toast.success('Frequência registrada')} className="bg-primary"><Save className="w-4 h-4 mr-1.5" />Salvar chamada</Button>}
      />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-2xl p-4 premium-shadow md:col-span-2">
          <div className="grid md:grid-cols-2 gap-3">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger><SelectValue placeholder="Turma" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {classOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 premium-shadow">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Presentes</div>
          <div className="text-2xl font-serif font-bold text-emerald-600 mt-1">{counts.presente}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 premium-shadow">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">Faltas</div>
          <div className="text-2xl font-serif font-bold text-red-600 mt-1">{counts.falta}</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden premium-shadow">
        <div className="divide-y">
          {filtered.map((s) => {
            const status = attendance[s.id];
            return (
              <div key={s.id} className="p-4 flex items-center gap-4 hover:bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {s.full_name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{s.full_name}</div>
                  <div className="text-xs text-muted-foreground">{s.grade_level} {s.class_name}</div>
                </div>
                <div className="flex items-center gap-1">
                  <AttendBtn active={status === 'presente'} onClick={() => mark(s.id, 'presente')} color="emerald" icon={Check} label="Presente" />
                  <AttendBtn active={status === 'falta'} onClick={() => mark(s.id, 'falta')} color="red" icon={X} label="Falta" />
                  <AttendBtn active={status === 'justificado'} onClick={() => mark(s.id, 'justificado')} color="amber" icon={AlertCircle} label="Justif." />
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">Selecione uma turma</div>}
        </div>
      </div>
    </div>
  );
}

function AttendBtn({ active, onClick, color, icon: Icon, label }) {
  const colors = {
    emerald: active ? 'bg-emerald-500 text-white border-emerald-500' : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600',
    red: active ? 'bg-red-500 text-white border-red-500' : 'hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600',
    amber: active ? 'bg-amber-500 text-white border-amber-500' : 'hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600',
  };
  return (
    <button onClick={onClick} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all', active ? colors[color] : `border-border ${colors[color]}`)}>
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}