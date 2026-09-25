import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import StatCard from '@/components/shared/StatCard';
import { invoicesApi } from '@/services/api';
import { differenceInDays, format } from 'date-fns';
import DelinquencyDetailModal from '@/components/delinquency/DelinquencyDetailModal';

export default function Delinquency() {
  const { data: invoices = [], isLoading } = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list });
  const [selectedGroup, setSelectedGroup] = useState(null);

  const grouped = useMemo(() => {
    const overdue = invoices.filter((i) => i.status === 'atrasado' || (i.status === 'pendente' && i.due_date && new Date(i.due_date) < new Date()));
    const byStudent = {};
    overdue.forEach((i) => {
      const key = i.student_name || i.student_id || 'Não identificado';
      if (!byStudent[key]) byStudent[key] = { student: key, guardian: i.guardian_name, invoices: [], total: 0, maxDays: 0 };
      byStudent[key].invoices.push(i);
      byStudent[key].total += i.amount || 0;
      const days = i.due_date ? differenceInDays(new Date(), new Date(i.due_date)) : 0;
      if (days > byStudent[key].maxDays) byStudent[key].maxDays = days;
    });
    return Object.values(byStudent).sort((a, b) => b.total - a.total);
  }, [invoices]);

  const totalOverdue = grouped.reduce((s, g) => s + g.total, 0);
  const fmt = (v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <PageHeader title="Inadimplência" subtitle="Gestão de cobranças em atraso" icon={AlertTriangle} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Inadimplentes" value={grouped.length} icon={AlertTriangle} accent="danger" delay={0} />
        <StatCard label="Valor em atraso" value={fmt(totalOverdue)} icon={AlertTriangle} accent="warning" delay={0.05} />
        <StatCard label="Boletos vencidos" value={grouped.reduce((s, g) => s + g.invoices.length, 0)} icon={AlertTriangle} accent="danger" delay={0.1} />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden premium-shadow">
        <div className="p-5 border-b">
          <h3 className="font-serif text-lg font-semibold">Lista de inadimplentes</h3>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted/40 rounded-xl animate-pulse" />)}</div>
        ) : grouped.length === 0 ? (
          <EmptyState icon={AlertTriangle} title="Nenhum inadimplente" description="Todos os pagamentos estão em dia. Excelente!" />
        ) : (
          <div className="divide-y">
            {grouped.map((g, i) => (
              <div key={i} className="p-5 hover:bg-muted/30 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer" onClick={() => setSelectedGroup(g)}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center font-semibold">
                    {g.student?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{g.student}</div>
                    {g.guardian && <div className="text-xs text-muted-foreground">Resp: {g.guardian}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Atraso</div>
                    <div className="font-semibold text-red-600">{g.maxDays} dias</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Boletos</div>
                    <div className="font-semibold">{g.invoices.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total</div>
                    <div className="font-serif font-bold text-lg">{fmt(g.total)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="icon" className="h-9 w-9" title="Ligar"><Phone className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" className="h-9 w-9" title="Email"><Mail className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" className="h-9 w-9" title="WhatsApp"><MessageSquare className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedGroup && (
        <DelinquencyDetailModal group={selectedGroup} onClose={() => setSelectedGroup(null)} />
      )}
    </div>
  );
}