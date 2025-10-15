import { describe, it, expect } from 'vitest';

// Mock utility functions for testing
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const calculateBMI = (weight, height) => {
  if (!weight || !height || weight <= 0 || height <= 0) return null;
  return (weight / (height * height)).toFixed(1);
};

const generateWorkoutId = () => {
  return `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should handle null date', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('calculateBMI', () => {
    it('should calculate BMI correctly', () => {
      expect(calculateBMI(70, 1.75)).toBe('22.9');
      expect(calculateBMI(80, 1.80)).toBe('24.7');
    });

    it('should handle invalid inputs', () => {
      expect(calculateBMI(0, 1.75)).toBeNull();
      expect(calculateBMI(70, 0)).toBeNull();
      expect(calculateBMI(null, 1.75)).toBeNull();
      expect(calculateBMI(70, null)).toBeNull();
    });
  });

  describe('generateWorkoutId', () => {
    it('should generate unique workout IDs', () => {
      const id1 = generateWorkoutId();
      const id2 = generateWorkoutId();
      
      expect(id1).toMatch(/^workout_\d+_[a-z0-9]+$/);
      expect(id2).toMatch(/^workout_\d+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });
});