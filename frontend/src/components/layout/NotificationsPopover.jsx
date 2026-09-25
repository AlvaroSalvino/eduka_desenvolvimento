import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: 1, icon: AlertTriangle, color: 'text-warning', title: '3 boletos vencendo', desc: 'Mensalidades de março vencem em 2 dias', time: 'há 5 min' },
  { id: 2, icon: CheckCircle2, color: 'text-success', title: 'Nova matrícula aprovada', desc: 'Ana Clara Rodrigues - 5º Ano A', time: 'há 1h' },
  { id: 3, icon: Info, color: 'text-primary', title: 'Reunião pedagógica', desc: 'Sexta-feira, 15h no auditório', time: 'há 3h' },
];

export default function NotificationsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full ring-2 ring-background" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="font-semibold">Notificações</div>
          <div className="text-xs text-muted-foreground">Você tem 3 novas</div>
        </div>
        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          {MOCK_NOTIFICATIONS.map((n) => (
            <div key={n.id} className="p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex gap-3">
                <n.icon className={`w-5 h-5 shrink-0 mt-0.5 ${n.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
                  <div className="text-[10px] text-muted-foreground mt-1.5">{n.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs">Ver todas</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}