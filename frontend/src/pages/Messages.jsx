import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Send, Bell, Users, GraduationCap, User, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import { announcementsApi, studentsApi, guardiansApi, employeesApi } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const PRIORITY_COLORS = {
  baixa: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-400',
  normal: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
  alta: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  urgente: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400',
};

const RECIPIENT_TYPES = [
  { value: 'aluno', label: 'Aluno', color: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400' },
  { value: 'responsavel', label: 'Responsável', color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' },
  { value: 'professor', label: 'Professor', color: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400' },
  { value: 'financeiro', label: 'Financeiro', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' },
  { value: 'secretaria', label: 'Secretaria', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' },
  { value: 'coordenacao', label: 'Coordenação', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' },
  { value: 'diretoria', label: 'Diretoria', color: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
];

export default function Messages() {
  const { data: announcements = [], refetch } = useQuery({ queryKey: ['announcements'], queryFn: announcementsApi.list });
  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: studentsApi.list });
  const { data: guardians = [] } = useQuery({ queryKey: ['guardians'], queryFn: guardiansApi.list });
  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: employeesApi.list });

  const [form, setForm] = useState({ title: '', content: '', target_type: 'geral', priority: 'normal', target_id: '' });
  const [recipientType, setRecipientType] = useState('aluno');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState(null);

  // Monta lista de candidatos conforme o tipo selecionado
  const recipientCandidates = useMemo(() => {
    const q = recipientSearch.toLowerCase();
    if (recipientType === 'aluno') {
      return students
        .filter((s) => !q || s.full_name?.toLowerCase().includes(q))
        .map((s) => ({ id: s.id, name: s.full_name, detail: `${s.grade_level || ''}${s.class_name ? ' ' + s.class_name : ''}` }));
    }
    if (recipientType === 'responsavel') {
      return guardians
        .filter((g) => !q || g.full_name?.toLowerCase().includes(q))
        .map((g) => ({ id: g.id, name: g.full_name, detail: g.email || '' }));
    }
    // Para professores / financeiro / secretaria / coordenacao / diretoria → employees
    return employees
      .filter((e) => e.role === recipientType && (!q || e.full_name?.toLowerCase().includes(q)))
      .map((e) => ({ id: e.id, name: e.full_name, detail: e.department || e.role || '' }));
  }, [recipientType, recipientSearch, students, guardians, employees]);

  const handleTargetTypeChange = (v) => {
    setForm({ ...form, target_type: v, target_id: '' });
    setSelectedRecipient(null);
    setRecipientSearch('');
  };

  const handleSelectRecipient = (person) => {
    setSelectedRecipient(person);
    setForm((f) => ({ ...f, target_id: person.id }));
    setRecipientSearch('');
  };

  const handleClearRecipient = () => {
    setSelectedRecipient(null);
    setForm((f) => ({ ...f, target_id: '' }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    if (form.target_type === 'individual' && !form.target_id) {
      toast.error('Selecione um destinatário individual');
      return;
    }
    await announcementsApi.create({ ...form, author_name: 'Secretaria', publish_date: new Date().toISOString().slice(0, 10) });
    toast.success('Comunicado enviado');
    setForm({ title: '', content: '', target_type: 'geral', priority: 'normal', target_id: '' });
    setSelectedRecipient(null);
    setRecipientSearch('');
    refetch();
  };

  return (
    <div>
      <PageHeader title="Comunicação" subtitle="Envie avisos e comunicados internos" icon={MessageSquare} />

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Inbox */}
        <div className="bg-card border border-border rounded-2xl premium-shadow">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Caixa de entrada</h3>
            <span className="text-xs text-muted-foreground">{announcements.length} mensagens</span>
          </div>
          {announcements.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">Nenhum comunicado</div>
          ) : (
            <div className="divide-y">
              {announcements.map((a) => (
                <div key={a.id} className="p-5 hover:bg-muted/30 cursor-pointer">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider', PRIORITY_COLORS[a.priority] || PRIORITY_COLORS.normal)}>
                          {a.priority || 'normal'}
                        </span>
                        <TargetBadge type={a.target_type} />
                      </div>
                      <div className="font-semibold">{a.title}</div>
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.content}</div>
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {a.created_date && format(new Date(a.created_date), 'dd MMM', { locale: ptBR })}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Por {a.author_name || 'Sistema'}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <form onSubmit={handleSend} className="bg-card border border-border rounded-2xl p-6 premium-shadow h-fit space-y-4">
          <h3 className="font-serif text-lg font-semibold">Novo comunicado</h3>
          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Assunto..." required />
          </div>
          <div className="space-y-1.5">
            <Label>Mensagem</Label>
            <Textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Escreva a mensagem..." required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Destinatário</Label>
              <Select value={form.target_type} onValueChange={handleTargetTypeChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="turma">Turma</SelectItem>
                  <SelectItem value="serie">Série</SelectItem>
                  <SelectItem value="responsaveis">Responsáveis</SelectItem>
                  <SelectItem value="professores">Professores</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Prioridade</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Seletor de destinatário individual */}
          {form.target_type === 'individual' && (
            <div className="space-y-2 border border-border rounded-xl p-3 bg-muted/30">
              {/* Filtro por tipo */}
              <div className="flex flex-wrap gap-1.5">
                {RECIPIENT_TYPES.map((rt) => (
                  <button
                    key={rt.value}
                    type="button"
                    onClick={() => { setRecipientType(rt.value); setSelectedRecipient(null); setRecipientSearch(''); setForm((f) => ({ ...f, target_id: '' })); }}
                    className={cn(
                      'text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all',
                      recipientType === rt.value
                        ? rt.color + ' border-transparent'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {rt.label}
                  </button>
                ))}
              </div>

              {/* Pessoa selecionada */}
              {selectedRecipient ? (
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                  <div>
                    <div className="text-sm font-semibold">{selectedRecipient.name}</div>
                    {selectedRecipient.detail && <div className="text-xs text-muted-foreground">{selectedRecipient.detail}</div>}
                  </div>
                  <button type="button" onClick={handleClearRecipient} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Busca */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={`Buscar ${RECIPIENT_TYPES.find(r => r.value === recipientType)?.label.toLowerCase()}...`}
                      value={recipientSearch}
                      onChange={(e) => setRecipientSearch(e.target.value)}
                      className="pl-8 h-8 text-sm"
                    />
                  </div>
                  {/* Lista de resultados */}
                  {recipientCandidates.length > 0 && (
                    <div className="max-h-40 overflow-y-auto divide-y divide-border rounded-lg border border-border bg-background">
                      {recipientCandidates.slice(0, 20).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectRecipient(p)}
                          className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors"
                        >
                          <div className="text-sm font-medium">{p.name}</div>
                          {p.detail && <div className="text-xs text-muted-foreground">{p.detail}</div>}
                        </button>
                      ))}
                    </div>
                  )}
                  {recipientCandidates.length === 0 && recipientSearch && (
                    <p className="text-xs text-muted-foreground text-center py-2">Nenhum resultado encontrado</p>
                  )}
                </>
              )}
            </div>
          )}
          <Button type="submit" className="w-full bg-primary"><Send className="w-4 h-4 mr-1.5" />Enviar comunicado</Button>
        </form>
      </div>
    </div>
  );
}

function TargetBadge({ type }) {
  const icons = { geral: Bell, turma: Users, serie: GraduationCap, individual: User, responsaveis: User, professores: User };
  const Icon = icons[type] || Bell;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground capitalize">
      <Icon className="w-3 h-3" />
      {type || 'geral'}
    </span>
  );
}