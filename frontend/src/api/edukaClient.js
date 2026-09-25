const BASE_URL = import.meta.env.VITE_API_URL;

const getCSRFToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);

  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }

  return '';
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData;

    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: 'Erro desconhecido' };
    }

    throw {
      status: response.status,
      data: errorData,
    };
  }

  if (response.status === 204) return null;

  return response.json();
};

export const api = {
  get: async (url) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      credentials: 'include',
    });

    return handleResponse(response);
  },

  post: async (url, data) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  put: async (url, data) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  delete: async (url) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-CSRFToken': getCSRFToken(),
      },
    });

    return handleResponse(response);
  },
};