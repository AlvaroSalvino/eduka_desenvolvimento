import { QueryClient } from '@tanstack/react-query';

export const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,

      queryFn: async ({ queryKey }) => {
        const [url] = queryKey;

        const response = await fetch(url, {
          credentials: 'include',
        });

        if (response.status === 401) {
          throw { type: 'auth_required' };
        }

        if (response.status === 403) {
          const data = await response.json();

          if (data?.reason === 'user_not_registered') {
            throw { type: 'user_not_registered' };
          }

          throw { type: 'forbidden' };
        }

        if (!response.ok) {
          throw new Error('Erro na requisição');
        }

        return response.json();
      },
    },
  },
});