import React from 'react';
import { BarChart3, Download, FileText, Users, Wallet, ClipboardCheck, AlertTriangle, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { motion } from 'framer-motion';

const REPORTS = [
  { icon: Wallet, title: 'Relatório Financeiro', desc: 'Receitas, despesas e fluxo de caixa', color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-600' },
  { icon: GraduationCap, title: 'Desempenho Acadêmico', desc: 'Médias, aprovações e reprovações', color: 'from-primary/20 to-primary/5', iconColor: 'text-primary' },
  { icon: Users, title: 'Matrículas', desc: 'Novas matrículas, rematrículas e evasão', color: 'from-sky-500/20 to-sky-500/5', iconColor: 'text-sky-600' },
  { icon: ClipboardCheck, title: 'Frequência', desc: 'Presenças, faltas e justificativas', color: 'from-violet-500/20 to-violet-500/5', iconColor: 'text-violet-600' },
  { icon: Users, title: 'Alunos Ativos', desc: 'Distribuição por série, turma e turno', color: 'from-accent/30 to-accent/5', iconColor: 'text-accent' },
  { icon: AlertTriangle, title: 'Inadimplência', desc: 'Análise de atrasos e cobranças', color: 'from-red-500/20 to-red-500/5', iconColor: 'text-red-600' },
];

export default function Reports() {
  return (
    <div>
      <PageHeader title="Relatórios" subtitle="Análises e exportações de dados" icon={BarChart3} />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {REPORTS.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-2xl p-6 premium-shadow hover:premium-shadow-lg transition-all group cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-4`}>
              <r.icon className={`w-6 h-6 ${r.iconColor}`} strokeWidth={2} />
            </div>
            <h3 className="font-serif text-lg font-semibold mb-1">{r.title}</h3>
            <p className="text-sm text-muted-foreground mb-5">{r.desc}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1"><FileText className="w-3.5 h-3.5 mr-1.5" />Visualizar</Button>
              <Button variant="outline" size="sm" className="flex-1"><Download className="w-3.5 h-3.5 mr-1.5" />Exportar</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}