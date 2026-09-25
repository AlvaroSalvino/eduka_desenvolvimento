import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentPlansApi, registrationFeesApi, monthlyFeesApi, discountsApi } from '@/services/api';
import {
  CreditCard, Plus, Search, Eye, Pencil, Trash2, CheckCircle2, X,
  Tag, BookOpen, Receipt, Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import StatCard from '@/components/shared/StatCard';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ── API helpers ──────────────────────────────────────────────────
const api = {
  plans: {
    list: paymentPlansApi.list,
    create: paymentPlansApi.create,
    update: paymentPlansApi.update,
    delete: paymentPlansApi.delete,
  },
  registrations: {
    list: registrationFeesApi.list,
    create: registrationFeesApi.create,
    update: registrationFeesApi.update,
    delete: registrationFeesApi.delete,
  },
  monthly: {
    list: monthlyFeesApi.list,
    create: monthlyFeesApi.create,
    update: monthlyFeesApi.update,
    delete: monthlyFeesApi.delete,
  },
  discounts: {
    list: discountsApi.list,
    create: discountsApi.create,
    update: discountsApi.update,
    delete: discountsApi.delete,
  },
};

// ── Formatters ───────────────────────────────────────────────────
const BRL = (v) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const LEVEL_LABELS = {
  infantil: 'Ed. Infantil', fundamental_1: 'Fund. I', fundamental_2: 'Fund. II',
  medio: 'Ens. Médio', tecnico: 'Técnico', graduacao: 'Graduação', pos_graduacao: 'Pós-Graduação',
};

const STATUS_COLORS = {
  ativo:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  inativo:  'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400',
  suspenso: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
};

function calcFinal(amount, discount) {
  if (!discount || !amount) return amount ?? 0;
  if (discount.type === 'percentual') return amount * (1 - discount.value / 100);
  return Math.max(0, amount - discount.value);
}

// ── Main Page ────────────────────────────────────────────────────
export default function PaymentPlans() {
  const [tab, setTab] = useState('planos');
  const [search, setSearch] = useState('');
  const [planModal, setPlanModal] = useState(null); // null | 'new' | plan obj

  const qc = useQueryClient();
  const { data: plans = [], isLoading: loadingPlans } = useQuery({ queryKey: ['payment-plans'], queryFn: api.plans.list });
  const { data: registrations = [] } = useQuery({ queryKey: ['registration-fees'], queryFn: api.registrations.list });
  const { data: monthly = [] } = useQuery({ queryKey: ['monthly-fees'], queryFn: api.monthly.list });
  const { data: discounts = [] } = useQuery({ queryKey: ['discounts'], queryFn: api.discounts.list });

  const deletePlan = useMutation({
    mutationFn: (id) => api.plans.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['payment-plans'] }); toast.success('Plano removido'); },
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return plans.filter((p) => !q || p.name?.toLowerCase().includes(q) || p.student_name?.toLowerCase().includes(q));
  }, [plans, search]);

  const totalMonthly = plans.reduce((s, p) => s + (p.monthly_final_amount ?? 0), 0);
  const totalRegistration = plans.reduce((s, p) => s + (p.registration_final_amount ?? 0), 0);
  const active = plans.filter((p) => p.status === 'ativo').length;

  return (
    <div>
      <PageHeader
        title="Planos de Pagamento"
        subtitle="Gerencie matrículas, mensalidades e descontos por aluno"
        icon={CreditCard}
        actions={tab === 'planos' && (
          <Button onClick={() => setPlanModal('new')} className="bg-primary">
            <Plus className="w-4 h-4 mr-1.5" />Novo Plano
          </Button>
        )}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Planos ativos" value={active} icon={CreditCard} accent="primary" delay={0} />
        <StatCard label="Total planos" value={plans.length} icon={CheckCircle2} accent="success" delay={0.05} />
        <StatCard label="Receita matrículas" value={BRL(totalRegistration)} icon={Receipt} accent="warning" delay={0.1} />
        <StatCard label="Receita mensal" value={BRL(totalMonthly)} icon={Percent} accent="sky" delay={0.15} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="planos"><CreditCard className="w-4 h-4 mr-1.5" />Planos</TabsTrigger>
          <TabsTrigger value="matriculas"><Receipt className="w-4 h-4 mr-1.5" />Matrículas</TabsTrigger>
          <TabsTrigger value="mensalidades"><BookOpen className="w-4 h-4 mr-1.5" />Mensalidades</TabsTrigger>
          <TabsTrigger value="descontos"><Tag className="w-4 h-4 mr-1.5" />Descontos</TabsTrigger>
        </TabsList>

        {/* ── PLANOS ── */}
        <TabsContent value="planos">
          <div className="bg-card border border-border rounded-2xl premium-shadow">
            <div className="p-4 border-b">
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar plano ou aluno..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
            {loadingPlans ? (
              <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted/40 rounded-xl animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
              <EmptyState icon={CreditCard} title="Nenhum plano" description="Crie o primeiro plano de pagamento clicando em 'Novo Plano'." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      {['Plano / Aluno', 'Matrícula', 'Mensalidade', 'Desconto Matr.', 'Desconto Mens.', 'Status', 'Ações'].map((h) => (
                        <th key={h} className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground py-3 px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold">{p.name}</div>
                          {p.student_name && <div className="text-xs text-muted-foreground">{p.student_name}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{BRL(p.registration_final_amount ?? p.registration_fee_amount)}</div>
                          {p.registration_fee_name && <div className="text-xs text-muted-foreground truncate max-w-[120px]">{p.registration_fee_name}</div>}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{BRL(p.monthly_final_amount ?? p.monthly_fee_amount)}</div>
                          {p.monthly_fee_name && <div className="text-xs text-muted-foreground truncate max-w-[120px]">{p.monthly_fee_name}</div>}
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{p.registration_discount_name || '—'}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">{p.monthly_discount_name || '—'}</td>
                        <td className="py-3 px-4">
                          <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold capitalize', STATUS_COLORS[p.status] || 'bg-muted')}>{p.status}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPlanModal(p)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deletePlan.mutate(p.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── MATRÍCULAS ── */}
        <TabsContent value="matriculas">
          <FeeTable
            title="Taxas de Matrícula"
            data={registrations}
            queryKey="registration-fees"
            apiFn={api.registrations}
            fields={[
              { key: 'name', label: 'Nome', required: true },
              { key: 'amount', label: 'Valor (R$)', type: 'number', required: true },
              { key: 'year', label: 'Ano', type: 'number' },
              { key: 'education_level', label: 'Nível', type: 'level' },
              { key: 'description', label: 'Descrição', type: 'textarea' },
            ]}
          />
        </TabsContent>

        {/* ── MENSALIDADES ── */}
        <TabsContent value="mensalidades">
          <FeeTable
            title="Mensalidades"
            data={monthly}
            queryKey="monthly-fees"
            apiFn={api.monthly}
            fields={[
              { key: 'name', label: 'Nome', required: true },
              { key: 'amount', label: 'Valor (R$)', type: 'number', required: true },
              { key: 'year', label: 'Ano', type: 'number' },
              { key: 'education_level', label: 'Nível', type: 'level' },
              { key: 'due_day', label: 'Dia de vencimento', type: 'number' },
              { key: 'description', label: 'Descrição', type: 'textarea' },
            ]}
          />
        </TabsContent>

        {/* ── DESCONTOS ── */}
        <TabsContent value="descontos">
          <DiscountsTable data={discounts} />
        </TabsContent>
      </Tabs>

      {/* Plan modal */}
      {planModal !== null && (
        <PlanModal
          plan={planModal === 'new' ? null : planModal}
          registrations={registrations}
          monthly={monthly}
          discounts={discounts}
          onClose={() => setPlanModal(null)}
          onSave={async (data) => {
            if (planModal === 'new') await api.plans.create(data);
            else await api.plans.update(planModal.id, data);
            qc.invalidateQueries({ queryKey: ['payment-plans'] });
            setPlanModal(null);
            toast.success(planModal === 'new' ? 'Plano criado!' : 'Plano atualizado!');
          }}
        />
      )}
    </div>
  );
}

// ── Generic Fee Table ────────────────────────────────────────────
function FeeTable({ data, queryKey, apiFn, fields }) {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);

  const saveMutation = useMutation({
    mutationFn: async (form) => {
      if (form.id) return apiFn.update(form.id, form);
      return apiFn.create(form);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setModal(null); toast.success('Salvo!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiFn.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); toast.success('Removido!'); },
  });

  return (
    <div className="bg-card border border-border rounded-2xl premium-shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">{data.length} registro(s)</span>
        <Button size="sm" onClick={() => setModal({})} className="bg-primary">
          <Plus className="w-4 h-4 mr-1" />Novo
        </Button>
      </div>
      {data.length === 0 ? (
        <EmptyState icon={Receipt} title="Nenhum registro" description="Clique em 'Novo' para adicionar." />
      ) : (
        <div className="divide-y">
          {data.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20">
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {BRL(item.amount)}
                  {item.education_level && ` • ${LEVEL_LABELS[item.education_level] || item.education_level}`}
                  {item.year && ` • ${item.year}`}
                  {item.due_day && ` • Vence dia ${item.due_day}`}
                </div>
              </div>
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', item.status === 'ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-600')}>{item.status || 'ativo'}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModal(item)}><Pencil className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <FeeModal
          item={modal}
          fields={fields}
          onClose={() => setModal(null)}
          onSave={(form) => saveMutation.mutate(form)}
        />
      )}
    </div>
  );
}

// ── Discounts Table ──────────────────────────────────────────────
function DiscountsTable({ data }) {
  const qc = useQueryClient();
  const [modal, setModal] = useState(null);

  const saveMutation = useMutation({
    mutationFn: async (form) => {
      if (form.id) return api.discounts.update(form.id, form);
      return api.discounts.create(form);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['discounts'] }); setModal(null); toast.success('Salvo!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.discounts.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['discounts'] }); toast.success('Removido!'); },
  });

  const APPLIES = { matricula: 'Matrícula', mensalidade: 'Mensalidade', ambos: 'Ambos' };

  return (
    <div className="bg-card border border-border rounded-2xl premium-shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">{data.length} desconto(s)</span>
        <Button size="sm" onClick={() => setModal({})} className="bg-primary">
          <Plus className="w-4 h-4 mr-1" />Novo Desconto
        </Button>
      </div>
      {data.length === 0 ? (
        <EmptyState icon={Tag} title="Nenhum desconto" description="Crie descontos para aplicar nos planos de pagamento." />
      ) : (
        <div className="divide-y">
          {data.map((d) => (
            <div key={d.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/20">
              <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{d.name}</div>
                <div className="text-xs text-muted-foreground">
                  {d.type === 'percentual' ? `${d.value}%` : BRL(d.value)} • Aplica em: {APPLIES[d.applies_to] || d.applies_to}
                  {d.description && ` • ${d.description}`}
                </div>
              </div>
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-semibold', d.status === 'ativo' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-gray-100 text-gray-600')}>{d.status || 'ativo'}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setModal(d)}><Pencil className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(d.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          ))}
        </div>
      )}

      {modal !== null && (
        <Dialog open onOpenChange={() => setModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="font-serif text-xl">{modal.id ? 'Editar Desconto' : 'Novo Desconto'}</DialogTitle></DialogHeader>
            <DiscountForm initial={modal} onSave={(f) => saveMutation.mutate(f)} onCancel={() => setModal(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function DiscountForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ name: '', type: 'percentual', value: '', applies_to: 'mensalidade', description: '', status: 'ativo', ...initial });
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <div className="space-y-4 mt-2">
      <div className="space-y-1.5"><Label>Nome *</Label><Input required value={form.name} onChange={(e) => u('name', e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Tipo</Label>
          <Select value={form.type} onValueChange={(v) => u('type', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentual">Percentual (%)</SelectItem>
              <SelectItem value="fixo">Valor fixo (R$)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Valor *</Label>
          <Input type="number" min="0" value={form.value} onChange={(e) => u('value', Number(e.target.value))} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Aplicar em</Label>
        <Select value={form.applies_to} onValueChange={(v) => u('applies_to', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="matricula">Matrícula</SelectItem>
            <SelectItem value="mensalidade">Mensalidade</SelectItem>
            <SelectItem value="ambos">Ambos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5"><Label>Descrição</Label><Input value={form.description} onChange={(e) => u('description', e.target.value)} /></div>
      <div className="space-y-1.5">
        <Label>Status</Label>
        <Select value={form.status} onValueChange={(v) => u('status', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSave(form)} className="bg-primary">Salvar</Button>
      </DialogFooter>
    </div>
  );
}

// ── Generic Fee Modal ────────────────────────────────────────────
function FeeModal({ item, fields, onClose, onSave }) {
  const [form, setForm] = useState({ status: 'ativo', ...item });
  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="font-serif text-xl">{item.id ? 'Editar' : 'Novo'}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label>{f.label}{f.required ? ' *' : ''}</Label>
              {f.type === 'textarea' ? (
                <Textarea value={form[f.key] || ''} onChange={(e) => u(f.key, e.target.value)} />
              ) : f.type === 'level' ? (
                <Select value={form[f.key] || ''} onValueChange={(v) => u(f.key, v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione o nível" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(LEVEL_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : (
                <Input type={f.type || 'text'} value={form[f.key] || ''} onChange={(e) => u(f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)} />
              )}
            </div>
          ))}
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => u('status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave(form)} className="bg-primary">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Plan Modal ───────────────────────────────────────────────────
function PlanModal({ plan, registrations, monthly, discounts, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', student_name: '', year: new Date().getFullYear(),
    registration_fee_id: '', registration_fee_name: '', registration_fee_amount: 0,
    registration_discount_id: '', registration_discount_name: '', registration_final_amount: 0,
    monthly_fee_id: '', monthly_fee_name: '', monthly_fee_amount: 0,
    monthly_discount_id: '', monthly_discount_name: '', monthly_final_amount: 0,
    notes: '', status: 'ativo',
    ...(plan || {}),
  });

  const u = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const regDiscounts = discounts.filter((d) => d.status === 'ativo' && (d.applies_to === 'matricula' || d.applies_to === 'ambos'));
  const monDiscounts = discounts.filter((d) => d.status === 'ativo' && (d.applies_to === 'mensalidade' || d.applies_to === 'ambos'));

  const handleRegFee = (id) => {
    const fee = registrations.find((r) => r.id === id);
    const disc = discounts.find((d) => d.id === form.registration_discount_id);
    const final = calcFinal(fee?.amount, disc);
    setForm((p) => ({ ...p, registration_fee_id: id, registration_fee_name: fee?.name || '', registration_fee_amount: fee?.amount || 0, registration_final_amount: final }));
  };

  const handleRegDiscount = (id) => {
    const disc = discounts.find((d) => d.id === id);
    const final = calcFinal(form.registration_fee_amount, disc);
    setForm((p) => ({ ...p, registration_discount_id: id, registration_discount_name: disc?.name || '', registration_final_amount: final }));
  };

  const handleMonFee = (id) => {
    const fee = monthly.find((m) => m.id === id);
    const disc = discounts.find((d) => d.id === form.monthly_discount_id);
    const final = calcFinal(fee?.amount, disc);
    setForm((p) => ({ ...p, monthly_fee_id: id, monthly_fee_name: fee?.name || '', monthly_fee_amount: fee?.amount || 0, monthly_final_amount: final }));
  };

  const handleMonDiscount = (id) => {
    const disc = discounts.find((d) => d.id === id);
    const final = calcFinal(form.monthly_fee_amount, disc);
    setForm((p) => ({ ...p, monthly_discount_id: id, monthly_discount_name: disc?.name || '', monthly_final_amount: final }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{plan ? 'Editar Plano' : 'Novo Plano de Pagamento'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-2">
          {/* Identificação */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Identificação</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5"><Label>Nome do plano *</Label><Input value={form.name} onChange={(e) => u('name', e.target.value)} placeholder="Ex: Plano Fundamental I A - 2025" /></div>
              <div className="space-y-1.5"><Label>Aluno</Label><Input value={form.student_name} onChange={(e) => u('student_name', e.target.value)} placeholder="Nome do aluno" /></div>
              <div className="space-y-1.5"><Label>Ano</Label><Input type="number" value={form.year} onChange={(e) => u('year', Number(e.target.value))} /></div>
            </div>
          </section>

          {/* Matrícula */}
          <section className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5"><Receipt className="w-3.5 h-3.5" />Matrícula</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Taxa de matrícula</Label>
                <Select value={form.registration_fee_id} onValueChange={handleRegFee}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {registrations.filter((r) => r.status !== 'inativo').map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name} — {BRL(r.amount)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Desconto na matrícula</Label>
                <Select value={form.registration_discount_id || 'none'} onValueChange={(v) => handleRegDiscount(v === 'none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Sem desconto" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem desconto</SelectItem>
                    {regDiscounts.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name} ({d.type === 'percentual' ? `${d.value}%` : BRL(d.value)})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.registration_fee_amount > 0 && (
              <div className="flex items-center justify-between text-sm bg-white dark:bg-card rounded-lg px-3 py-2 border border-amber-200 dark:border-amber-800">
                <span className="text-muted-foreground">Original: {BRL(form.registration_fee_amount)}</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">Final: {BRL(form.registration_final_amount)}</span>
              </div>
            )}
          </section>

          {/* Mensalidade */}
          <section className="bg-sky-50 dark:bg-sky-950/20 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />Mensalidade</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Mensalidade</Label>
                <Select value={form.monthly_fee_id} onValueChange={handleMonFee}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {monthly.filter((m) => m.status !== 'inativo').map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name} — {BRL(m.amount)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Desconto na mensalidade</Label>
                <Select value={form.monthly_discount_id || 'none'} onValueChange={(v) => handleMonDiscount(v === 'none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Sem desconto" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem desconto</SelectItem>
                    {monDiscounts.map((d) => (
                      <SelectItem key={d.id} value={d.id}>{d.name} ({d.type === 'percentual' ? `${d.value}%` : BRL(d.value)})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.monthly_fee_amount > 0 && (
              <div className="flex items-center justify-between text-sm bg-white dark:bg-card rounded-lg px-3 py-2 border border-sky-200 dark:border-sky-800">
                <span className="text-muted-foreground">Original: {BRL(form.monthly_fee_amount)}</span>
                <span className="font-bold text-sky-700 dark:text-sky-400">Final: {BRL(form.monthly_final_amount)}</span>
              </div>
            )}
          </section>

          {/* Extras */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => u('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Observações</Label><Input value={form.notes} onChange={(e) => u('notes', e.target.value)} /></div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onSave(form)} className="bg-primary" disabled={!form.name}>Salvar plano</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}