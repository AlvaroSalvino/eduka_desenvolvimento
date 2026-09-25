import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { invoicesApi, paymentPlansApi } from '@/services/api';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  User, CreditCard, Receipt, Tag, AlertTriangle, CheckCircle2,
  Clock, X, GraduationCap, Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BRL = (v = 0) => `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

const EDUCATION_LABELS = {
  infantil: 'Ed. Infantil', fundamental_1: 'Fund. I', fundamental_2: 'Fund. II',
  medio: 'Ensino Médio', tecnico: 'Técnico', graduacao: 'Graduação', pos_graduacao: 'Pós-Graduação',
};

const SHIFT_LABELS = { manha: 'Manhã', tarde: 'Tarde', noite: 'Noite', integral: 'Integral', ead: 'EAD' };

const STATUS_CONFIG = {
  pago: { label: 'Pago', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
  pendente: { label: 'Pendente', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
  atrasado: { label: 'Atrasado', color: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' },
  cancelado: { label: 'Cancelado', color: 'bg-muted text-muted-foreground' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-muted text-muted-foreground' };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', cfg.color)}>
      {cfg.label}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">{label}</div>
      <div className="text-sm font-medium">{value || '—'}</div>
    </div>
  );
}

export default function StudentFinanceModal({ student, onClose }) {

  const { data: invoices = [], isLoading: loadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: invoicesApi.list,
    enabled: !!student,
  });

  const { data: paymentPlans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ['payment-plans', student?.id],
    queryFn: () => paymentPlansApi.filter({ student_id: student?.id }),
    enabled: !!student,
  });

  const studentInvoices = useMemo(() =>
    invoices.filter((i) => i.student_id === student?.id || i.student_name === student?.full_name)
      .sort((a, b) => new Date(b.due_date) - new Date(a.due_date)),
    [invoices, student]
  );

  const normalizedPlans = Array.isArray(paymentPlans)
    ? paymentPlans
    : paymentPlans?.results || [];

  const stats = useMemo(() => {
    const paid = studentInvoices.filter((i) => i.status === 'pago').reduce((s, i) => s + (i.amount || 0), 0);
    const pending = studentInvoices.filter((i) => i.status === 'pendente').reduce((s, i) => s + (i.amount || 0), 0);
    const overdue = studentInvoices.filter((i) => i.status === 'atrasado').reduce((s, i) => s + (i.amount || 0), 0);
    return { paid, pending, overdue, total: paid + pending + overdue };
  }, [studentInvoices]);

  if (!student) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-thin p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 rounded-t-lg">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold shrink-0">
              {student.full_name?.charAt(0) ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-white mb-1">{student.full_name}</DialogTitle>
              <div className="flex flex-wrap gap-2 text-sm text-white/80">
                {student.registration_number && <span>Mat: {student.registration_number}</span>}
                {student.education_level && <span>• {EDUCATION_LABELS[student.education_level]}</span>}
                {student.grade_level && <span>• {student.grade_level}</span>}
                {student.shift && <span>• {SHIFT_LABELS[student.shift]}</span>}
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors mt-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <MiniStat label="Total pago" value={BRL(stats.paid)} color="text-emerald-300" icon={CheckCircle2} />
            <MiniStat label="Em aberto" value={BRL(stats.pending)} color="text-amber-300" icon={Clock} />
            <MiniStat label="Atrasado" value={BRL(stats.overdue)} color="text-red-300" icon={AlertTriangle} />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="historico" className="px-6 pb-6 pt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="historico" className="flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" />Histórico Financeiro
            </TabsTrigger>
            <TabsTrigger value="planos" className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />Planos de Pagamento
            </TabsTrigger>
            <TabsTrigger value="dados" className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />Dados do Aluno
            </TabsTrigger>
          </TabsList>

          {/* === TAB: Histórico === */}
          <TabsContent value="historico">
            {loadingInvoices ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-muted/40 rounded-xl animate-pulse" />)}</div>
            ) : studentInvoices.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
                Nenhum registro financeiro encontrado.
              </div>
            ) : (
              <div className="space-y-2">
                {studentInvoices.map((inv) => {
                  const overdueDays = inv.status === 'atrasado' && inv.due_date
                    ? differenceInDays(new Date(), new Date(inv.due_date))
                    : 0;
                  return (
                    <div key={inv.id} className="flex items-center gap-4 border border-border rounded-xl p-4 hover:bg-muted/20 transition-colors">
                      <div className={cn('w-2 h-10 rounded-full shrink-0', {
                        'bg-emerald-500': inv.status === 'pago',
                        'bg-amber-400': inv.status === 'pendente',
                        'bg-red-500': inv.status === 'atrasado',
                        'bg-muted': inv.status === 'cancelado',
                      })} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{inv.description || 'Mensalidade'}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          Venc: {inv.due_date ? format(new Date(inv.due_date), 'dd/MM/yyyy', { locale: ptBR }) : '—'}
                          {inv.payment_date && ` • Pago: ${format(new Date(inv.payment_date), 'dd/MM/yyyy', { locale: ptBR })}`}
                          {overdueDays > 0 && <span className="text-red-600 font-medium">{overdueDays}d em atraso</span>}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold">{BRL(inv.amount)}</div>
                        {(inv.fine > 0 || inv.interest > 0) && (
                          <div className="text-xs text-amber-600">+{BRL((inv.fine || 0) + (inv.interest || 0))} multa/juros</div>
                        )}
                      </div>
                      <StatusBadge status={inv.status} />
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* === TAB: Planos === */}
          <TabsContent value="planos">
            {loadingPlans ? (
              <div className="space-y-3">{[...Array(2)].map((_, i) => <div key={i} className="h-20 bg-muted/40 rounded-xl animate-pulse" />)}</div>
            ) : normalizedPlans.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
                Nenhum plano de pagamento cadastrado.
              </div>
            ) : (
              <div className="space-y-4">
                {normalizedPlans.map((plan) => (
                  <div key={plan.id} className="border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-semibold">{plan.name}</div>
                        {plan.year && <div className="text-xs text-muted-foreground">Ano letivo: {plan.year}</div>}
                      </div>
                      <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full')}>
                        {plan.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {plan.registration_fee_name && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Tag className="w-3 h-3" />Matrícula
                          </div>
                          <div className="font-medium text-xs truncate">{plan.registration_fee_name}</div>
                          {plan.registration_discount_name && (
                            <div className="text-[11px] text-emerald-600 mt-0.5">Desconto: {plan.registration_discount_name}</div>
                          )}
                          <div className="font-bold mt-1">{BRL(plan.registration_final_amount ?? plan.registration_fee_amount)}</div>
                        </div>
                      )}
                      {plan.monthly_fee_name && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <CreditCard className="w-3 h-3" />Mensalidade
                          </div>
                          <div className="font-medium text-xs truncate">{plan.monthly_fee_name}</div>
                          {plan.monthly_discount_name && (
                            <div className="text-[11px] text-emerald-600 mt-0.5">Desconto: {plan.monthly_discount_name}</div>
                          )}
                          <div className="font-bold mt-1">{BRL(plan.monthly_final_amount ?? plan.monthly_fee_amount)}</div>
                        </div>
                      )}
                    </div>
                    {plan.notes && <div className="text-xs text-muted-foreground mt-3 border-t pt-3">{plan.notes}</div>}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* === TAB: Dados do aluno === */}
          <TabsContent value="dados">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoRow label="Nome completo" value={student.full_name} />
              <InfoRow label="Matrícula" value={student.registration_number} />
              <InfoRow label="CPF" value={student.cpf} />
              <InfoRow label="E-mail" value={student.email} />
              <InfoRow label="Telefone" value={student.phone} />
              <InfoRow label="Data de Nascimento" value={student.birth_date ? format(new Date(student.birth_date), 'dd/MM/yyyy') : null} />
              <InfoRow label="Nível de ensino" value={EDUCATION_LABELS[student.education_level]} />
              <InfoRow label="Série / Módulo" value={student.grade_level} />
              <InfoRow label="Turma" value={student.class_name} />
              <InfoRow label="Turno" value={SHIFT_LABELS[student.shift]} />
              <InfoRow label="Status" value={student.status} />
              <InfoRow label="Data de matrícula" value={student.enrollment_date ? format(new Date(student.enrollment_date), 'dd/MM/yyyy') : null} />
            </div>
            {student.observations && (
              <div className="mt-4 p-4 bg-muted/30 rounded-xl">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Observações</div>
                <div className="text-sm">{student.observations}</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function MiniStat({ label, value, color, icon: Icon }) {
  return (
    <div className="bg-white/10 rounded-xl p-3 text-center">
      <Icon className={cn('w-4 h-4 mx-auto mb-1', color)} />
      <div className={cn('font-bold text-sm', color)}>{value}</div>
      <div className="text-[11px] text-white/60 mt-0.5">{label}</div>
    </div>
  );
}