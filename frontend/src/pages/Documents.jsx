import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FolderOpen, Plus, FileText, Download, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import StatCard from '@/components/shared/StatCard';
import { documentsApi } from '@/services/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const STATUS_COLORS = {
  solicitado: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  em_analise: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  aprovado: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  entregue: 'bg-primary/10 text-primary',
  rejeitado: 'bg-red-500/10 text-red-700 dark:text-red-400',
};

const TYPE_LABELS = {
  declaracao_escolar: 'Declaração Escolar', historico: 'Histórico',
  contrato: 'Contrato', boletim: 'Boletim', certificado: 'Certificado', outro: 'Outro',
};

export default function Documents() {
  const { data: documents = [], isLoading } = useQuery({ queryKey: ['documents'], queryFn: documentsApi.list });

  const pending = documents.filter((d) => d.status === 'solicitado' || d.status === 'em_analise').length;
  const approved = documents.filter((d) => d.status === 'aprovado' || d.status === 'entregue').length;

  return (
    <div>
      <PageHeader
        title="Documentos"
        subtitle="Solicitações e emissão de documentos escolares"
        icon={FolderOpen}
        actions={<Button className="bg-primary"><Plus className="w-4 h-4 mr-1.5" />Nova Solicitação</Button>}
      />

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total" value={documents.length} icon={FileText} accent="primary" delay={0} />
        <StatCard label="Pendentes" value={pending} icon={Clock} accent="warning" delay={0.05} />
        <StatCard label="Aprovados" value={approved} icon={CheckCircle2} accent="success" delay={0.1} />
      </div>

      <div className="bg-card border border-border rounded-2xl premium-shadow">
        {isLoading ? (
          <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted/40 rounded-xl animate-pulse" />)}</div>
        ) : documents.length === 0 ? (
          <EmptyState icon={FolderOpen} title="Sem documentos" description="Aguardando solicitações de documentos." />
        ) : (
          <div className="divide-y">
            {documents.map((d) => (
              <div key={d.id} className="p-5 flex items-center gap-4 hover:bg-muted/30">
                <div className="w-11 h-11 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{d.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {TYPE_LABELS[d.document_type] || d.document_type}
                    {d.student_name && ` • ${d.student_name}`}
                    {d.created_date && ` • ${format(new Date(d.created_date), 'dd/MM/yyyy')}`}
                  </div>
                </div>
                <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full capitalize', STATUS_COLORS[d.status] || 'bg-muted')}>
                  {d.status?.replace('_', ' ')}
                </span>
                <Button variant="ghost" size="icon"><Download className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}