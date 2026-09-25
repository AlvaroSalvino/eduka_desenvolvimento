import { useEffect, useState, useCallback } from 'react';
import { TurmaApi } from '@/services/apiEducacional';

export function useTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const normalizarTurma = (t) => ({
    id: t.id,

    nome: t.nome_completo || t.nome,
    serie: t.serie,
    ano_letivo: t.ano_letivo,
    periodo_letivo: t.periodo_letivo,

    turno: t.turno_por_extenso,

    teacher_name: null,
    alunos_ativos: Number(t.alunos_ativos),
    capacidade: Number(t.capacidade),
  });

  const fetchTurmas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await TurmaApi.list();
      const data = response.results || response || [];

      const turmasNormalizadas = data.map(normalizarTurma);

      setTurmas(turmasNormalizadas);
    } catch (err) {
      console.error('Erro ao carregar turmas:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTurmas();
  }, [fetchTurmas]);

  const criarTurma = useCallback(async (dadosTurma) => {
    setCreating(true);
    setError(null);

    try {
      const response = await TurmaApi.create(dadosTurma);

      const novaTurma = normalizarTurma(response);

      setTurmas((prev) => [...prev, novaTurma]);

      return novaTurma;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCreating(false);
    }
  }, []);

  return {
    turmas,
    loading,
    creating,
    error,

    totalTurmas: turmas.length,

    fetchTurmas,
    criarTurma,
  };
}