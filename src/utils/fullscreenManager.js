// Global fullscreen state manager to handle state persistence across component remounts
class FullscreenManager {
  constructor() {
    this.listeners = new Set();
    this.STORAGE_KEY = 'workoutFullscreen';
    this.DOM_ATTRIBUTE = 'data-workout-fullscreen';
    this._isFullscreen = this.getStoredState();
    
    // Set initial DOM state
    this.updateDOMState(this._isFullscreen);
    
    // Listen for storage changes from other tabs/windows
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange.bind(this));
    }
  }

  getStoredState() {
    try {
      // Check both sessionStorage and DOM attribute for maximum reliability
      const storageState = sessionStorage.getItem(this.STORAGE_KEY) === 'true';
      const domState = document.body?.getAttribute(this.DOM_ATTRIBUTE) === 'true';
      
      // If they differ, prefer the DOM state as it's more persistent during re-renders
      if (storageState !== domState && domState !== null) {
        return domState;
      }
      
      return storageState;
    } catch (error) {
      console.warn('Error reading fullscreen state:', error);
      return false;
    }
  }

  updateDOMState(state) {
    try {
      if (document.body) {
        if (state) {
          document.body.setAttribute(this.DOM_ATTRIBUTE, 'true');
        } else {
          document.body.removeAttribute(this.DOM_ATTRIBUTE);
        }
      }
    } catch (error) {
      console.warn('Error updating DOM state:', error);
    }
  }

  handleStorageChange(event) {
    if (event.key === this.STORAGE_KEY) {
      const newState = event.newValue === 'true';
      if (this._isFullscreen !== newState) {
        this._isFullscreen = newState;
        this.updateDOMState(newState);
        this.notifyListeners(newState);
      }
    }
  }

  get isFullscreen() {
    // Double-check with DOM state for maximum reliability
    try {
      const domState = document.body?.getAttribute(this.DOM_ATTRIBUTE) === 'true';
      if (domState !== this._isFullscreen) {
        // console.log(`[FullscreenManager] DOM state mismatch detected, syncing: ${this._isFullscreen} -> ${domState}`);
        this._isFullscreen = domState;
      }
    } catch (error) {
      console.warn('Error checking DOM state:', error);
    }
    
    return this._isFullscreen;
  }

  notifyListeners(state) {
    // console.log(`[FullscreenManager] Notifying ${this.listeners.size} listeners`);
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (error) {
        console.warn('Error notifying fullscreen listener:', error);
      }
    });
  }

  setFullscreen(state) {
    if (this._isFullscreen !== state) {
      // console.log(`[FullscreenManager] Changing fullscreen state: ${this._isFullscreen} -> ${state}`);
      this._isFullscreen = state;
      
      try {
        if (state) {
          sessionStorage.setItem(this.STORAGE_KEY, 'true');
        } else {
          sessionStorage.removeItem(this.STORAGE_KEY);
        }
      } catch (error) {
        console.warn('Error saving fullscreen state:', error);
      }

      // Update DOM state for persistence during re-renders
      this.updateDOMState(state);

      // Notify all listeners
      this.notifyListeners(state);
    }
  }

  toggle() {
    this.setFullscreen(!this.isFullscreen);
  }

  subscribe(listener) {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  clear() {
    this.setFullscreen(false);
  }

  // Check if we're still in a workout page
  shouldClearOnNavigation() {
    return !window.location.pathname.includes('/workout/');
  }
}

// Create singleton instance
const fullscreenManager = new FullscreenManager();

export default fullscreenManager;