import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileSignature, Plus, Check, User, UserCog, GraduationCap, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/shared/PageHeader';
import { enrollmentsApi } from '@/services/api';
import { GradeLevelSelect } from '@/lib/educationLevels.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const STEPS = [
  { key: 1, label: 'Dados do aluno', icon: User },
  { key: 2, label: 'Responsável', icon: UserCog },
  { key: 3, label: 'Série / Turma', icon: GraduationCap },
  { key: 4, label: 'Documentos', icon: Upload },
  { key: 5, label: 'Confirmação', icon: CheckCircle2 },
];

export default function Enrollments() {
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const { data: enrollments = [] } = useQuery({ queryKey: ['enrollments'], queryFn: enrollmentsApi.list });

  return (
    <div>
      <PageHeader
        title="Matrículas"
        subtitle="Fluxo de novas matrículas e renovações"
        icon={FileSignature}
        actions={<Button onClick={() => { setShowWizard(true); setStep(1); }} className="bg-primary"><Plus className="w-4 h-4 mr-1.5" />Nova Matrícula</Button>}
      />

      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-border rounded-3xl p-6 md:p-10 premium-shadow mb-6"
          >
            {/* Stepper */}
            <div className="flex items-center justify-between mb-10 overflow-x-auto">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className={cn(
                      'w-11 h-11 rounded-full flex items-center justify-center transition-all border-2',
                      step > s.key ? 'bg-primary border-primary text-primary-foreground' :
                      step === s.key ? 'bg-primary/10 border-primary text-primary' : 'bg-muted border-border text-muted-foreground'
                    )}>
                      {step > s.key ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                    </div>
                    <div className="text-[11px] font-medium text-center hidden md:block">{s.label}</div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cn('flex-1 h-0.5 mx-2 transition-all', step > s.key ? 'bg-primary' : 'bg-border')} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step content */}
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl mx-auto min-h-[250px]">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold">Dados do aluno</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><Label>Nome completo</Label><Input placeholder="João da Silva" /></div>
                    <div><Label>Data de nascimento</Label><Input type="date" /></div>
                    <div><Label>CPF</Label><Input placeholder="000.000.000-00" /></div>
                    <div><Label>RG</Label><Input /></div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold">Responsável</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><Label>Nome</Label><Input /></div>
                    <div><Label>CPF</Label><Input /></div>
                    <div><Label>Email</Label><Input type="email" /></div>
                    <div><Label>Telefone</Label><Input /></div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold">Nível, Série e Turma</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Nível de ensino</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Selecione o nível" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="infantil">Educação Infantil</SelectItem>
                          <SelectItem value="fundamental_1">Fund. I (1-5)</SelectItem>
                          <SelectItem value="fundamental_2">Fund. II (6-9)</SelectItem>
                          <SelectItem value="medio">Ensino Médio</SelectItem>
                          <SelectItem value="tecnico">Técnico</SelectItem>
                          <SelectItem value="graduacao">Graduação</SelectItem>
                          <SelectItem value="pos_graduacao">Pós-Graduação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Série / Semestre / Módulo</Label>
                      <GradeLevelSelect placeholder="Selecione" />
                    </div>
                    <div><Label>Curso (se aplicável)</Label><Input placeholder="Ex: Enfermagem, Administração..." /></div>
                    <div><Label>Turma</Label><Input placeholder="A, B, C..." /></div>
                    <div className="space-y-1.5">
                      <Label>Turno</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manha">Manhã</SelectItem>
                          <SelectItem value="tarde">Tarde</SelectItem>
                          <SelectItem value="noite">Noite</SelectItem>
                          <SelectItem value="integral">Integral</SelectItem>
                          <SelectItem value="ead">EAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Ano letivo</Label><Input type="number" defaultValue={new Date().getFullYear()} /></div>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold">Documentos</h3>
                  <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <div className="font-medium">Envie os documentos</div>
                    <div className="text-sm text-muted-foreground mt-1">RG, CPF, Comprovante de residência, Histórico</div>
                    <Button variant="outline" className="mt-4">Selecionar arquivos</Button>
                  </div>
                </div>
              )}
              {step === 5 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-2">Matrícula pronta!</h3>
                  <p className="text-muted-foreground">Revise os dados e confirme a matrícula.</p>
                </div>
              )}
            </motion.div>

            <div className="flex justify-between mt-10 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowWizard(false)}>Cancelar</Button>
              <div className="flex gap-2">
                {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Voltar</Button>}
                {step < STEPS.length ? (
                  <Button onClick={() => setStep(step + 1)} className="bg-primary">Próximo</Button>
                ) : (
                  <Button onClick={() => { setShowWizard(false); setStep(1); }} className="bg-primary">
                    <Check className="w-4 h-4 mr-1.5" />Confirmar matrícula
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card border border-border rounded-2xl premium-shadow">
        <div className="p-5 border-b">
          <h3 className="font-serif text-lg font-semibold">Matrículas em andamento</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{enrollments.length} processo(s)</p>
        </div>
        {enrollments.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">Nenhuma matrícula em andamento</div>
        ) : (
          <div className="divide-y">
            {enrollments.map((e) => (
              <div key={e.id} className="p-4 flex items-center gap-3 hover:bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {e.student_name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{e.student_name}</div>
                  <div className="text-xs text-muted-foreground">{e.grade_level} • {e.guardian_name}</div>
                </div>
                <div className="text-xs text-muted-foreground">Etapa {e.step || 1}/5</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}