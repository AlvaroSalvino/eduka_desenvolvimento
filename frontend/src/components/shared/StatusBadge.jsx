import React from 'react';
import { cn } from '@/lib/utils';

const STATUS_STYLES = {
  ativo: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
  inativo: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400 border-gray-200 dark:border-gray-800',
  transferido: 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 border-sky-200 dark:border-sky-900',
  formado: 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 border-violet-200 dark:border-violet-900',
  pago: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
  pendente: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-900',
  atrasado: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-red-200 dark:border-red-900',
  cancelado: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-500 border-gray-200 dark:border-gray-800',
  aprovado: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
  recuperacao: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
  reprovado: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900',
  em_andamento: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900',
};

const LABELS = {
  ativo: 'Ativo', inativo: 'Inativo', transferido: 'Transferido', formado: 'Formado',
  pago: 'Pago', pendente: 'Pendente', atrasado: 'Atrasado', cancelado: 'Cancelado',
  aprovado: 'Aprovado', recuperacao: 'Recuperação', reprovado: 'Reprovado', em_andamento: 'Em andamento',
};

export default function StatusBadge({ status }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium capitalize',
      STATUS_STYLES[status] || 'bg-muted text-muted-foreground border-border'
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        status === 'pago' || status === 'ativo' || status === 'aprovado' ? 'bg-emerald-500' :
        status === 'pendente' || status === 'recuperacao' ? 'bg-amber-500' :
        status === 'atrasado' || status === 'reprovado' ? 'bg-red-500' : 'bg-gray-400'
      )} />
      {LABELS[status] || status}
    </span>
  );
}