// export const getEnvVar = (name) => {
//   const value = import.meta.env[name];
  
//   if (value === undefined || value === '') {
//     console.warn(`Environment variable ${name} is not defined`);
    
//     if (import.meta.env.DEV) {
//       if (name === 'VITE_BACKEND_URL') {
//         return 'http://localhost:8082';
//       }
//       if (name === 'VITE_RECAPTCHA_SITE_KEY') {
//         return '6Ldn3-0qAAAAAMWv4iekZdMl4Xrfj2Av2zEL7onD'; 
//       }
//     }
    
//     return '';
//   }
  
//   return value;
// };

// if (import.meta.env.DEV) {
//   console.log('Environment Variables:', {
//     VITE_BACKEND_URL: getEnvVar('VITE_BACKEND_URL'),
//     VITE_RECAPTCHA_SITE_KEY: getEnvVar('VITE_RECAPTCHA_SITE_KEY'),
//   });
// }



export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// if (import.meta.env.DEV) {
//   console.log('Environment Variables (from Vite):', {
//     VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
//     VITE_RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
//   });
// }