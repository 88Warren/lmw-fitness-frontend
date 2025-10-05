import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import analytics from '../utils/analytics';

export const useAnalytics = () => {
  const location = useLocation();
  const startTimeRef = useRef(Date.now());
  const scrollDepthRef = useRef(0);

  // Track page views
  useEffect(() => {
    analytics.init();
    analytics.trackPageView(location.pathname, document.title);
    startTimeRef.current = Date.now();
    scrollDepthRef.current = 0;
  }, [location]);

  // Track time on page when component unmounts
  useEffect(() => {
    return () => {
      const timeSpent = Date.now() - startTimeRef.current;
      if (timeSpent > 5000) { // Only track if user spent more than 5 seconds
        analytics.trackTimeOnPage(location.pathname, timeSpent);
      }
    };
  }, [location]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      // Track at 25%, 50%, 75%, and 100% scroll depths
      const milestones = [25, 50, 75, 100];
      const currentMilestone = milestones.find(m => scrollPercent >= m && scrollDepthRef.current < m);
      
      if (currentMilestone) {
        scrollDepthRef.current = currentMilestone;
        analytics.trackScrollDepth(currentMilestone, location.pathname);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  return {
    trackWorkoutStart: analytics.trackWorkoutStart.bind(analytics),
    trackWorkoutComplete: analytics.trackWorkoutComplete.bind(analytics),
    trackSignup: analytics.trackSignup.bind(analytics),
    trackNewsletterSignup: analytics.trackNewsletterSignup.bind(analytics),
    trackPaymentStart: analytics.trackPaymentStart.bind(analytics),
    trackPaymentSuccess: analytics.trackPaymentSuccess.bind(analytics),
    trackBlogRead: analytics.trackBlogRead.bind(analytics),
    trackCalculatorUse: analytics.trackCalculatorUse.bind(analytics),
    trackContactForm: analytics.trackContactForm.bind(analytics),
    trackEvent: analytics.trackEvent.bind(analytics),
  };
};

export default useAnalytics;