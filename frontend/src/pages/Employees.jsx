import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { employeesApi } from '@/services/api';
import { motion } from 'framer-motion';

const ROLE_COLORS = {
  professor: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  secretaria: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  financeiro: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  coordenacao: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  diretoria: 'bg-primary/10 text-primary',
  admin: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
};

const ROLE_LABELS = {
  professor: 'Professor', secretaria: 'Secretaria', financeiro: 'Financeiro',
  coordenacao: 'Coordenação', diretoria: 'Diretoria', admin: 'Administrador',
};

export default function Employees() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const { data: employees = [], isLoading } = useQuery({ queryKey: ['employees'], queryFn: employeesApi.list });

  const filtered = useMemo(
    () => employees.filter((e) => {
      const m1 = !search || e.full_name?.toLowerCase().includes(search.toLowerCase());
      const m2 = role === 'all' || e.role === role;
      return m1 && m2;
    }),
    [employees, search, role]
  );

  return (
    <div>
      <PageHeader
        title="Colaboradores"
        subtitle={`${filtered.length} colaborador${filtered.length !== 1 ? 'es' : ''}`}
        icon={Briefcase}
        actions={<Button className="bg-primary"><Plus className="w-4 h-4 mr-1.5" />Novo Colaborador</Button>}
      />

      <div className="bg-card border border-border rounded-2xl p-4 mb-6 premium-shadow">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar colaborador..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger><SelectValue placeholder="Cargo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cargos</SelectItem>
              {Object.entries(ROLE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-36 bg-muted/40 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl premium-shadow">
          <EmptyState icon={Briefcase} title="Sem colaboradores" description="Cadastre professores, secretaria e demais colaboradores." />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-2xl p-5 premium-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-semibold">
                  {e.full_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{e.full_name}</div>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${ROLE_COLORS[e.role] || 'bg-muted'}`}>
                    {ROLE_LABELS[e.role] || e.role}
                  </span>
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                {e.department && <div>Setor: <span className="text-foreground">{e.department}</span></div>}
                {e.email && <div>{e.email}</div>}
                {e.subjects?.length > 0 && <div>Disciplinas: <span className="text-foreground">{e.subjects.join(', ')}</span></div>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}