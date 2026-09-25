import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { announcementsApi } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const PRIORITY_BORDER = {
  baixa: 'border-l-gray-400',
  normal: 'border-l-sky-500',
  alta: 'border-l-amber-500',
  urgente: 'border-l-red-500',
};

export default function PortalAnnouncements() {
  const { data: announcements = [] } = useQuery({ queryKey: ['announcements'], queryFn: announcementsApi.list });

  return (
    <div>
      <PageHeader title="Mural de Comunicados" subtitle="Avisos da escola" icon={Bell} />

      {announcements.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl premium-shadow">
          <EmptyState icon={Bell} title="Sem comunicados" description="Você será notificado quando houver novos avisos." />
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn('bg-card border border-border border-l-4 rounded-2xl p-6 premium-shadow hover:premium-shadow-lg transition-all', PRIORITY_BORDER[a.priority] || PRIORITY_BORDER.normal)}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-serif text-xl font-semibold">{a.title}</h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    {a.author_name || 'Direção'} • {a.created_date && format(new Date(a.created_date), "dd 'de' MMM", { locale: ptBR })}
                  </div>
                </div>
                {a.priority === 'urgente' && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-red-500/10 text-red-700 dark:text-red-400">Urgente</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{a.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}