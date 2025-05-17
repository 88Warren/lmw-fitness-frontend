export const getEnvVar = (key) => {
  if (import.meta.env.MODE === 'development') {
    return import.meta.env[key];
  } else {
    return window._env_?.[key] || '';
  }
};