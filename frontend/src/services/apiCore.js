import { api } from '@/api/edukaClient';

// Helper para query params
const buildQuery = (params = {}) => {
  const query = new URLSearchParams(params);
  return query.toString() ? `?${query.toString()}` : '';
};

// === PESSOA (Core) ===
export const pessoaApi = {
  list: (sort = '-data_criacao', limit = 100) =>
    api.get(`/core/pessoas/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/core/pessoas/${id}/`),

  create: (data) =>
    api.post(`/core/pessoas/`, data),

  update: (id, data) =>
    api.put(`/core/pessoas/${id}/`, data),

  delete: (id) =>
    api.delete(`/core/pessoas/${id}/`),

  filter: (query, sort = '-data_criacao', limit = 100) =>
    api.get(`/core/pessoas/${buildQuery({ ...query, ordering: sort, limit })}`),
};

// === PERFIL (Core) ===
export const perfilApi = {
  list: (sort = '-data_criacao', limit = 100) =>
    api.get(`/core/perfis/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/core/perfis/${id}/`),

  create: (data) =>
    api.post(`/core/perfis/`, data),

  update: (id, data) =>
    api.put(`/core/perfis/${id}/`, data),

  delete: (id) =>
    api.delete(`/core/perfis/${id}/`),

  filter: (query, sort = '-data_criacao', limit = 100) =>
    api.get(`/core/perfis/${buildQuery({ ...query, ordering: sort, limit })}`),
};