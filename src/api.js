import { API_URL } from './config';

export class ApiError extends Error {
  constructor(status, message, retryAfter) {
    super(message);
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

function newIdempotencyKey() {
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function embeddedItems(data) {
  if (!data || !data._embedded) {
    return [];
  }
  return Object.values(data._embedded).flat();
}

async function request(path, { method = 'GET', body, apiKey, version } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }
  if (version) {
    headers['X-API-Version'] = version;
  }
  if (method === 'POST') {
    headers['X-Idempotency-Key'] = newIdempotencyKey();
  }

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new ApiError(
      0,
      'Não foi possível conectar ao servidor. Se ele estava parado, aguarde cerca de 1 minuto e tente de novo.'
    );
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = null;
    }
  }

  if (!response.ok) {
    const message = data && data.message ? data.message : `Erro ${response.status} ao falar com o servidor.`;
    throw new ApiError(response.status, message, response.headers.get('Retry-After'));
  }

  return data;
}

export function registerUser({ username, email, password }) {
  return request('/users', { method: 'POST', body: { username, email, password } });
}

export function createApiKey({ username, password, name }) {
  return request('/api-keys', { method: 'POST', body: { username, password, name } });
}

export function revokeApiKey(id, apiKey) {
  return request(`/api-keys/${id}`, { method: 'DELETE', apiKey });
}

export async function findUserId(username, apiKey) {
  const data = await request(`/users/search?username=${encodeURIComponent(username)}&size=10`, { apiKey });
  const match = embeddedItems(data).find(
    (user) => user.username && user.username.toLowerCase() === username.toLowerCase()
  );
  if (!match) {
    throw new ApiError(404, 'Não foi possível localizar a sua conta.');
  }
  return match.id;
}

export async function searchTracks(name) {
  const data = await request(`/tracks/search?name=${encodeURIComponent(name)}&size=10`);
  return embeddedItems(data);
}

export function createArtist({ name, genre }, apiKey) {
  return request('/artists', { method: 'POST', body: { name, genre }, apiKey });
}

export function createTrack({ name, artistId }, apiKey) {
  return request('/tracks', { method: 'POST', body: { name, artistId }, apiKey });
}

export function createListen({ userId, trackId, durationSeconds }, apiKey) {
  return request('/listens', { method: 'POST', body: { userId, trackId, durationSeconds }, apiKey });
}

export async function fetchRanking({ userId, monthly, limit }, apiKey) {
  const path = monthly ? '/stats/top-tracks/monthly' : '/stats/top-tracks';
  const data = await request(`${path}?userId=${userId}&limit=${limit}`, { apiKey, version: '2' });
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((item, index) => ({
    ...item,
    rank: item.rank !== undefined ? item.rank : index + 1,
    totalMinutes:
      item.totalMinutes !== undefined ? item.totalMinutes : Math.round(item.totalSeconds / 6) / 10,
  }));
}
