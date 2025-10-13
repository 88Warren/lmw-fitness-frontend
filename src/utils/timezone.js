// Utility functions for timezone detection and management
import { BACKEND_URL } from './config';

/**
 * Get the user's current timezone
 * @returns {string} The user's timezone (e.g., "America/New_York")
 */
export const getUserTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Could not detect timezone, falling back to UTC:', error);
    return 'UTC';
  }
};

/**
 * Update the user's timezone on the backend
 * @param {string} timezone - The timezone to set
 * @returns {Promise<boolean>} Success status
 */
export const updateUserTimezone = async (timezone) => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await fetch(`${BACKEND_URL}/api/timezone`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timezone }),
    });

    if (!response.ok) {
      throw new Error('Failed to update timezone');
    }

    return true;
  } catch (error) {
    console.error('Error updating timezone:', error);
    return false;
  }
};

/**
 * Auto-detect and set user timezone if not already set
 * @param {Object} user - User object from auth context
 * @returns {Promise<boolean>} Success status
 */
export const autoSetTimezone = async (user) => {
  // Only set timezone if user doesn't have one set or it's UTC (default)
  if (!user || (user.timezone && user.timezone !== 'UTC')) {
    return false;
  }

  const detectedTimezone = getUserTimezone();
  
  // Don't update if we detected UTC (might be intentional)
  if (detectedTimezone === 'UTC') {
    return false;
  }

  console.log(`Auto-setting timezone to: ${detectedTimezone}`);
  return await updateUserTimezone(detectedTimezone);
};

/**
 * Format a date in the user's timezone
 * @param {Date|string} date - Date to format
 * @param {string} timezone - User's timezone
 * @returns {string} Formatted date string
 */
export const formatDateInTimezone = (date, timezone = 'UTC') => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.warn('Error formatting date in timezone:', error);
    return date.toString();
  }
};

/**
 * Get midnight in the user's timezone for a given date
 * @param {Date|string} date - Date to get midnight for
 * @param {string} timezone - User's timezone
 * @returns {Date} Midnight in the user's timezone
 */
export const getMidnightInTimezone = (date, timezone = 'UTC') => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Create a date string in the user's timezone
    const dateString = dateObj.toLocaleDateString('en-CA', { timeZone: timezone }); // YYYY-MM-DD format
    
    // Create midnight in the user's timezone
    return new Date(`${dateString}T00:00:00`);
  } catch (error) {
    console.warn('Error getting midnight in timezone:', error);
    return new Date(date);
  }
};