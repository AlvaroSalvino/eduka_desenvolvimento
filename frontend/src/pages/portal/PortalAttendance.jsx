import React from 'react';
import { CalendarCheck, Check, X, AlertCircle } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';

const HISTORY = [
  { date: '2025-04-15', status: 'presente' }, { date: '2025-04-14', status: 'presente' },
  { date: '2025-04-11', status: 'falta' }, { date: '2025-04-10', status: 'presente' },
  { date: '2025-04-09', status: 'presente' }, { date: '2025-04-08', status: 'justificado' },
  { date: '2025-04-07', status: 'presente' }, { date: '2025-04-04', status: 'presente' },
];

export default function PortalAttendance() {
  return (
    <div>
      <PageHeader title="Frequência" subtitle="Histórico de presença" icon={CalendarCheck} />

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Presenças" value="132" icon={Check} accent="success" delay={0} />
        <StatCard label="Faltas" value="5" icon={X} accent="danger" delay={0.05} />
        <StatCard label="Justificadas" value="3" icon={AlertCircle} accent="warning" delay={0.1} />
        <StatCard label="Frequência" value="96%" icon={CalendarCheck} accent="primary" delay={0.15} />
      </div>

      <div className="bg-card border border-border rounded-2xl premium-shadow">
        <div className="p-5 border-b">
          <h3 className="font-serif text-lg font-semibold">Histórico recente</h3>
        </div>
        <div className="divide-y">
          {HISTORY.map((h, i) => {
            const config = {
              presente: { icon: Check, color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', label: 'Presente' },
              falta: { icon: X, color: 'bg-red-500/10 text-red-700 dark:text-red-400', label: 'Falta' },
              justificado: { icon: AlertCircle, color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400', label: 'Justificado' },
            }[h.status];
            const Icon = config.icon;
            return (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${config.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{new Date(h.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}</div>
                    <div className="text-xs text-muted-foreground">Ensino Fundamental</div>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config.color}`}>{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}