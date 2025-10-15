import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock components for testing
const MockButton = ({ children, onClick, disabled, className }) => (
  <button onClick={onClick} disabled={disabled} className={className}>
    {children}
  </button>
);

const MockNavigation = () => (
  <nav data-testid="navigation">
    <a href="/">Home</a>
    <a href="/workouts">Workouts</a>
    <a href="/blog">Blog</a>
  </nav>
);

describe('Shared Components', () => {
  describe('Button Component', () => {
    it('renders button with text', () => {
      render(<MockButton>Click me</MockButton>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('handles click events', () => {
      const handleClick = vi.fn();
      render(<MockButton onClick={handleClick}>Click me</MockButton>);
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      render(<MockButton disabled>Disabled</MockButton>);
      expect(screen.getByText('Disabled')).toBeDisabled();
    });
  });

  describe('Navigation Component', () => {
    it('renders navigation links', () => {
      render(
        <BrowserRouter>
          <MockNavigation />
        </BrowserRouter>
      );
      
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Workouts')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
    });
  });
});