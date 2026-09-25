import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { calendarApi } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EmptyState from '@/components/shared/EmptyState';

const TYPE_COLORS = {
  feriado: 'bg-red-500', prova: 'bg-amber-500', reuniao: 'bg-sky-500',
  recesso: 'bg-violet-500', evento: 'bg-emerald-500', entrega_notas: 'bg-primary',
};

export default function PortalCalendar() {
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: calendarApi.list });
  const upcoming = events.filter((e) => new Date(e.start_date) >= new Date()).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

  return (
    <div>
      <PageHeader title="Calendário Escolar" subtitle="Eventos, provas e feriados" icon={CalendarDays} />

      {upcoming.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl premium-shadow">
          <EmptyState icon={CalendarDays} title="Nenhum evento próximo" description="O calendário está vazio no momento." />
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map((e) => (
            <div key={e.id} className="bg-card border border-border rounded-2xl p-5 premium-shadow flex items-center gap-5">
              <div className="text-center shrink-0 w-16">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {format(new Date(e.start_date), 'MMM', { locale: ptBR })}
                </div>
                <div className="font-serif text-3xl font-bold">{format(new Date(e.start_date), 'dd')}</div>
              </div>
              <div className={`w-1 h-10 rounded-full ${TYPE_COLORS[e.event_type] || 'bg-gray-400'}`} />
              <div className="flex-1">
                <div className="font-semibold">{e.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 capitalize">{(e.event_type || '').replace('_', ' ')}</div>
                {e.description && <div className="text-sm text-muted-foreground mt-1">{e.description}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}