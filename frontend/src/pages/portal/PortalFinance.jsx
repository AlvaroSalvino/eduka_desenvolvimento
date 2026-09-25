import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet, Download, QrCode, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import StatCard from '@/components/shared/StatCard';
import EmptyState from '@/components/shared/EmptyState';
import { invoicesApi } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PortalFinance() {
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list });
  const fmt = (v) => `R$ ${(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const pending = invoices.filter((i) => i.status === 'pendente');
  const paid = invoices.filter((i) => i.status === 'pago');

  return (
    <div>
      <PageHeader title="Financeiro" subtitle="Mensalidades e histórico de pagamentos" icon={Wallet} />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Em aberto" value={pending.length} icon={Receipt} accent="warning" delay={0} />
        <StatCard label="Pagos" value={paid.length} icon={Wallet} accent="success" delay={0.05} />
        <StatCard label="Valor pendente" value={fmt(pending.reduce((s, i) => s + (i.amount || 0), 0))} icon={Receipt} accent="primary" delay={0.1} />
      </div>

      <div className="bg-card border border-border rounded-2xl premium-shadow">
        <div className="p-5 border-b">
          <h3 className="font-serif text-lg font-semibold">Meus boletos</h3>
        </div>
        {invoices.length === 0 ? (
          <EmptyState icon={Wallet} title="Sem boletos" description="Não há mensalidades registradas." />
        ) : (
          <div className="divide-y">
            {invoices.slice(0, 15).map((i) => (
              <div key={i.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-muted/30">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{i.description || 'Mensalidade'}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Vencimento: {i.due_date ? format(new Date(i.due_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '—'}
                  </div>
                </div>
                <div className="font-serif text-2xl font-bold shrink-0">{fmt(i.amount)}</div>
                <StatusBadge status={i.status || 'pendente'} />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" />Boleto</Button>
                  <Button size="sm" className="bg-primary"><QrCode className="w-3.5 h-3.5 mr-1.5" />PIX</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}