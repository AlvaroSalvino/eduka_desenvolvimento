import { useEffect, useState } from 'react';
import { iesApi } from '@/services/apiInstitucional';

export function useIes() {
  const [ies, setIes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIes = async () => {
      try {
        const response = await iesApi.list();
        const data = response.results || response;

        // como só existe uma IES
        if (data.length > 0) {
          setIes(data[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar IES:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIes();
  }, []);

  return {
    ies,
    nomeIes: ies?.nome,
    loading,
  };
}