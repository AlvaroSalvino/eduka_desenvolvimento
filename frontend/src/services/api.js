import { api } from '@/api/edukaClient';

// Helper para query params
const buildQuery = (params = {}) => {
  const query = new URLSearchParams(params);
  return query.toString() ? `?${query.toString()}` : '';
};

// === STUDENTS ===
export const studentsApi = {
  list: (sort = '-created_date', limit = 100) =>
    api.get(`/core/students/${buildQuery({ ordering: sort, limit })}`),

  get: (id) =>
    api.get(`/core/students/${id}/`),

  create: (data) =>
    api.post(`/core/students/`, data),

  update: (id, data) =>
    api.put(`/core/students/${id}/`, data),

  delete: (id) =>
    api.delete(`/core/students/${id}/`),

  filter: (query, sort = '-created_date', limit = 100) =>
    api.get(`/core/students/${buildQuery({ ...query, ordering: sort, limit })}`),
};

// === GUARDIANS ===
export const guardiansApi = {
  list: () =>
    api.get(`/core/guardians/`),

  create: (data) =>
    api.post(`/core/guardians/`, data),

  update: (id, data) =>
    api.put(`/core/guardians/${id}/`, data),

  delete: (id) =>
    api.delete(`/core/guardians/${id}/`),
};

// === EMPLOYEES ===
export const employeesApi = {
  list: () =>
    api.get(`/core/employees/`),

  create: (data) =>
    api.post(`/core/employees/`, data),

  update: (id, data) =>
    api.put(`/core/employees/${id}/`, data),

  delete: (id) =>
    api.delete(`/core/employees/${id}/`),
};

// === CLASSES ===
export const classesApi = {
  list: () =>
    api.get(`/core/classes/`),

  create: (data) =>
    api.post(`/core/classes/`, data),

  update: (id, data) =>
    api.put(`/core/classes/${id}/`, data),

  delete: (id) =>
    api.delete(`/core/classes/${id}/`),
};

// === FINANCE ===
export const invoicesApi = {
  list: () =>
    api.get(`/core/invoices/`),

  filter: (query) =>
    api.get(`/core/invoices/${buildQuery(query)}`),

  create: (data) =>
    api.post(`/core/invoices/`, data),

  update: (id, data) =>
    api.put(`/core/invoices/${id}/`, data),

  delete: (id) =>
    api.delete(`/core/invoices/${id}/`),
};

// === PAYMENT PLANS ===
export const paymentPlansApi = {
  list: () =>
    api.get(`/core/payment-plans/`),

  filter: (query) =>
    api.get(`/core/payment-plans/${buildQuery(query)}`),

  create: (data) =>
    api.post(`/core/payment-plans/`, data),

  update: (id, data) =>
    api.put(`/core/payment-plans/${id}/`, data),

  delete: (id) =>
    api.delete(`/core/payment-plans/${id}/`),
};

// === REGISTRATION FEES ===
export const registrationFeesApi = {
  list: () => api.get(`/core/registration-fees/`),
  create: (data) => api.post(`/core/registration-fees/`, data),
  update: (id, data) => api.put(`/core/registration-fees/${id}/`, data),
  delete: (id) => api.delete(`/core/registration-fees/${id}/`),
};

// === MONTHLY FEES ===
export const monthlyFeesApi = {
  list: () => api.get(`/core/monthly-fees/`),
  create: (data) => api.post(`/core/monthly-fees/`, data),
  update: (id, data) => api.put(`/core/monthly-fees/${id}/`, data),
  delete: (id) => api.delete(`/core/monthly-fees/${id}/`),
};

// === DISCOUNTS ===
export const discountsApi = {
  list: () => api.get(`/core/discounts/`),
  create: (data) => api.post(`/core/discounts/`, data),
  update: (id, data) => api.put(`/core/discounts/${id}/`, data),
  delete: (id) => api.delete(`/core/discounts/${id}/`),
};

// === GRADES ===
export const gradesApi = {
  list: () =>
    api.get(`/core/grades/`),

  filter: (q) =>
    api.get(`/core/grades/${buildQuery(q)}`),

  create: (data) =>
    api.post(`/core/grades/`, data),

  update: (id, data) =>
    api.put(`/core/grades/${id}/`, data),
};

// === ATTENDANCE ===
export const attendanceApi = {
  list: () =>
    api.get(`/core/attendance/`),

  filter: (q) =>
    api.get(`/core/attendance/${buildQuery(q)}`),

  create: (data) =>
    api.post(`/core/attendance/`, data),

  bulkCreate: (data) =>
    api.post(`/core/attendance/bulk/`, data),
};

// === ANNOUNCEMENTS ===
export const announcementsApi = {
  list: () =>
    api.get(`/core/announcements/`),

  create: (data) =>
    api.post(`/core/announcements/`, data),

  update: (id, data) =>
    api.put(`/core/announcements/${id}/`, data),

  delete: (id) =>
    api.delete(`/core/announcements/${id}/`),
};

// === DOCUMENTS ===
export const documentsApi = {
  list: () =>
    api.get(`/core/documents/`),

  create: (data) =>
    api.post(`/core/documents/`, data),

  update: (id, data) =>
    api.put(`/core/documents/${id}/`, data),
};

// === CALENDAR ===
export const calendarApi = {
  list: () =>
    api.get(`/core/calendar/`),

  create: (data) =>
    api.post(`/core/calendar/`, data),

  update: (id, data) =>
    api.put(`/core/calendar/${id}/`, data),

  delete: (id) =>
    api.delete(`/core/calendar/${id}/`),
};

// === ENROLLMENTS ===
export const enrollmentsApi = {
  list: () =>
    api.get(`/core/enrollments/`),

  create: (data) =>
    api.post(`/core/enrollments/`, data),

  update: (id, data) =>
    api.put(`/core/enrollments/${id}/`, data),
};

// === UPLOAD ===
export const uploadApi = {
  file: (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/core/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};