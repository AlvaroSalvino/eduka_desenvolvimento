import { useEffect, useState } from 'react';
import { matriculaApi } from '@/services/apiAluno';

export function useAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await matriculaApi.list();

        const data = response.results || response || [];

        const alunosFormatados = data.map((a) => ({
          id: a.id,

          nome: a.nome_completo,
          email: a.email,

          ra: a.ra,
          status: a.status,

          serie: a.serie,
          turma: a.turma,

          turno: a.turno,
        }));

        setAlunos(alunosFormatados);
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlunos();
  }, []);

  return {
    alunos,
    loading,
    totalAlunos: alunos.length,
  };
}