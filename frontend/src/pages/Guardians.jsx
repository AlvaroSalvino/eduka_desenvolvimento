import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserCog, Plus, Search, Mail, Phone, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { guardiansApi } from '@/services/api';
import { motion } from 'framer-motion';

export default function Guardians() {
  const [search, setSearch] = useState('');
  const { data: guardians = [], isLoading } = useQuery({ queryKey: ['guardians'], queryFn: guardiansApi.list });

  const filtered = useMemo(
    () => guardians.filter((g) => !search || g.full_name?.toLowerCase().includes(search.toLowerCase()) || g.cpf?.includes(search)),
    [guardians, search]
  );

  return (
    <div>
      <PageHeader
        title="Responsáveis"
        subtitle={`${filtered.length} responsáve${filtered.length === 1 ? 'l' : 'is'}`}
        icon={UserCog}
        actions={<Button className="bg-primary"><Plus className="w-4 h-4 mr-1.5" />Novo Responsável</Button>}
      />

      <div className="bg-card border border-border rounded-2xl p-4 mb-6 premium-shadow">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou CPF..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-muted/40 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl premium-shadow">
          <EmptyState icon={UserCog} title="Nenhum responsável cadastrado" description="Adicione responsáveis para vincular aos alunos." />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-2xl p-5 premium-shadow hover:premium-shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500/20 to-rose-500/5 flex items-center justify-center text-rose-600 font-semibold">
                  {g.full_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{g.full_name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{g.relationship || 'responsável'}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {g.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-3.5 h-3.5" />{g.email}</div>}
                {g.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-3.5 h-3.5" />{g.phone}</div>}
                <div className="flex items-center gap-2 text-muted-foreground pt-2 border-t"><Users className="w-3.5 h-3.5" />{g.student_ids?.length || 0} aluno(s) vinculado(s)</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}