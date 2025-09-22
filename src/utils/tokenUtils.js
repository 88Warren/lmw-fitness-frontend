// Utility functions for JWT token handling

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiry and if it's expired
    if (!payload.exp) return false; // No expiry means it doesn't expire
    
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = 60; // 1 minute buffer before actual expiry
    
    return payload.exp < (currentTime + bufferTime);
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true; // If we can't parse it, consider it expired
  }
};

export const getTokenExpiryTime = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.exp ? new Date(payload.exp * 1000) : null;
  } catch (error) {
    console.error('Error getting token expiry time:', error);
    return null;
  }
};

export const getTimeUntilExpiry = (token) => {
  const expiryTime = getTokenExpiryTime(token);
  if (!expiryTime) return null;
  
  const currentTime = new Date();
  const timeUntilExpiry = expiryTime.getTime() - currentTime.getTime();
  
  return Math.max(0, timeUntilExpiry);
};