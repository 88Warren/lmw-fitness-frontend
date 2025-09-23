// Runtime environment variables (injected by Kubernetes)
const getRuntimeEnv = (key) => {
  if (typeof window !== 'undefined' && window._env_) {
    return window._env_[key];
  }
  return null;
};

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || getRuntimeEnv('VITE_BACKEND_URL');
export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || getRuntimeEnv('VITE_RECAPTCHA_SITE_KEY');
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || getRuntimeEnv('VITE_STRIPE_PUBLISHABLE_KEY');
export const BEGINNER_PRICE_ID = import.meta.env.VITE_BEGINNER_PRICE_ID || getRuntimeEnv('VITE_BEGINNER_PRICE_ID');
export const ADVANCED_PRICE_ID = import.meta.env.VITE_ADVANCED_PRICE_ID || getRuntimeEnv('VITE_ADVANCED_PRICE_ID');
export const TAILORED_COACHING_PRICE_ID = import.meta.env.VITE_TAILORED_COACHING_PRICE_ID || getRuntimeEnv('VITE_TAILORED_COACHING_PRICE_ID'); 
export const ULTIMATE_MINDSET_PACKAGE_PRICE_ID = import.meta.env.VITE_ULTIMATE_MINDSET_PACKAGE_PRICE_ID || getRuntimeEnv('VITE_ULTIMATE_MINDSET_PACKAGE_PRICE_ID');
export const DISCOUNT_AMOUNT = import.meta.env.VITE_DISCOUNT_AMOUNT || getRuntimeEnv('VITE_DISCOUNT_AMOUNT');
