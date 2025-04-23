const getEnvVar = (key) => {
  if (import.meta.env.MODE === 'development') {
    return import.meta.env[key];
  } else {
    return window._env_?.[key] || '';
  }
};

export const BACKEND_URL = getEnvVar('VITE_BACKEND_URL') || ''  ;
export const RECAPTCHA_KEY = getEnvVar('VITE_RECAPTCHA_SITE_KEY');