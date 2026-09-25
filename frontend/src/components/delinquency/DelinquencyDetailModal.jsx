import React, { useMemo } from 'react';
import {
  AlertTriangle, Phone, Mail, MessageSquare, Calendar, Clock,
  TrendingUp, Receipt, User, UserCog, CheckCircle2, XCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const BRL = (v) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Juros simples: 2% ao mês + multa de 2% uma vez
function calcInterest(amount, dueDateStr) {
  if (!amount || !dueDateStr) return { fine: 0, interest: 0, total: amount ?? 0 };
  const days = Math.max(0, differenceInDays(new Date(), new Date(dueDateStr)));
  const months = days / 30;
  const fine = amount * 0.02;                        // multa 2% única
  const interest = amount * 0.01 * months;           // 1% ao mês
  const total = amount + fine + interest;
  return { days, fine, interest, total };
}

const STATUS_CONFIG = {
  pendente:  { label: 'Pendente',  color: 'bg-amber-100 text-amber-700' },
  atrasado:  { label: 'Atrasado',  color: 'bg-red-100 text-red-700' },
  pago:      { label: 'Pago',      color: 'bg-emerald-100 text-emerald-700' },
  cancelado: { label: 'Cancelado', color: 'bg-gray-100 text-gray-500' },
};

export default function DelinquencyDetailModal({ group, onClose }) {
  const invoiceSummaries = useMemo(() =>
    (group?.invoices ?? []).map((inv) => ({
      ...inv,
      ...calcInterest(inv.amount, inv.due_date),
    })),
    [group]
  );

  const grandTotal = invoiceSummaries.reduce((s, i) => s + i.total, 0);
  const totalFine = invoiceSummaries.reduce((s, i) => s + i.fine, 0);
  const totalInterest = invoiceSummaries.reduce((s, i) => s + i.interest, 0);
  const totalOriginal = invoiceSummaries.reduce((s, i) => s + (i.amount ?? 0), 0);

  if (!group) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Detalhes de Inadimplência
          </DialogTitle>
        </DialogHeader>

        {/* ── Student Info ── */}
        <div className="bg-muted/30 rounded-xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center font-bold text-xl shrink-0">
            {group.student?.charAt(0) ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-lg leading-tight truncate">{group.student}</div>
            {group.guardian && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <UserCog className="w-3.5 h-3.5" />
                Responsável: {group.guardian}
              </div>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="outline" size="icon" className="h-9 w-9" title="Ligar"><Phone className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="h-9 w-9" title="Email"><Mail className="w-4 h-4" /></Button>
            <Button variant="outline" size="icon" className="h-9 w-9 text-green-600 hover:text-green-700" title="WhatsApp"><MessageSquare className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard label="Boletos" value={group.invoices.length} icon={Receipt} color="text-primary" />
          <SummaryCard label="Maior atraso" value={`${group.maxDays}d`} icon={Clock} color="text-red-600" />
          <SummaryCard label="Original" value={BRL(totalOriginal)} icon={AlertTriangle} color="text-amber-600" />
          <SummaryCard label="Total c/ juros" value={BRL(grandTotal)} icon={TrendingUp} color="text-red-600" highlight />
        </div>

        {/* ── Interest Breakdown ── */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />Composição do débito
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor original</span>
              <span className="font-medium">{BRL(totalOriginal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Multa (2% única por boleto)</span>
              <span className="font-medium text-amber-600">+ {BRL(totalFine)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Juros (1% a.m. proporcional)</span>
              <span className="font-medium text-amber-600">+ {BRL(totalInterest)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-red-200 dark:border-red-800">
              <span className="font-semibold">Total a pagar</span>
              <span className="font-bold text-red-600 text-base">{BRL(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* ── Invoice List ── */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Boletos em atraso</div>
          <div className="space-y-2">
            {invoiceSummaries.map((inv) => (
              <div key={inv.id} className="border border-border rounded-xl p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{inv.description || 'Boleto'}</div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Vence: {inv.due_date ? format(new Date(inv.due_date), 'dd/MM/yyyy', { locale: ptBR }) : '—'}
                      </span>
                      <span className="flex items-center gap-1 text-red-600 font-medium">
                        <Clock className="w-3 h-3" />
                        {inv.days ?? 0} dias em atraso
                      </span>
                    </div>
                  </div>
                  <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold shrink-0', STATUS_CONFIG[inv.status]?.color || 'bg-muted text-muted-foreground')}>
                    {STATUS_CONFIG[inv.status]?.label || inv.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                  <div className="bg-muted/30 rounded-lg p-2 text-center">
                    <div className="text-muted-foreground">Original</div>
                    <div className="font-semibold">{BRL(inv.amount)}</div>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2 text-center">
                    <div className="text-muted-foreground">Multa + Juros</div>
                    <div className="font-semibold text-amber-600">+ {BRL(inv.fine + inv.interest)}</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-2 text-center">
                    <div className="text-muted-foreground">Total</div>
                    <div className="font-bold text-red-600">{BRL(inv.total)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-between items-center pt-2 border-t">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
          <div className="flex gap-2">
            <Button variant="outline" className="text-green-600 border-green-300 hover:bg-green-50">
              <MessageSquare className="w-4 h-4 mr-1.5" />Cobrar via WhatsApp
            </Button>
            <Button className="bg-primary">
              <Mail className="w-4 h-4 mr-1.5" />Enviar cobrança por email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryCard({ label, value, icon: Icon, color, highlight }) {
  return (
    <div className={cn('rounded-xl p-3 border text-center', highlight ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : 'bg-muted/30 border-border')}>
      <Icon className={cn('w-4 h-4 mx-auto mb-1', color)} />
      <div className={cn('font-bold text-sm', color)}>{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}