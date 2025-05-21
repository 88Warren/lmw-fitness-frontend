// export const getEnvVar = (key) => {
//   if (import.meta.env.MODE === 'development') {
//     return import.meta.env[key];
//   } else {
//     return window._env_?.[key] || '';
//   }
// };

export const getEnvVar = (name) => {
  // Access environment variable from import.meta.env
  const value = import.meta.env[name];
  
  if (value === undefined || value === '') {
    console.warn(`Environment variable ${name} is not defined`);
    
    // Fallback values for development (don't use in production)
    if (import.meta.env.DEV) {
      if (name === 'VITE_BACKEND_URL') {
        return 'http://localhost:8082';
      }
      if (name === 'VITE_RECAPTCHA_SITE_KEY') {
        return '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Google's test key
      }
    }
    
    return '';
  }
  
  return value;
};

// For debugging only
if (import.meta.env.DEV) {
  console.log('Environment Variables:', {
    VITE_BACKEND_URL: getEnvVar('VITE_BACKEND_URL'),
    VITE_RECAPTCHA_SITE_KEY: getEnvVar('VITE_RECAPTCHA_SITE_KEY'),
  });
}