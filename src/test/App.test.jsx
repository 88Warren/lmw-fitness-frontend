/* eslint-disable react/prop-types */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  createBrowserRouter: vi.fn(() => ({})),
  RouterProvider: ({ children }) => (
    <div data-testid="router-provider">{children}</div>
  ),
  Route: ({ element, children }) => <div>{element || children}</div>,
  createRoutesFromElements: vi.fn((routes) => routes),
  useLocation: vi.fn(() => ({ pathname: "/" })),
}));

// Mock the AuthContext
vi.mock("../context/AuthContext.jsx", () => ({
  AuthProvider: ({ children }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

// Mock the CartContext
vi.mock("../context/CartContext", () => ({
  CartProvider: ({ children }) => (
    <div data-testid="cart-provider">{children}</div>
  ),
}));

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    // Check that the providers are rendered
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("cart-provider")).toBeInTheDocument();
    expect(screen.getByTestId("router-provider")).toBeInTheDocument();
  });
});
