class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const defaultHeaders = {
  'Content-Type': 'application/json',
};

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const removeAuthToken = () => {
  authToken = null;
};

const buildHeaders = (customHeaders = {}) => {
  const headers = { ...defaultHeaders, ...customHeaders };
  
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  
  return headers;
};

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  let data;
  
  // Handle 204 No Content responses
  if (response.status === 204) {
    data = null;
  } else if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } else {
    data = await response.text();
  }
  
  if (!response.ok) {
    throw new ApiError(
      data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      data
    );
  }
  
  return { data, status: response.status, statusText: response.statusText };
};

export const get = async (url, config = {}) => {
  const { headers = {}, ...otherConfig } = config;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(headers),
    ...otherConfig,
  });
  
  return handleResponse(response);
};

export const post = async (url, data = null, config = {}) => {
  const { headers = {}, ...otherConfig } = config;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(headers),
    body: data ? JSON.stringify(data) : null,
    ...otherConfig,
  });
  
  return handleResponse(response);
};

export const put = async (url, data = null, config = {}) => {
  const { headers = {}, ...otherConfig } = config;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: buildHeaders(headers),
    body: data ? JSON.stringify(data) : null,
    ...otherConfig,
  });
  
  return handleResponse(response);
};

export const del = async (url, config = {}) => {
  const { headers = {}, ...otherConfig } = config;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: buildHeaders(headers),
    ...otherConfig,
  });
  
  return handleResponse(response);
};

const refreshToken = async () => {
  if (!authToken) {
    throw new ApiError('No auth token available for refresh', 401);
  }
  
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'}/api/refresh-token`, {
    method: 'POST',
    headers: buildHeaders(),
  });
  
  return handleResponse(response);
};

const api = {
  get,
  post,
  put,
  delete: del,
  setAuthToken,
  removeAuthToken,
  refreshToken,
};

export default api;