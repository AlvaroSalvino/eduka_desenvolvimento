import React from 'react';
import { BookOpen, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const SUBJECTS = [
  { name: 'Matemática', b1: 8.5, b2: 8.7, b3: 9.0, b4: 9.2 },
  { name: 'Português', b1: 9.0, b2: 8.8, b3: 9.3, b4: 9.0 },
  { name: 'História', b1: 7.5, b2: 8.0, b3: 8.2, b4: 8.5 },
  { name: 'Geografia', b1: 8.0, b2: 8.3, b3: 8.5, b4: 8.7 },
  { name: 'Ciências', b1: 8.7, b2: 9.0, b3: 9.2, b4: 9.5 },
  { name: 'Inglês', b1: 9.2, b2: 9.5, b3: 9.3, b4: 9.7 },
];

export default function PortalGrades() {
  const evolution = ['1º Bim', '2º Bim', '3º Bim', '4º Bim'].map((p, i) => ({
    periodo: p,
    media: (SUBJECTS.reduce((s, sub) => s + [sub.b1, sub.b2, sub.b3, sub.b4][i], 0) / SUBJECTS.length).toFixed(2),
  }));

  return (
    <div>
      <PageHeader
        title="Notas & Boletim"
        subtitle="Seu desempenho acadêmico"
        icon={BookOpen}
        actions={<Button className="bg-primary"><Download className="w-4 h-4 mr-1.5" />Baixar Boletim</Button>}
      />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-card border border-border rounded-2xl overflow-hidden premium-shadow">
          <div className="p-5 border-b">
            <h3 className="font-serif text-lg font-semibold">Boletim {new Date().getFullYear()}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Disciplina</th>
                  <th className="text-center py-3 font-medium text-xs uppercase tracking-wider text-muted-foreground">1º</th>
                  <th className="text-center py-3 font-medium text-xs uppercase tracking-wider text-muted-foreground">2º</th>
                  <th className="text-center py-3 font-medium text-xs uppercase tracking-wider text-muted-foreground">3º</th>
                  <th className="text-center py-3 font-medium text-xs uppercase tracking-wider text-muted-foreground">4º</th>
                  <th className="text-center py-3 px-5 font-medium text-xs uppercase tracking-wider text-muted-foreground">Média</th>
                </tr>
              </thead>
              <tbody>
                {SUBJECTS.map((s) => {
                  const avg = ((s.b1 + s.b2 + s.b3 + s.b4) / 4).toFixed(1);
                  return (
                    <tr key={s.name} className="border-b last:border-b-0">
                      <td className="py-3 px-5 font-medium">{s.name}</td>
                      <td className="text-center">{s.b1.toFixed(1)}</td>
                      <td className="text-center">{s.b2.toFixed(1)}</td>
                      <td className="text-center">{s.b3.toFixed(1)}</td>
                      <td className="text-center">{s.b4.toFixed(1)}</td>
                      <td className="text-center py-3 px-5">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold">{avg}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-2">
              <TrendingUp className="w-4 h-4" />Evolução
            </div>
            <div className="font-serif text-4xl font-bold">8,7</div>
            <div className="text-xs text-muted-foreground mt-1">Média geral do ano</div>

            <div className="mt-5">
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={evolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="periodo" fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 10]} fontSize={10} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="media" stroke="hsl(222 65% 24%)" strokeWidth={2.5} dot={{ fill: 'hsl(42 45% 58%)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 premium-shadow">
            <h4 className="font-serif text-lg font-semibold mb-3">Situação</h4>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
              ✓ Aprovado
            </div>
            <p className="text-xs text-muted-foreground mt-3">Você está com excelente desempenho! Continue assim.</p>
          </div>
        </div>
      </div>
    </div>
  );
}