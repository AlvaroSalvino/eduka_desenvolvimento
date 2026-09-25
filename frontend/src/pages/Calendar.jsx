import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { calendarApi } from '@/services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const TYPE_COLORS = {
  feriado: 'bg-red-500',
  prova: 'bg-amber-500',
  reuniao: 'bg-sky-500',
  recesso: 'bg-violet-500',
  evento: 'bg-emerald-500',
  entrega_notas: 'bg-primary',
};

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: calendarApi.list });

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const eventsByDay = useMemo(() => {
    const m = {};
    events.forEach((e) => {
      const key = e.start_date;
      if (!m[key]) m[key] = [];
      m[key].push(e);
    });
    return m;
  }, [events]);

  const upcomingEvents = useMemo(() =>
    events.filter((e) => new Date(e.start_date) >= new Date()).slice(0, 5), [events]);

  return (
    <div>
      <PageHeader
        title="Calendário Escolar"
        subtitle="Eventos, feriados e datas importantes"
        icon={CalendarDays}
        actions={<Button className="bg-primary"><Plus className="w-4 h-4 mr-1.5" />Novo Evento</Button>}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 premium-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-2xl font-bold capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h3>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>Hoje</Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
              <div key={d} className="text-center text-[11px] uppercase tracking-wider font-semibold text-muted-foreground py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayEvents = eventsByDay[format(day, 'yyyy-MM-dd')] || [];
              const inMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              return (
                <div
                  key={day.toString()}
                  className={cn(
                    'aspect-square rounded-lg p-1.5 text-xs transition-colors cursor-pointer border',
                    inMonth ? 'bg-background hover:bg-muted' : 'bg-muted/30 text-muted-foreground/50',
                    isToday ? 'border-primary ring-1 ring-primary' : 'border-transparent'
                  )}
                >
                  <div className={cn('font-medium', isToday && 'text-primary font-bold')}>{format(day, 'd')}</div>
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {dayEvents.slice(0, 3).map((e, i) => (
                      <div key={i} className={cn('w-1.5 h-1.5 rounded-full', TYPE_COLORS[e.event_type] || 'bg-gray-400')} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg font-semibold mb-4">Próximos eventos</h3>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-6">Nenhum evento próximo</div>
            ) : upcomingEvents.map((e) => (
              <div key={e.id} className="flex gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={cn('w-1 rounded-full shrink-0', TYPE_COLORS[e.event_type] || 'bg-gray-400')} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{e.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(e.start_date), "dd 'de' MMM", { locale: ptBR })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Legenda</div>
            <div className="space-y-1.5 text-xs">
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2 capitalize">
                  <div className={cn('w-2 h-2 rounded-full', color)} />
                  {type.replace('_', ' ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}