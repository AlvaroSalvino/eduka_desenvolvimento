import React from 'react';
import { useIes } from '@/hooks/useIes';
import { Wallet, TrendingUp, CalendarCheck, Bell, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import { invoicesApi, announcementsApi } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PortalDashboard() {
  const { nomeIes } = useIes();
  const { data: invoices = [] } = useQuery({ queryKey: ['invoices'], queryFn: invoicesApi.list });
  const { data: announcements = [] } = useQuery({ queryKey: ['announcements'], queryFn: announcementsApi.list });

  const nextInvoice = invoices.find((i) => i.status === 'pendente');

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Olá, bem-vindo(a) ao Portal 👋`}
        subtitle="Acompanhe notas, frequência, financeiro e comunicados"
      />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl gradient-primary text-primary-foreground p-8 md:p-12 premium-shadow-lg"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="relative max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">{nomeIes ?? 'Eduka'}</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            Tudo o que você precisa em um só lugar
          </h2>
          <p className="text-primary-foreground/70">
            Boletim, boletos, comunicados, calendário e muito mais — com acesso fácil e seguro.
          </p>
        </div>
      </motion.div>

      {/* Quick cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickCard
          to="/portal/financeiro"
          icon={Wallet}
          label="Próximo vencimento"
          value={nextInvoice ? format(new Date(nextInvoice.due_date), 'dd MMM', { locale: ptBR }) : 'Em dia'}
          sub={nextInvoice ? `R$ ${nextInvoice.amount.toFixed(2)}` : 'Parabéns!'}
          color="from-emerald-500 to-emerald-600"
          delay={0}
        />
        <QuickCard
          to="/portal/notas"
          icon={TrendingUp}
          label="Média geral"
          value="8,7"
          sub="↑ 0,3 vs bimestre anterior"
          color="from-primary to-primary/80"
          delay={0.05}
        />
        <QuickCard
          to="/portal/frequencia"
          icon={CalendarCheck}
          label="Frequência"
          value="96%"
          sub="Excelente assiduidade"
          color="from-accent to-yellow-600"
          delay={0.1}
        />
        <QuickCard
          to="/portal/comunicados"
          icon={Bell}
          label="Novos avisos"
          value={announcements.length}
          sub="Veja os últimos comunicados"
          color="from-sky-500 to-sky-600"
          delay={0.15}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Próximas aulas/atividades */}
        <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg font-semibold mb-4">Boletim resumido</h3>
          <div className="space-y-3">
            {['Matemática', 'Português', 'História', 'Ciências'].map((s, i) => {
              const grade = (7 + Math.random() * 2.5).toFixed(1);
              return (
                <div key={s} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="font-medium text-sm">{s}</div>
                  </div>
                  <div className="font-serif text-xl font-bold">{grade}</div>
                </div>
              );
            })}
          </div>
          <Link to="/portal/notas" className="mt-4 flex items-center justify-center gap-1.5 text-sm text-primary font-medium hover:underline">
            Ver boletim completo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Comunicados recentes */}
        <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
          <h3 className="font-serif text-lg font-semibold mb-4">Comunicados recentes</h3>
          <div className="space-y-3">
            {announcements.slice(0, 4).map((a) => (
              <div key={a.id} className="p-3 bg-muted/30 rounded-xl">
                <div className="font-medium text-sm">{a.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{a.content}</div>
              </div>
            ))}
            {announcements.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">Sem comunicados</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickCard({ to, icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Link to={to} className="block bg-card border border-border rounded-2xl p-5 premium-shadow hover:premium-shadow-lg transition-all group relative overflow-hidden">
        <div className={`absolute -top-10 -right-10 w-28 h-28 bg-gradient-to-br ${color} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity`} />
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</div>
        <div className="font-serif text-2xl font-bold mt-1">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </Link>
    </motion.div>
  );
}