import { useEffect } from 'react';
import { autoSetTimezone } from '../utils/timezone';

/**
 * Hook to automatically detect and set user timezone
 * @param {Object} user - User object from auth context
 * @param {Function} updateUser - Function to update user data
 */
const useTimezone = (user, updateUser) => {
  useEffect(() => {
    const setTimezoneIfNeeded = async () => {
      if (!user || !updateUser) return;

      try {
        const success = await autoSetTimezone(user);
        if (success) {
          console.log('Timezone auto-detected and updated');
          // Refresh user data to get the updated timezone
          updateUser();
        }
      } catch (error) {
        console.error('Error auto-setting timezone:', error);
      }
    };

    // Only run once when user is first loaded
    if (user && user.id) {
      setTimezoneIfNeeded();
    }
  }, [user?.id]); // Only depend on user ID to run once per user session

  return null; // This hook doesn't return anything
};

export default useTimezone;