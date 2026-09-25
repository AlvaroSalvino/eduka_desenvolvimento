import React from 'react';
import { useIes } from '@/hooks/useIes';
import { useQuery } from '@tanstack/react-query';
import { FileText, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { studentsApi } from '@/services/api';

const SUBJECTS = ['Português', 'Matemática', 'História', 'Geografia', 'Ciências', 'Inglês', 'Artes', 'Educação Física'];

export default function ReportCards() {
  const { nomeIes } = useIes();
  const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: studentsApi.list });
  const [selected, setSelected] = React.useState(null);

  const student = selected || students[0];

  return (
    <div>
      <PageHeader
        title="Boletins"
        subtitle="Emissão e visualização de boletins"
        icon={FileText}
        actions={
          <>
            <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-1.5" />Imprimir</Button>
            <Button className="bg-primary"><Download className="w-4 h-4 mr-1.5" />Baixar PDF</Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <div className="bg-card border border-border rounded-2xl p-4 premium-shadow h-fit">
          <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3 px-2">Alunos</div>
          <div className="space-y-1 max-h-[500px] overflow-y-auto scrollbar-thin">
            {students.slice(0, 20).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left p-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors ${student?.id === s.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">{s.full_name?.charAt(0)}</div>
                <div className="flex-1 truncate">{s.full_name}</div>
              </button>
            ))}
          </div>
        </div>

        {student ? (
          <div className="bg-card border border-border rounded-2xl p-8 premium-shadow">
            {/* Cabeçalho institucional */}
            <div className="text-center pb-6 border-b-2 border-primary">
              <div className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">{nomeIes ?? 'Eduka'}</div>
              <h2 className="font-serif text-3xl font-bold mt-1">Boletim Escolar</h2>
              <div className="text-xs text-muted-foreground mt-1">Ano Letivo {new Date().getFullYear()}</div>
            </div>

            <div className="grid grid-cols-3 gap-6 py-6 border-b">
              <InfoBlock label="Aluno" value={student.full_name} />
              <InfoBlock label="Matrícula" value={student.registration_number || '—'} />
              <InfoBlock label="Série / Turma" value={`${student.grade_level || '—'} ${student.class_name || ''}`} />
            </div>

            <table className="w-full mt-6 text-sm">
              <thead>
                <tr className="border-b-2 border-foreground">
                  <th className="text-left py-2 font-serif font-semibold">Disciplina</th>
                  <th className="text-center font-serif font-semibold">1º Bim</th>
                  <th className="text-center font-serif font-semibold">2º Bim</th>
                  <th className="text-center font-serif font-semibold">3º Bim</th>
                  <th className="text-center font-serif font-semibold">4º Bim</th>
                  <th className="text-center font-serif font-semibold">Média</th>
                  <th className="text-center font-serif font-semibold">Situação</th>
                </tr>
              </thead>
              <tbody>
                {SUBJECTS.map((s) => {
                  const g1 = (Math.random() * 4 + 6).toFixed(1);
                  const g2 = (Math.random() * 4 + 6).toFixed(1);
                  const g3 = (Math.random() * 4 + 6).toFixed(1);
                  const g4 = (Math.random() * 4 + 6).toFixed(1);
                  const avg = ((+g1 + +g2 + +g3 + +g4) / 4).toFixed(1);
                  const approved = +avg >= 7;
                  return (
                    <tr key={s} className="border-b">
                      <td className="py-3 font-medium">{s}</td>
                      <td className="text-center">{g1}</td>
                      <td className="text-center">{g2}</td>
                      <td className="text-center">{g3}</td>
                      <td className="text-center">{g4}</td>
                      <td className="text-center font-bold">{avg}</td>
                      <td className="text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${approved ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>
                          {approved ? 'Aprovado' : 'Recuperação'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-8 pt-6 border-t flex justify-between items-end text-xs text-muted-foreground">
              <div>
                <div>Frequência geral: <span className="font-bold text-foreground">94%</span></div>
                <div className="mt-1">Situação final: <span className="font-bold text-emerald-600">Aprovado</span></div>
              </div>
              <div className="text-right">
                <div className="w-48 border-t border-foreground pt-1 text-center">Direção</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
            Selecione um aluno
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{label}</div>
      <div className="font-medium mt-0.5">{value}</div>
    </div>
  );
}