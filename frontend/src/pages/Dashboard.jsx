import React from 'react';
import { useIes } from '@/hooks/useIes';
import { Users, Wallet, AlertTriangle, GraduationCap, Briefcase, Receipt, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import PageHeader from '@/components/shared/PageHeader';
import StatCard from '@/components/shared/StatCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { studentsApi, invoicesApi, classesApi, employeesApi, announcementsApi } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const REVENUE_DATA = [
  { mes: 'Set', receita: 185000, meta: 200000 },
  { mes: 'Out', receita: 198000, meta: 200000 },
  { mes: 'Nov', receita: 212000, meta: 210000 },
  { mes: 'Dez', receita: 205000, meta: 210000 },
  { mes: 'Jan', receita: 228000, meta: 220000 },
  { mes: 'Fev', receita: 241000, meta: 230000 },
  { mes: 'Mar', receita: 253000, meta: 240000 },
];

const ATTENDANCE_DATA = [
  { serie: '1º Ano', freq: 96 },
  { serie: '2º Ano', freq: 94 },
  { serie: '3º Ano', freq: 92 },
  { serie: '4º Ano', freq: 95 },
  { serie: '5º Ano', freq: 93 },
  { serie: '6º Ano', freq: 91 },
];

export default function Dashboard() {
  const { nomeIes } = useIes();
  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: studentsApi.list });
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list });
  const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: classesApi.list });
  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: employeesApi.list });
  const { data: announcements = [] } = useQuery({ queryKey: ['announcements'], queryFn: announcementsApi.list });

  const paidCount = invoices.filter((i) => i.status === 'pago').length;
  const overdueCount = invoices.filter((i) => i.status === 'atrasado').length;
  const teachers = employees.filter((e) => e.role === 'professor').length;

  const studentsByGrade = students.reduce((acc, s) => {
    const k = s.grade_level || 'Não definido';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(studentsByGrade).slice(0, 6).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = ['hsl(222 65% 24%)', 'hsl(42 45% 58%)', 'hsl(199 89% 48%)', 'hsl(142 71% 45%)', 'hsl(280 65% 60%)', 'hsl(0 72% 51%)'];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Bem-vindo de volta"
        subtitle={`Hoje é ${format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`}
      />

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-primary text-primary-foreground p-8 md:p-10 premium-shadow-lg"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium mb-4 text-white">
            <TrendingUp className="w-3.5 h-3.5" />
            Desempenho institucional
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2 max-w-2xl text-white">
            {nomeIes ?? 'Eduka'} está crescendo 12% este semestre
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl text-white">
            Acompanhe os principais indicadores acadêmicos, financeiros e administrativos em tempo real.
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Alunos" value={students.length} icon={Users} trend="up" trendValue="+8%" accent="primary" delay={0} />
        <StatCard label="Mensal. Pagas" value={paidCount} icon={Receipt} trend="up" trendValue="+12%" accent="success" delay={0.05} />
        <StatCard label="Inadimplentes" value={overdueCount} icon={AlertTriangle} trend="down" trendValue="-3%" accent="danger" delay={0.1} />
        <StatCard label="Turmas" value={classes.length} icon={GraduationCap} accent="sky" delay={0.15} />
        <StatCard label="Professores" value={teachers} icon={Briefcase} accent="gold" delay={0.2} />
        <StatCard label="Avisos" value={announcements.length} icon={Wallet} accent="warning" delay={0.25} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 premium-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-lg font-semibold">Receita mensal</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 7 meses — em reais</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(222 65% 24%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(222 65% 24%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12 }}
                formatter={(v) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Receita']}
              />
              <Area type="monotone" dataKey="receita" stroke="hsl(222 65% 24%)" strokeWidth={2.5} fill="url(#rev)" />
              <Area type="monotone" dataKey="meta" stroke="hsl(42 45% 58%)" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg font-semibold mb-1">Alunos por série</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribuição atual</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-sm text-muted-foreground">Sem dados</div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg font-semibold mb-1">Frequência média por série</h3>
          <p className="text-xs text-muted-foreground mb-4">Últimos 30 dias</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ATTENDANCE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="serie" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12 }} formatter={(v) => [`${v}%`, 'Frequência']} />
              <Bar dataKey="freq" fill="hsl(42 45% 58%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-semibold">Últimas matrículas</h3>
          </div>
          <div className="space-y-3">
            {students.slice(0, 5).map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                  {s.full_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{s.full_name}</div>
                  <div className="text-xs text-muted-foreground">{s.grade_level} • {s.class_name}</div>
                </div>
                <StatusBadge status={s.status || 'ativo'} />
              </motion.div>
            ))}
            {students.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">Nenhum aluno cadastrado</div>}
          </div>
        </div>
      </div>
    </div>
  );
}