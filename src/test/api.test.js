/* eslint-env node */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import api, { setAuthToken, removeAuthToken } from '../utils/api';

// Mock fetch globally
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('API Utility', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    removeAuthToken();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should make GET requests correctly', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {
        get: (key) => key === 'content-type' ? 'application/json' : null
      },
      text: () => Promise.resolve('{"message":"success"}'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const result = await api.get('https://api.example.com/test');

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    expect(result.data).toEqual({ message: 'success' });
    expect(result.status).toBe(200);
  });

  it('should make POST requests with data', async () => {
    const mockResponse = {
      ok: true,
      status: 201,
      statusText: 'Created',
      headers: {
        get: (key) => key === 'content-type' ? 'application/json' : null
      },
      text: () => Promise.resolve('{"id":1,"name":"test"}'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    const testData = { name: 'test', email: 'test@example.com' };
    const result = await api.post('https://api.example.com/users', testData);

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    expect(result.data).toEqual({ id: 1, name: 'test' });
  });

  it('should include auth token in headers when set', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: {
        get: (key) => key === 'content-type' ? 'application/json' : null
      },
      text: () => Promise.resolve('{"authenticated":true}'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    setAuthToken('test-token-123');
    await api.get('https://api.example.com/profile');

    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-123',
      },
    });
  });

  it('should handle error responses', async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: {
        get: (key) => key === 'content-type' ? 'application/json' : null
      },
      text: () => Promise.resolve('{"message":"Invalid data"}'),
    };
    mockFetch.mockResolvedValue(mockResponse);

    await expect(api.post('https://api.example.com/invalid', {}))
      .rejects
      .toThrow('Invalid data');
  });
});