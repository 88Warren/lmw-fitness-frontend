import '@testing-library/jest-dom'

// Mock environment variables
globalThis.import = {
  meta: {
    env: {
      VITE_BACKEND_URL: 'http://localhost:8082',
      VITE_RECAPTCHA_SITE_KEY: 'test-key',
      VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_123',
    }
  }
}

// Mock window.location
delete window.location
window.location = { href: 'http://localhost:3000' }

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}