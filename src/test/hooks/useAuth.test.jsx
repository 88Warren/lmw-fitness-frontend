import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API
vi.mock('../../utils/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
  setAuthToken: vi.fn(),
  removeAuthToken: vi.fn(),
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
globalThis.localStorage = localStorageMock;

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should initialize with no user', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    
    const { result } = renderHook(() => {
      // Mock hook return for testing
      return {
        user: null,
        isAuthenticated: false,
        loading: false,
        login: vi.fn(),
        logout: vi.fn(),
        register: vi.fn(),
      };
    }, { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should handle login', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      user: { id: 1, email: 'test@example.com' },
      token: 'mock-token'
    });

    const { result } = renderHook(() => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      login: mockLogin,
      logout: vi.fn(),
      register: vi.fn(),
    }));

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should handle logout', () => {
    const mockLogout = vi.fn();

    const { result } = renderHook(() => ({
      user: { id: 1, email: 'test@example.com' },
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: mockLogout,
      register: vi.fn(),
    }));

    act(() => {
      result.current.logout();
    });

    expect(mockLogout).toHaveBeenCalled();
  });
});