import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt, Download, Mail, Eye, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import StatusBadge from '@/components/shared/StatusBadge';
import { invoicesApi } from '@/services/api';
import { format } from 'date-fns';

export default function Invoices() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const { data: invoices = [], isLoading } = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list });

  const filtered = useMemo(() => invoices.filter((i) => {
    const m1 = !search || i.student_name?.toLowerCase().includes(search.toLowerCase());
    const m2 = status === 'all' || i.status === status;
    return m1 && m2;
  }), [invoices, search, status]);

  const fmt = (v) => `R$ ${(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <PageHeader
        title="Boletos"
        subtitle={`${filtered.length} boleto${filtered.length !== 1 ? 's' : ''}`}
        icon={Receipt}
        actions={<Button className="bg-primary"><Plus className="w-4 h-4 mr-1.5" />Gerar boleto</Button>}
      />

      <div className="bg-card border border-border rounded-2xl p-4 mb-6 premium-shadow">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por aluno..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="pago">Pagos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="atrasado">Atrasados</SelectItem>
              <SelectItem value="cancelado">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden premium-shadow">
        {isLoading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-muted/40 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Receipt} title="Sem boletos" description="Nenhum boleto para os filtros aplicados." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Aluno</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Descrição</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Vencimento</th>
                  <th className="text-right font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Valor</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Status</th>
                  <th className="text-right font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((i) => (
                  <tr key={i.id} className="border-b last:border-b-0 hover:bg-muted/30">
                    <td className="py-3 px-5 font-medium">{i.student_name || '—'}</td>
                    <td className="py-3 px-5 text-muted-foreground">{i.description || 'Mensalidade'}</td>
                    <td className="py-3 px-5 text-muted-foreground">{i.due_date ? format(new Date(i.due_date), 'dd/MM/yyyy') : '—'}</td>
                    <td className="py-3 px-5 text-right font-semibold">{fmt(i.amount)}</td>
                    <td className="py-3 px-5"><StatusBadge status={i.status || 'pendente'} /></td>
                    <td className="py-3 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Visualizar"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Baixar PDF"><Download className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Enviar email"><Mail className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}