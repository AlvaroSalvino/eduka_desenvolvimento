import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, TrendingDown, CheckCircle2, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import EmptyState from '@/components/shared/EmptyState';
import { invoicesApi } from '@/services/api';
import { format } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import StudentFinanceSearch from '@/components/finance/StudentFinanceSearch';

export default function Finance() {
  const { data: invoices = [], isLoading } = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list });

  const stats = useMemo(() => {
    const total = invoices.reduce((s, i) => s + (i.amount || 0), 0);
    const paid = invoices.filter((i) => i.status === 'pago').reduce((s, i) => s + (i.amount || 0), 0);
    const pending = invoices.filter((i) => i.status === 'pendente').reduce((s, i) => s + (i.amount || 0), 0);
    const overdue = invoices.filter((i) => i.status === 'atrasado').reduce((s, i) => s + (i.amount || 0), 0);
    return { total, paid, pending, overdue };
  }, [invoices]);

  const chartData = useMemo(() => {
    const months = {};
    invoices.forEach((i) => {
      const m = (i.reference_month || i.due_date?.slice(0, 7) || 'N/A');
      if (!months[m]) months[m] = { mes: m, recebido: 0, pendente: 0 };
      if (i.status === 'pago') months[m].recebido += i.amount || 0;
      else months[m].pendente += i.amount || 0;
    });
    return Object.values(months).slice(-6);
  }, [invoices]);

  const fmt = (v) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <PageHeader
        title="Financeiro"
        subtitle="Visão geral das finanças da instituição"
        icon={Wallet}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1.5" />Exportar</Button>
            <Button className="bg-primary"><Plus className="w-4 h-4 mr-1.5" />Gerar cobrança</Button>
          </>
        }
      />

      <StudentFinanceSearch />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Receita do mês" value={fmt(stats.paid)} icon={TrendingUp} accent="success" trend="up" trendValue="+12%" delay={0} />
        <StatCard label="Em aberto" value={fmt(stats.pending)} icon={Wallet} accent="warning" delay={0.05} />
        <StatCard label="Atrasados" value={fmt(stats.overdue)} icon={TrendingDown} accent="danger" trend="down" trendValue="-3%" delay={0.1} />
        <StatCard label="Total recebido" value={fmt(stats.paid)} icon={CheckCircle2} accent="primary" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg font-semibold mb-1">Fluxo de caixa</h3>
          <p className="text-xs text-muted-foreground mb-4">Recebido vs. pendente</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12 }} formatter={(v) => fmt(v)} />
                <Bar dataKey="recebido" fill="hsl(142 71% 45%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pendente" fill="hsl(42 45% 58%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-60 flex items-center justify-center text-sm text-muted-foreground">Sem dados financeiros ainda</div>}
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg font-semibold mb-4">Resumo</h3>
          <div className="space-y-4">
            <ResumeRow label="Faturado" value={fmt(stats.total)} />
            <ResumeRow label="Taxa de pagamento" value={`${stats.total ? Math.round((stats.paid / stats.total) * 100) : 0}%`} highlight />
            <ResumeRow label="Inadimplência" value={`${stats.total ? Math.round((stats.overdue / stats.total) * 100) : 0}%`} />
            <ResumeRow label="Total boletos" value={invoices.length} />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden premium-shadow">
        <div className="p-5 border-b border-border">
          <h3 className="font-serif text-lg font-semibold">Últimas mensalidades</h3>
        </div>
        {isLoading ? (
          <div className="p-8 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-muted/40 rounded-xl animate-pulse" />)}</div>
        ) : invoices.length === 0 ? (
          <EmptyState icon={Wallet} title="Sem mensalidades" description="Gere a primeira cobrança para seus alunos." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Aluno</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Descrição</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Vencimento</th>
                  <th className="text-right font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Valor</th>
                  <th className="text-left font-medium text-xs uppercase tracking-wider text-muted-foreground py-3 px-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 10).map((i) => (
                  <tr key={i.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                    <td className="py-3 px-5 font-medium">{i.student_name || '—'}</td>
                    <td className="py-3 px-5 text-muted-foreground">{i.description || 'Mensalidade'}</td>
                    <td className="py-3 px-5 text-muted-foreground">{i.due_date ? format(new Date(i.due_date), 'dd/MM/yyyy') : '—'}</td>
                    <td className="py-3 px-5 text-right font-semibold">{fmt(i.amount || 0)}</td>
                    <td className="py-3 px-5"><StatusBadge status={i.status || 'pendente'} /></td>
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

function ResumeRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={highlight ? 'font-serif text-2xl font-bold text-primary' : 'font-semibold'}>{value}</span>
    </div>
  );
}