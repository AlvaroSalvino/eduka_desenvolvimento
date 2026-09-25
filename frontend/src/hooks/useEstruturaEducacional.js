import { useEffect, useState, useCallback } from 'react';
import {
  TiposGradesApi,
  NivelEnsinoApi,
  SerieApi,
  TurnoApi
} from '@/services/apiEducacional';

const getData = (res) => res?.results || res?.data || res || [];

export function useEstruturaEducacional() {
  const [tiposGrade, setTiposGrade] = useState([]);
  const [niveisEnsino, setNiveisEnsino] = useState([]);
  const [series, setSeries] = useState([]);
  const [turnos, setTurnos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingDependencias, setLoadingDependencias] = useState(false);

  const fetchBase = useCallback(async () => {
    setLoading(true);

    try {
      const [tg, tr] = await Promise.all([
        TiposGradesApi.list(),
        TurnoApi.list(),
      ]);

      setTiposGrade(getData(tg));
      setTurnos(getData(tr));
    } catch (err) {
      console.error('Erro base estrutura:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBase();
  }, [fetchBase]);

  const carregarNiveis = useCallback(async (tipoGradeId) => {
    if (!tipoGradeId) {
      setNiveisEnsino([]);
      setSeries([]);
      return;
    }

    setLoadingDependencias(true);

    try {
      const res = await NivelEnsinoApi.list({
        tipo_grade: tipoGradeId
      });

      setNiveisEnsino(getData(res));
      setSeries([]);
    } catch (err) {
      console.error('Erro níveis:', err);
    } finally {
      setLoadingDependencias(false);
    }
  }, []);

  const carregarSeries = useCallback(async (nivelId) => {
    if (!nivelId) {
      setSeries([]);
      return;
    }

    setLoadingDependencias(true);

    try {
      const res = await SerieApi.list({
        nivel: nivelId
      });

      setSeries(getData(res));
    } catch (err) {
      console.error('Erro séries:', err);
    } finally {
      setLoadingDependencias(false);
    }
  }, []);

  return {
    tiposGrade,
    niveisEnsino,
    series,
    turnos,

    loading,
    loadingDependencias,

    carregarNiveis,
    carregarSeries,
  };
}