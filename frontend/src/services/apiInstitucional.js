import { api } from '@/api/edukaClient';

// Helper para query params
const buildQuery = (params = {}) => {
  const query = new URLSearchParams(params);
  return query.toString() ? `?${query.toString()}` : '';
};

// === IES (Instituições) ===
export const iesApi = {
  list: (sort = '-data_criacao', limit = 5) =>
    api.get(`/instituicao/ies/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/instituicao/ies/${id}/`),

  create: (data) =>
    api.post(`/instituicao/ies/`, data),

  update: (id, data) =>
    api.put(`/instituicao/ies/${id}/`, data),

  delete: (id) =>
    api.delete(`/instituicao/ies/${id}/`),

  filter: (query, sort = '-data_criacao', limit = 5) =>
    api.get(`/instituicao/ies/${buildQuery({ ...query, ordering: sort, limit })}`),
};