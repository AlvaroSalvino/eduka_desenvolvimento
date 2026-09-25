import React, { useState } from 'react';
import { GraduationCap, Plus, Users, Clock, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';

import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import { useTurmas } from '@/hooks/useTurmas';
import { useEstruturaEducacional } from '@/hooks/useEstruturaEducacional';
import { motion, AnimatePresence } from 'framer-motion';

const SHIFT_LABELS = {
  manha: 'Manhã',
  tarde: 'Tarde',
  integral: 'Integral',
  noite: 'Noite',
  ead: 'EAD'
};

export default function Classes() {
  const { turmas: classes, loading: isLoading, totalTurmas, criarTurma, creating } = useTurmas();
  const {
    tiposGrade,
    niveisEnsino,
    series,
    turnos,
    loading: loadingEstrutura,
    carregarNiveis,
    carregarSeries
  } = useEstruturaEducacional();

  const getErrorMessage = (err) => {
    const data = err?.response?.data || err?.data;

    if (!data) return err?.message || 'Erro desconhecido';

    if (typeof data === 'string') return data;

    if (data.detail) return data.detail;

    if (data.non_field_errors?.length) {
      return data.non_field_errors[0];
    }

    const firstKey = Object.keys(data)[0];
    if (firstKey && Array.isArray(data[firstKey])) {
      return data[firstKey][0];
    }

    return 'Erro desconhecido';
  };

  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);

  const [nome, setNome] = useState('');
  const [anoLetivo, setAnoLetivo] = useState(new Date().getFullYear());
  const [periodoLetivo, setPeriodoLetivo] = useState('');
  const [serie, setSerie] = useState('');
  const [turno, setTurno] = useState('');
  const [capacidade, setCapacidade] = useState(30);
  const [tipoGrade, setTipoGrade] = useState('');
  const [nivelEnsino, setNivelEnsino] = useState('');

  const handleCriarTurma = async () => {
    try {
      await criarTurma({
        nome,
        serie: Number(serie),
        turno: Number(turno),
        ano_letivo: Number(anoLetivo),
        periodo_letivo: periodoLetivo ? Number(periodoLetivo) : null,
        capacidade: Number(capacidade),
      });

      setShowWizard(false);
      setStep(1);

      setNome('');
      setSerie('');
      setTurno('');
      setPeriodoLetivo('');
      setCapacidade(30);
      setAnoLetivo(new Date().getFullYear());

      toast.success("Turma criada com sucesso!");
    } catch (err) {
      toast.error(`Erro ao criar turma: ${getErrorMessage(err)}`);
    }
  };

  return (
    <div>
      <PageHeader
        title="Turmas & Séries"
        subtitle={`${totalTurmas} turma${totalTurmas !== 1 ? 's' : ''} ativa${totalTurmas !== 1 ? 's' : ''}`}
        icon={GraduationCap}
        actions={
          <Button
            className="bg-primary"
            onClick={() => {
              setShowWizard(true);
              setStep(1);
            }}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nova Turma
          </Button>
        }
      />

      {/* WIZARD */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-border rounded-3xl p-6 premium-shadow mb-6"
          >

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold">Dados da turma</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome da turma</Label>
                    <Input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: A"
                    />
                  </div>

                  <div>
                    <Label>Ano letivo</Label>
                    <Input
                      type="number"
                      value={anoLetivo}
                      onChange={(e) => setAnoLetivo(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Período letivo</Label>
                    <Select onValueChange={setPeriodoLetivo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold">Estrutura escolar</h3>

                <div className="grid md:grid-cols-2 gap-4">

                  {/* Tipo Grade */}
                  <div>
                    <Label>Tipo de Grade</Label>
                    <Select onValueChange={(value) => {
                      setTipoGrade(value);
                      setNivelEnsino('');
                      setSerie('');
                      carregarNiveis(value);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>

                      <SelectContent>
                        {tiposGrade.map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>
                            {t.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nível */}
                  <div>
                    <Label>Nível de Ensino</Label>
                    <Select onValueChange={(value) => {
                      setNivelEnsino(value);
                      setSerie('');
                      carregarSeries(value);
                    }} disabled={!tipoGrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>

                      <SelectContent>
                        {niveisEnsino
                          .filter(n => String(n.tipo_grade) === String(tipoGrade))
                          .map((n) => (
                            <SelectItem key={n.id} value={String(n.id)}>
                              {n.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>


                  <div className="md:col-span-2">
                    <Label>Série</Label>
                    <Select onValueChange={setSerie} disabled={!nivelEnsino}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a série" />
                      </SelectTrigger>

                      <SelectContent>
                        {series
                          .filter(s => String(s.nivel) === String(nivelEnsino))
                          .map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                </div>
              </div>
            )}


            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold">Turno e capacidade</h3>

                <div className="grid md:grid-cols-2 gap-4">

                  <div>
                    <Label>Turno</Label>
                    <Select onValueChange={setTurno}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>

                      <SelectContent>
                        {turnos.map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>
                            {t.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Capacidade</Label>
                    <Input
                      type="number"
                      value={capacidade}
                      onChange={(e) => setCapacidade(e.target.value)}
                    />
                  </div>

                </div>
              </div>
            )}


            {step === 4 && (
              <div className="text-center py-10">
                <Check className="w-10 h-10 mx-auto text-emerald-600 mb-4" />
                <h3 className="font-serif text-2xl font-bold">
                  Confirmar criação
                </h3>
                <p className="text-muted-foreground">
                  Tudo pronto para criar a turma.
                </p>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setShowWizard(false)}>
                Cancelar
              </Button>

              <div className="flex gap-2">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Voltar
                  </Button>
                )}

                {step < 4 ? (
                  <Button className="bg-primary" onClick={() => setStep(step + 1)}>
                    Próximo
                  </Button>
                ) : (
                  <Button
                    className="bg-primary"
                    onClick={handleCriarTurma}
                    disabled={creating}
                  >
                    {creating ? 'Criando...' : 'Confirmar'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-muted/40 rounded-2xl animate-pulse" />)}</div>
      ) : classes.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl premium-shadow">
          <EmptyState icon={GraduationCap} title="Sem turmas cadastradas" description="Organize suas séries e turmas para o ano letivo." />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c, i) => {
            const capacidade = Number(c.capacidade) || 0;
            const alunos = Number(c.alunos_ativos) || 0;

            const occupancy =
              capacidade > 0
                ? Math.round((alunos / capacidade) * 100)
                : 0;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-border rounded-2xl p-5 premium-shadow hover:premium-shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-serif text-xl font-bold">{c.nome}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {c.ano_letivo}
                      {c.periodo_letivo ? `.${c.periodo_letivo}` : ''}
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl gradient-gold flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-3.5 h-3.5" />{SHIFT_LABELS[c.turno] || c.turno || '—'}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><User className="w-3.5 h-3.5" />{c.teacher_name || 'Sem professor'}</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-3.5 h-3.5" />{c.alunos_ativos || 0} / {c.capacidade || '—'} alunos</div>
                </div>

                {c.capacidade && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Ocupação</span>
                      <span className="font-semibold">{Number.isFinite(occupancy) ? occupancy : 0}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${occupancy >= 90 ? 'bg-red-500' : occupancy >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(occupancy, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}