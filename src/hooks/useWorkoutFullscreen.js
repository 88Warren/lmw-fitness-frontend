import { useState, useEffect, useCallback } from "react";
import fullscreenManager from "../utils/fullscreenManager";

const useWorkoutFullscreen = () => {
  // Initialize state from the global manager
  const [isFullscreen, setIsFullscreen] = useState(
    () => fullscreenManager.isFullscreen
  );

  // Subscribe to fullscreen state changes
  useEffect(() => {
    // console.log(
    //   `[useWorkoutFullscreen] Hook mounted, current state: ${fullscreenManager.isFullscreen}`
    // );

    // Sync with current state immediately
    const currentState = fullscreenManager.isFullscreen;
    setIsFullscreen(currentState);

    // Subscribe to changes
    const unsubscribe = fullscreenManager.subscribe((newState) => {
    //   console.log(`[useWorkoutFullscreen] Received state change: ${newState}`);
      setIsFullscreen(newState);
    });

    // Set up a periodic sync to catch any missed state changes
    const syncInterval = setInterval(() => {
      const managerState = fullscreenManager.isFullscreen;
      if (managerState !== isFullscreen) {
        // console.log(
        //   `[useWorkoutFullscreen] Periodic sync detected state mismatch: ${isFullscreen} -> ${managerState}`
        // );
        setIsFullscreen(managerState);
      }
    }, 200); // Check every 200ms

    // Cleanup function
    return () => {
    //   console.log(`[useWorkoutFullscreen] Hook unmounting`);
      clearInterval(syncInterval);
      unsubscribe();

      // Only clear if user navigates away from workout
      if (fullscreenManager.shouldClearOnNavigation()) {
        // console.log(
        //   `[useWorkoutFullscreen] Clearing fullscreen state on navigation`
        // );
        fullscreenManager.clear();
      }
    };
  }, []); // Keep empty dependency array to avoid re-running

  const toggleFullscreen = useCallback(() => {
    fullscreenManager.toggle();
  }, []);

  const setFullscreenState = useCallback((state) => {
    fullscreenManager.setFullscreen(state);
  }, []);

  return {
    isFullscreen,
    toggleFullscreen,
    setFullscreenState,
  };
};

export default useWorkoutFullscreen;
