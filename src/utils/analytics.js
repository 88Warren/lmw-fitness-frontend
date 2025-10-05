// Enhanced Analytics Utility
import { useCookieConsent } from '../hooks/useCookieConsent';

class Analytics {
  constructor() {
    this.isInitialized = false;
  }

  // Initialize analytics with cookie consent check
  init() {
    if (typeof window !== 'undefined' && window.gtag && !this.isInitialized) {
      this.isInitialized = true;
      console.log('Analytics initialized');
    }
  }

  // Check if analytics is allowed
  canTrack() {
    const cookiePrefs = JSON.parse(localStorage.getItem('cookiePreferences') || '{}');
    return cookiePrefs.analytics === true;
  }

  // Track page views
  trackPageView(path, title) {
    if (!this.canTrack() || typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('config', 'G-FVKJGWBKRN', {
      page_path: path,
      page_title: title,
    });
  }

  // Track custom events
  trackEvent(eventName, parameters = {}) {
    if (!this.canTrack() || typeof window === 'undefined' || !window.gtag) return;
    
    window.gtag('event', eventName, {
      event_category: parameters.category || 'engagement',
      event_label: parameters.label,
      value: parameters.value,
      ...parameters
    });
  }

  // Fitness-specific tracking methods
  trackWorkoutStart(workoutType, programName) {
    this.trackEvent('workout_start', {
      category: 'fitness',
      label: `${programName} - ${workoutType}`,
      workout_type: workoutType,
      program_name: programName
    });
  }

  trackWorkoutComplete(workoutType, programName, duration) {
    this.trackEvent('workout_complete', {
      category: 'fitness',
      label: `${programName} - ${workoutType}`,
      value: duration,
      workout_type: workoutType,
      program_name: programName,
      duration_minutes: duration
    });
  }

  trackSignup(method = 'email') {
    this.trackEvent('sign_up', {
      category: 'conversion',
      method: method
    });
  }

  trackNewsletterSignup() {
    this.trackEvent('newsletter_signup', {
      category: 'engagement',
      label: 'newsletter'
    });
  }

  trackPaymentStart(planType, amount) {
    this.trackEvent('begin_checkout', {
      category: 'ecommerce',
      currency: 'GBP',
      value: amount,
      items: [{
        item_id: planType,
        item_name: `${planType} Plan`,
        category: 'subscription',
        quantity: 1,
        price: amount
      }]
    });
  }

  trackPaymentSuccess(planType, amount, transactionId) {
    this.trackEvent('purchase', {
      category: 'ecommerce',
      transaction_id: transactionId,
      currency: 'GBP',
      value: amount,
      items: [{
        item_id: planType,
        item_name: `${planType} Plan`,
        category: 'subscription',
        quantity: 1,
        price: amount
      }]
    });
  }

  trackBlogRead(title, category) {
    this.trackEvent('blog_read', {
      category: 'content',
      label: title,
      blog_category: category
    });
  }

  trackCalculatorUse(calculatorType, result) {
    this.trackEvent('calculator_use', {
      category: 'tools',
      label: calculatorType,
      calculator_type: calculatorType,
      result_value: result
    });
  }

  trackContactForm() {
    this.trackEvent('contact_form_submit', {
      category: 'lead_generation',
      label: 'contact_form'
    });
  }

  // Track user engagement
  trackTimeOnPage(pageName, timeSpent) {
    this.trackEvent('page_engagement', {
      category: 'engagement',
      label: pageName,
      value: Math.round(timeSpent / 1000), // Convert to seconds
      time_spent_seconds: Math.round(timeSpent / 1000)
    });
  }

  // Track scroll depth
  trackScrollDepth(percentage, pageName) {
    this.trackEvent('scroll_depth', {
      category: 'engagement',
      label: pageName,
      value: percentage,
      scroll_percentage: percentage
    });
  }
}

export const analytics = new Analytics();
export default analytics;