import { useState, useEffect } from 'react';

const useCookieConsent = () => {
  const [cookiePreferences, setCookiePreferences] = useState(null);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent) {
      try {
        const preferences = JSON.parse(storedConsent);
        setCookiePreferences(preferences);
        setHasConsented(true);
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        localStorage.removeItem('cookieConsent');
      }
    }
  }, []);

  const updateCookiePreferences = (preferences) => {
    const consentData = {
      ...preferences,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setCookiePreferences(consentData);
    setHasConsented(true);
  };

  const clearCookieConsent = () => {
    localStorage.removeItem('cookieConsent');
    setCookiePreferences(null);
    setHasConsented(false);
  };

  const canUseAnalytics = () => {
    return cookiePreferences?.analytics === true;
  };

  const canUseMarketing = () => {
    return cookiePreferences?.marketing === true;
  };

  return {
    cookiePreferences,
    hasConsented,
    updateCookiePreferences,
    clearCookieConsent,
    canUseAnalytics,
    canUseMarketing
  };
};

export default useCookieConsent;