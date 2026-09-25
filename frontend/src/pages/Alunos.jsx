import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Search, MoreHorizontal, Pencil, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import StudentDialog from '@/components/students/StudentDialog';
import { useAlunos } from '@/hooks/useAlunos';
import { LEVEL_GROUP } from '@/lib/educationLevels.jsx';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Students() {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const qc = useQueryClient();
  const { alunos: students, loading: isLoading, totalAlunos } = useAlunos();

  const saveMutation = useMutation({
    mutationFn: (d) => (d.id ? studentsApi.update(d.id, d) : studentsApi.create(d)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      setDialogOpen(false);
      setEditing(null);
      toast.success('Aluno salvo com sucesso');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => studentsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      toast.success('Aluno removido');
    },
  });

  const grades = useMemo(() => [...new Set(students.map((s) => s.serie).filter(Boolean))], [students]);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch = !search || s.nome?.toLowerCase().includes(search.toLowerCase()) || s.ra?.includes(search);
      const matchGrade = gradeFilter === 'all' || s.serie === gradeFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchGrade && matchStatus;
    });
  }, [students, search, gradeFilter, statusFilter]);

  return (
    <div>
      <PageHeader
        title="Alunos"
        subtitle={`${filtered.length} aluno${filtered.length !== 1 ? 's' : ''} ${students.length !== filtered.length ? `de ${students.length}` : 'cadastrado' + (students.length !== 1 ? 's' : '')}`}
        icon={Users}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1.5" />Exportar</Button>
            <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="bg-primary">
              <Plus className="w-4 h-4 mr-1.5" />Novo Aluno
            </Button>
          </>
        }
      />

      {/* Filtros */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6 premium-shadow">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou matrícula..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger><SelectValue placeholder="Série / Nível" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              {grades.map((g) => <SelectItem key={g} value={g}>{g} {LEVEL_GROUP[g] ? `(${LEVEL_GROUP[g]})` : ''}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativos</SelectItem>
              <SelectItem value="inativo">Inativos</SelectItem>
              <SelectItem value="transferido">Transferidos</SelectItem>
              <SelectItem value="formado">Formados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden premium-shadow">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted/40 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum aluno encontrado"
            description="Ajuste os filtros ou cadastre o primeiro aluno da sua instituição."
            action={<Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4 mr-1.5" />Cadastrar</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Aluno</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Matrícula</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Série / Turma</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Turno</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Status</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold text-sm">
                          {s.nome?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{s.nome}</div>
                          {s.email && <div className="text-xs text-muted-foreground">{s.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-mono text-xs text-muted-foreground">{s.ra || '—'}</td>
                    <td className="py-3 px-5">{s.serie || '—'} {s.turma && <span className="text-muted-foreground">• {s.turma}</span>}</td>
                    <td className="py-3 px-5 capitalize text-muted-foreground">{s.turno || '—'}</td>
                    <td className="py-3 px-5"><StatusBadge status={s.status || 'ativo'} /></td>
                    <td className="py-3 px-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditing(s); setDialogOpen(true); }}>
                            <Pencil className="w-4 h-4 mr-2" />Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { if (confirm('Remover aluno?')) deleteMutation.mutate(s.id); }} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={editing}
        onSave={(d) => saveMutation.mutate(d)}
      />
    </div>
  );
}