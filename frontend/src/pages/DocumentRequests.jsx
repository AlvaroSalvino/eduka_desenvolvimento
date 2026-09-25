import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FolderOpen, Plus, Search, Filter, Clock, CheckCircle2, FileText,
  AlertCircle, Upload, Eye, X, ChevronDown, Send, Paperclip, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import StatCard from '@/components/shared/StatCard';
import { documentsApi, uploadApi } from '@/services/api';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  solicitado:  { label: 'Solicitado',   color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',  dot: 'bg-amber-500' },
  em_analise:  { label: 'Em análise',   color: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',           dot: 'bg-sky-500' },
  aprovado:    { label: 'Aprovado',     color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', dot: 'bg-emerald-500' },
  entregue:    { label: 'Entregue',     color: 'bg-primary/10 text-primary',                                              dot: 'bg-primary' },
  rejeitado:   { label: 'Rejeitado',    color: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',            dot: 'bg-red-500' },
};

const TYPE_LABELS = {
  declaracao_escolar: 'Declaração Escolar',
  historico: 'Histórico Escolar',
  contrato: 'Contrato',
  boletim: 'Boletim',
  certificado: 'Certificado',
  outro: 'Outro',
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'bg-muted text-muted-foreground', dot: 'bg-gray-400' };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', cfg.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  );
}

function DeadlineBadge({ createdDate }) {
  if (!createdDate) return null;
  const days = differenceInDays(new Date(), new Date(createdDate));
  if (days <= 2) return <span className="text-xs text-emerald-600 font-medium">Recente</span>;
  if (days <= 5) return <span className="text-xs text-amber-600 font-medium flex items-center gap-1"><Clock className="w-3 h-3" />{days}d</span>;
  return <span className="text-xs text-red-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" />{days}d em aberto</span>;
}

export default function DocumentRequests() {
  const qc = useQueryClient();
  const { data: documents = [], isLoading } = useQuery({ queryKey: ['documents'], queryFn: documentsApi.list });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [newRequestOpen, setNewRequestOpen] = useState(false);

  // Stats
  const stats = useMemo(() => ({
    total: documents.length,
    pending: documents.filter((d) => d.status === 'solicitado').length,
    inAnalysis: documents.filter((d) => d.status === 'em_analise').length,
    delivered: documents.filter((d) => d.status === 'entregue').length,
  }), [documents]);

  // Filtered list
  const filtered = useMemo(() => {
    return documents.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch = !q || d.student_name?.toLowerCase().includes(q) || d.title?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      const matchType = typeFilter === 'all' || d.document_type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [documents, search, statusFilter, typeFilter]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => documentsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Solicitação atualizada');
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => documentsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] });
      setNewRequestOpen(false);
      toast.success('Solicitação criada');
    },
  });

  const handleStatusChange = (doc, newStatus) => {
    updateMutation.mutate({ id: doc.id, data: { ...doc, status: newStatus } });
    if (selectedDoc?.id === doc.id) setSelectedDoc({ ...selectedDoc, status: newStatus });
  };

  return (
    <div>
      <PageHeader
        title="Solicitações de Documentos"
        subtitle="Gerencie pedidos, prazos e envio de documentos escolares"
        icon={FolderOpen}
        actions={
          <Button onClick={() => setNewRequestOpen(true)} className="bg-primary">
            <Plus className="w-4 h-4 mr-1.5" />Nova Solicitação
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={stats.total} icon={FileText} accent="primary" delay={0} />
        <StatCard label="Aguardando" value={stats.pending} icon={Clock} accent="warning" delay={0.05} />
        <StatCard label="Em análise" value={stats.inAnalysis} icon={Eye} accent="sky" delay={0.1} />
        <StatCard label="Entregues" value={stats.delivered} icon={CheckCircle2} accent="success" delay={0.15} />
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6 premium-shadow">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por aluno ou documento..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([v, c]) => <SelectItem key={v} value={v}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {Object.entries(TYPE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden premium-shadow">
        {isLoading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted/40 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={FolderOpen} title="Nenhuma solicitação" description="Nenhum pedido de documento encontrado para os filtros aplicados." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  {['Aluno', 'Tipo', 'Documento', 'Solicitado em', 'Prazo', 'Status', 'Ações'].map((h) => (
                    <th key={h} className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground py-3 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                          {d.student_name?.charAt(0) || '?'}
                        </div>
                        <span className="font-medium truncate max-w-[140px]">{d.student_name || '—'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{TYPE_LABELS[d.document_type] || d.document_type}</td>
                    <td className="py-3 px-4 font-medium">{d.title}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {d.created_date ? format(new Date(d.created_date), 'dd/MM/yyyy', { locale: ptBR }) : '—'}
                    </td>
                    <td className="py-3 px-4"><DeadlineBadge createdDate={d.created_date} /></td>
                    <td className="py-3 px-4"><StatusBadge status={d.status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setSelectedDoc(d)}>
                          <Eye className="w-3.5 h-3.5 mr-1" />Detalhes
                        </Button>
                        <StatusDropdown doc={d} onStatusChange={handleStatusChange} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Action modal */}
      {selectedDoc && (
        <DetailModal
          doc={selectedDoc}
          onClose={() => setSelectedDoc(null)}
          onStatusChange={handleStatusChange}
          onSaveNotes={(notes) => {
            updateMutation.mutate({ id: selectedDoc.id, data: { ...selectedDoc, notes } });
            setSelectedDoc({ ...selectedDoc, notes });
          }}
          onUploadFile={async (file) => {
            const { file_url } = await uploadApi.file(file);

            updateMutation.mutate({
              id: selectedDoc.id,
              data: { ...selectedDoc, file_url, status: 'entregue' }
            });

            setSelectedDoc({
              ...selectedDoc,
              file_url,
              status: 'entregue'
            });
          }}
        />
      )}

      {/* New request modal */}
      <NewRequestModal
        open={newRequestOpen}
        onClose={() => setNewRequestOpen(false)}
        onCreate={(data) => createMutation.mutate(data)}
      />
    </div>
  );
}

/* ── Status quick-change dropdown ── */
function StatusDropdown({ doc, onStatusChange }) {
  return (
    <Select value={doc.status} onValueChange={(v) => onStatusChange(doc, v)}>
      <SelectTrigger className="h-7 text-xs w-[130px] border-border">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_CONFIG).map(([v, c]) => (
          <SelectItem key={v} value={v}>{c.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ── Detail Modal ── */
function DetailModal({ doc, onClose, onStatusChange, onSaveNotes, onUploadFile }) {
  const [notes, setNotes] = useState(doc.notes || '');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onUploadFile(file);
    setUploading(false);
    toast.success('Documento enviado e status atualizado para Entregue');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {doc.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-xl p-4">
            <InfoRow label="Aluno" value={doc.student_name || '—'} />
            <InfoRow label="Tipo" value={TYPE_LABELS[doc.document_type] || doc.document_type} />
            <InfoRow label="Solicitado por" value={doc.requested_by || '—'} />
            <InfoRow label="Solicitado em" value={doc.created_date ? format(new Date(doc.created_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : '—'} />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label>Status da solicitação</Label>
            <Select value={doc.status} onValueChange={(v) => onStatusChange(doc, v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_CONFIG).map(([v, c]) => (
                  <SelectItem key={v} value={v}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label>Observações internas</Label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações, pendências ou justificativas..."
            />
            <Button variant="outline" size="sm" onClick={() => onSaveNotes(notes)}>
              Salvar observações
            </Button>
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <Label>Enviar documento</Label>
            {doc.file_url ? (
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Documento enviado</div>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-600 underline truncate block">
                    Visualizar arquivo
                  </a>
                </div>
              </div>
            ) : (
              <label className={cn(
                'flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-6 cursor-pointer',
                'hover:bg-muted/30 transition-colors',
                uploading && 'opacity-60 pointer-events-none'
              )}>
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-7 h-7 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {uploading ? 'Enviando...' : 'Clique para enviar o documento (PDF, DOC, imagem)'}
                </span>
                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleUpload} disabled={uploading} />
              </label>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── New Request Modal ── */
function NewRequestModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({ student_name: '', document_type: 'declaracao_escolar', title: '', requested_by: '', notes: '', status: 'solicitado' });

  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.student_name || !form.title) return;
    onCreate(form);
    setForm({ student_name: '', document_type: 'declaracao_escolar', title: '', requested_by: '', notes: '', status: 'solicitado' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Nova Solicitação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Nome do aluno *</Label>
            <Input required value={form.student_name} onChange={(e) => u('student_name', e.target.value)} placeholder="Nome completo" />
          </div>
          <div className="space-y-1.5">
            <Label>Tipo de documento *</Label>
            <Select value={form.document_type} onValueChange={(v) => u('document_type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(TYPE_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Título / Descrição *</Label>
            <Input required value={form.title} onChange={(e) => u('title', e.target.value)} placeholder="Ex: Declaração de matrícula 2025" />
          </div>
          <div className="space-y-1.5">
            <Label>Solicitado por</Label>
            <Input value={form.requested_by} onChange={(e) => u('requested_by', e.target.value)} placeholder="Nome do responsável ou aluno" />
          </div>
          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => u('notes', e.target.value)} placeholder="Informações adicionais..." />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-primary"><Send className="w-4 h-4 mr-1.5" />Criar solicitação</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}