import { api } from '@/api/edukaClient';

// Helper para query params
const buildQuery = (params = {}) => {
  const query = new URLSearchParams(params);
  return query.toString() ? `?${query.toString()}` : '';
};

// === TIPOS DE GRADES (Educacional) ===
export const TiposGradesApi = {
  list: (sort = 'nome', limit = 100) =>
    api.get(`/educacional/tipos-grades/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/educacional/tipos-grades/${id}/`),

  create: (data) =>
    api.post(`/educacional/tipos-grades/`, data),

  update: (id, data) =>
    api.put(`/educacional/tipos-grades/${id}/`, data),

  delete: (id) =>
    api.delete(`/educacional/tipos-grades/${id}/`),

  filter: (query, sort = 'nome', limit = 100) =>
    api.get(`/educacional/tipos-grades/${buildQuery({ ...query, ordering: sort, limit })}`),
};

// === NÍVEL de ENSINO (Educacional) ===
export const NivelEnsinoApi = {
  list: (sort = 'nome', limit = 100) =>
    api.get(`/educacional/niveis-ensinos/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/educacional/niveis-ensinos/${id}/`),

  create: (data) =>
    api.post(`/educacional/niveis-ensinos/`, data),

  update: (id, data) =>
    api.put(`/educacional/niveis-ensinos/${id}/`, data),

  delete: (id) =>
    api.delete(`/educacional/niveis-ensinos/${id}/`),

  filter: (query, sort = 'nome', limit = 100) =>
    api.get(`/educacional/niveis-ensinos/${buildQuery({ ...query, ordering: sort, limit })}`),
};

// === SERIES (Educacional) ===
export const SerieApi = {
  list: (sort = 'numero', limit = 100) =>
    api.get(`/educacional/series/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/educacional/series/${id}/`),

  create: (data) =>
    api.post(`/educacional/series/`, data),

  update: (id, data) =>
    api.put(`/educacional/series/${id}/`, data),

  delete: (id) =>
    api.delete(`/educacional/series/${id}/`),

  filter: (query, sort = 'numero', limit = 100) =>
    api.get(`/educacional/series/${buildQuery({ ...query, ordering: sort, limit })}`),
};

// === TURNOS (Educacional) ===
export const TurnoApi = {
  list: (sort = '-data_criacao', limit = 100) =>
    api.get(`/educacional/turnos/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/educacional/turnos/${id}/`),

  create: (data) =>
    api.post(`/educacional/turnos/`, data),

  update: (id, data) =>
    api.put(`/educacional/turnos/${id}/`, data),

  delete: (id) =>
    api.delete(`/educacional/turnos/${id}/`),

  filter: (query, sort = '-data_criacao', limit = 100) =>
    api.get(`/educacional/turnos/${buildQuery({ ...query, ordering: sort, limit })}`),
};

// === TURMAS (Educacional) ===
export const TurmaApi = {
  list: (sort = 'serie', limit = 100) =>
    api.get(`/educacional/turmas/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/educacional/turmas/${id}/`),

  create: (data) =>
    api.post(`/educacional/turmas/`, data),

  update: (id, data) =>
    api.put(`/educacional/turmas/${id}/`, data),

  delete: (id) =>
    api.delete(`/educacional/turmas/${id}/`),

  filter: (query, sort = 'serie', limit = 100) =>
    api.get(`/educacional/turmas/${buildQuery({ ...query, ordering: sort, limit })}`),
};