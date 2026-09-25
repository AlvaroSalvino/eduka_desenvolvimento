import { api } from '@/api/edukaClient';

// Helper para query params
const buildQuery = (params = {}) => {
  const query = new URLSearchParams(params);
  return query.toString() ? `?${query.toString()}` : '';
};

// === ALUNOS (Aluno) ===
export const alunoApi = {
  list: (sort = '-data_criacao', limit = 100) =>
    api.get(`/aluno/alunos/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/aluno/alunos/${id}/`),

  create: (data) =>
    api.post(`/aluno/alunos/`, data),

  update: (id, data) =>
    api.put(`/aluno/alunos/${id}/`, data),

  delete: (id) =>
    api.delete(`/aluno/alunos/${id}/`),

  filter: (query, sort = '-data_criacao', limit = 100) =>
    api.get(`/aluno/alunos/${buildQuery({ ...query, ordering: sort, limit })}`),
};

// === MATRICULAS (Aluno) ===
export const matriculaApi = {
  list: (sort = '-data_matricula', limit = 100) =>
    api.get(`/aluno/matriculas/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/aluno/matriculas/${id}/`),

  create: (data) =>
    api.post(`/aluno/matriculas/`, data),

  update: (id, data) =>
    api.put(`/aluno/matriculas/${id}/`, data),

  delete: (id) =>
    api.delete(`/aluno/matriculas/${id}/`),

  filter: (query, sort = '-data_matricula', limit = 100) =>
    api.get(`/aluno/matriculas/${buildQuery({ ...query, ordering: sort, limit })}`),
};